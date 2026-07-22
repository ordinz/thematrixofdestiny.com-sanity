#!/usr/bin/env node
/**
 * Scrape the Gadalkindom child matrix report for a given birthdate/gender/name
 * and emit two NDJSON files:
 *
 *   out/snapshots.ndjson        — one sourceSnapshot document
 *   out/interpretations.ndjson  — one draft interpretationBlock per arcana block
 *
 * Usage:
 *   node scripts/child-matrix/scrape-gadalkindom.mjs \
 *     --date 2025-09-25 --gender male --name Elijah \
 *     --out ./out/child-matrix
 *
 * Notes:
 *   - Section/position resolution mirrors seed/child-matrix/{sections,positions}.ndjson.
 *   - Interpretation blocks are created as Sanity drafts (`_id` prefixed with `drafts.`)
 *     with `qualityStatus: "raw"` and `bodyEnLiteral`/`bodyEnProduct` left empty.
 *   - No page mutation is attempted — only GET.
 */

import fs from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import {argv, exit} from 'node:process'
import {fileURLToPath} from 'node:url'
import {calculateMatrixNumbers, resolveCalcValue} from './matrixNumbers.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const SOURCE_URL_BASE = 'https://gadalkindom.ru/matritsa-sudby/detskaya.html'
const SOURCE_SITE = 'gadalkindom'
const PARSER_VERSION = '1.1.0'

// ---------- CLI parsing ----------

function parseArgs(args) {
  const out = {}
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a.startsWith('--')) {
      const key = a.slice(2)
      const val = args[i + 1] && !args[i + 1].startsWith('--') ? args[++i] : true
      out[key] = val
    }
  }
  return out
}

const args = parseArgs(argv.slice(2))
if (!args.date || !args.gender || !args.name) {
  console.error('Usage: scrape-gadalkindom.mjs --date YYYY-MM-DD --gender male|female --name <name> [--out <dir>]')
  exit(1)
}

const outDir = args.out || './out/child-matrix'
fs.mkdirSync(outDir, {recursive: true})

// ---------- Fetch ----------

const url = `${SOURCE_URL_BASE}?m_name=${encodeURIComponent(args.name)}&gender=${args.gender}&m_date=${args.date}`
console.error(`[fetch] ${url}`)
const res = await fetch(url, {
  headers: {
    'User-Agent':
      'Mozilla/5.0 (compatible; MatrixOfDestinyImporter/1.0; +https://thematrixofdestiny.com)',
    'Accept-Language': 'ru,en;q=0.8',
  },
})
if (!res.ok) {
  console.error(`Fetch failed: HTTP ${res.status}`)
  exit(2)
}
const html = await res.text()

// ---------- Extract main body ----------

const start = html.indexOf('Расшифровка матрицы судьбы')
const end = html.indexOf('comments-headline')
if (start === -1) {
  console.error('Could not find report body in response.')
  exit(3)
}
const body = html.slice(start, end === -1 ? html.length : end)

// ---------- Tokenize by heading ----------
//
// The source HTML has malformed nesting in a few places (e.g. `<p><h3>...</h3>`),
// which means naive alternation between <p> and <h> can swallow headings.
// So we do two passes:
//   1. Split the body into an ordered token stream keyed by heading positions.
//   2. Inside each heading segment, extract paragraphs and list items.

const headingMatches = [...body.matchAll(/<h([234])[^>]*>([\s\S]*?)<\/h\1>/g)]
const tokens = []
for (let i = 0; i < headingMatches.length; i++) {
  const hm = headingMatches[i]
  const level = Number(hm[1])
  const text = cleanText(hm[2])
  tokens.push({kind: 'h', level, text})

  const segStart = hm.index + hm[0].length
  const segEnd = i + 1 < headingMatches.length ? headingMatches[i + 1].index : body.length
  const segment = body.slice(segStart, segEnd)

  const chunkRx = /<p[^>]*>([\s\S]*?)<\/p>|<li[^>]*>([\s\S]*?)<\/li>/g
  let cm
  while ((cm = chunkRx.exec(segment)) !== null) {
    if (cm[1] !== undefined) {
      const t = cleanText(cm[1])
      if (t) tokens.push({kind: 'p', text: t})
    } else if (cm[2] !== undefined) {
      const t = cleanText(cm[2])
      if (t) tokens.push({kind: 'li', text: t})
    }
  }
}

function cleanText(s) {
  return s
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#8230;/g, '…')
    .replace(/&#8211;/g, '–')
    .replace(/&#8212;/g, '—')
    .replace(/\s+/g, ' ')
    .trim()
}

// ---------- Section / position mapping ----------

const SECTIONS_BY_RU_TITLE = {
  'Визитная карточка: личные качества и характер ребёнка': 'personality',
  'Врождённые таланты ребёнка': 'innate-talents',
  'Отношения ребёнка с родителями': 'parent-relationship',
  'Рекомендации по воспитанию ребёнка': 'parenting-guidance',
  'Родовые программы (задачи) по линиям отца и матери': 'ancestral-programs',
  'Личное предназначение ребёнка': 'personal-purpose',
  'Социальное предназначение ребёнка': 'social-purpose',
  'Духовное предназначение ребёнка': 'spiritual-purpose',
}

const POSITION_BY_RU_LABEL = {
  'Личные таланты': 'personal-talents',
  'Таланты по линии отца': 'father-line-talents',
  'Таланты по линии матери': 'mother-line-talents',
  'Направление самореализации ребёнка:': 'self-realization-direction',
  'Первое поколение: карма самого ребёнка': 'generation-1',
  'Второе поколение: карма родителей': 'generation-2',
  'Третье поколение: карма бабушек и дедушек': 'generation-3',
  'Рекомендации отцу': 'father-guidance',
  'Рекомендации матери': 'mother-guidance',
  // 'Идеальная модель отношений' is intentionally NOT a position switch —
  // it appears as a sub-heading inside each personality arcana block and
  // should be kept as part of that arcana's body.
}

// Section-level default position (used when H4 is an arcana heading directly)
const DEFAULT_POSITION_BY_SECTION = {
  personality: 'outer-character',
  'ancestral-programs': 'ancestral-line',
  'personal-purpose': 'heaven-purpose',
  'social-purpose': 'social-male',
  'spiritual-purpose': 'spiritual-main',
}

/**
 * Ordinal position within a section when the source lists 2–3 unlabeled arcana.
 * Personal purpose: sky → earth → result (dedupes when sky===earth).
 * Social: m → f → result (source may emit m + result when m===f).
 * Personality: day (a) → month (b).
 */
function ordinalPositionKey(section, index) {
  if (section === 'personality') {
    return index === 0 ? 'outer-character' : 'sky-character'
  }
  if (section === 'personal-purpose') {
    if (index === 0) return 'heaven-purpose'
    if (index === 1) return 'earth-purpose'
    return 'personal-result'
  }
  if (section === 'social-purpose') {
    if (index === 0) return 'social-male'
    if (index === 1) return 'social-female'
    return 'social-result'
  }
  return null
}

// ---------- Walk tokens ----------

const arcanaHeadingRx = /^(\d{1,2})\s+аркан\s+(.+)$/i

const blocks = []
let currentSection = null
let currentPosition = null
let currentArcana = null
let currentBuf = null
let arcanaIndexInSection = 0

function flush() {
  if (currentArcana && currentBuf) {
    blocks.push(currentBuf)
  }
  currentBuf = null
}

for (const tok of tokens) {
  if (tok.kind === 'h' && tok.level === 3) {
    flush()
    currentSection = SECTIONS_BY_RU_TITLE[tok.text] || null
    currentPosition = null
    currentArcana = null
    arcanaIndexInSection = 0
    continue
  }
  if (tok.kind === 'h' && tok.level === 4) {
    // Is it an arcana heading?
    const am = tok.text.match(arcanaHeadingRx)
    if (am) {
      flush()
      currentArcana = {
        number: Number(am[1]),
        titleRu: tok.text,
        cardNameRu: am[2].trim(),
      }
      // Labeled position (H4 talent/generation) wins; otherwise ordinal defaults.
      let posKey = currentPosition
      if (!posKey) {
        posKey =
          ordinalPositionKey(currentSection, arcanaIndexInSection) ||
          DEFAULT_POSITION_BY_SECTION[currentSection] ||
          null
      }
      arcanaIndexInSection++
      currentBuf = {
        section: currentSection,
        position: posKey,
        arcana: currentArcana,
        titleRu: tok.text,
        paragraphs: [],
        bullets: [],
        headingPath: [tok.text],
      }
    } else if (POSITION_BY_RU_LABEL[tok.text]) {
      flush()
      currentPosition = POSITION_BY_RU_LABEL[tok.text]
      arcanaIndexInSection = 0
      currentArcana = null
    } else if (currentBuf) {
      // Sub-heading inside a current arcana block ("Идеальная модель отношений" nested)
      currentBuf.headingPath.push(tok.text)
      currentBuf.paragraphs.push(`### ${tok.text}`)
    }
    continue
  }
  if (!currentBuf) continue
  if (tok.kind === 'p') {
    currentBuf.paragraphs.push(tok.text)
  } else if (tok.kind === 'li') {
    currentBuf.bullets.push(tok.text)
  }
}
flush()

// ---------- Disambiguate ordinal purpose/social against matrix calc ----------
const calcMap = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'position-calc-map.json'), 'utf8'),
)
const matrixNums = calculateMatrixNumbers(args.date)

function expectedFor(positionKey) {
  return resolveCalcValue(matrixNums, calcMap.positions[positionKey])
}

function rematchSection(sectionKey, candidates) {
  const sectionBlocks = blocks.filter((b) => b.section === sectionKey && !b._labeled)
  if (sectionBlocks.length === 0) return
  const unused = new Set(candidates)
  for (const b of sectionBlocks) {
    let best = null
    for (const key of unused) {
      const exp = expectedFor(key)
      if (typeof exp === 'number' && exp === b.arcana.number) {
        best = key
        break
      }
    }
    if (best) {
      b.position = best
      unused.delete(best)
    }
  }
}

// Mark H4-labeled positions so rematch won't move them
for (const b of blocks) {
  if (
    b.position &&
    ![
      'outer-character',
      'sky-character',
      'heaven-purpose',
      'earth-purpose',
      'personal-result',
      'social-male',
      'social-female',
      'social-result',
    ].includes(b.position)
  ) {
    b._labeled = true
  }
}

rematchSection('personality', ['outer-character', 'sky-character'])
rematchSection('personal-purpose', ['heaven-purpose', 'earth-purpose', 'personal-result'])
rematchSection('social-purpose', ['social-male', 'social-female', 'social-result'])

for (const b of blocks) {
  b.calcPath = calcMap.positions[b.position]?.calcPath ?? null
  const exp = expectedFor(b.position)
  b.matrixValue = typeof exp === 'number' ? exp : Array.isArray(exp) ? exp : null
  if (typeof exp === 'number' && exp !== b.arcana.number) {
    console.error(
      `[warn] calc mismatch ${b.section}/${b.position}: scraped ${b.arcana.number} vs matrix ${exp}`,
    )
  }
}

// ---------- Build documents ----------

const rawText = body.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim()
const contentHash = crypto.createHash('sha256').update(rawText).digest('hex')
const fetchedAt = new Date().toISOString()

const snapshotId = `sourceSnapshot.gadalkindom.child.${contentHash.slice(0, 12)}`

const snapshot = {
  _id: snapshotId,
  _type: 'sourceSnapshot',
  pageTitle: 'Детская Матрица судьбы — Gadalkindom',
  sourceUrl: url,
  sourceSite: SOURCE_SITE,
  experienceKind: 'child',
  language: 'ru',
  fetchedAt,
  parserVersion: PARSER_VERSION,
  contentHash,
  rawText: rawText.slice(0, 200_000),
  rawHtml: body.slice(0, 200_000),
  normalizedJson: JSON.stringify({
    inputs: {date: args.date, gender: args.gender, name: args.name},
    blocks: blocks.map((b) => ({
      section: b.section,
      position: b.position,
      arcanaNumber: b.arcana.number,
      cardNameRu: b.arcana.cardNameRu,
      headingPath: b.headingPath,
    })),
  }),
  notes: `Scraped for ${args.name} (${args.gender}, ${args.date}) via scripts/child-matrix/scrape-gadalkindom.mjs.`,
}

function portableTextFromParagraphs(paragraphs) {
  return paragraphs.map((text, idx) => ({
    _type: 'block',
    _key: `p${idx}`,
    style: text.startsWith('### ') ? 'h4' : 'normal',
    markDefs: [],
    children: [
      {
        _type: 'span',
        _key: `s${idx}`,
        text: text.startsWith('### ') ? text.slice(4) : text,
        marks: [],
      },
    ],
  }))
}

const interpretations = blocks
  .filter((b) => b.section && b.arcana)
  .map((b) => {
    const secId = `section.child.${b.section}`
    const posId = b.position ? `position.child.${b.section}.${b.position.replace(/-/g, '-')}` : null
    // Position ids follow seed convention: position.child.<section>.<positionKey without redundant prefix>
    const positionRefId = b.position ? mapPositionId(b.section, b.position) : null
    const humanKey = `${b.section}-${b.position || 'default'}-${b.arcana.number}`
    return {
      _id: `drafts.interpretationBlock.child.${humanKey}`,
      _type: 'interpretationBlock',
      experienceKind: 'child',
      section: {_type: 'reference', _ref: secId},
      ...(positionRefId ? {position: {_type: 'reference', _ref: positionRefId}} : {}),
      arcanaNumber: b.arcana.number,
      titleRu: b.titleRu,
      bodyRu: portableTextFromParagraphs(b.paragraphs),
      bulletsRu: b.bullets,
      audience: audienceFor(b.section),
      tone: toneFor(b.section),
      qualityStatus: 'raw',
      sourceSnapshot: {_type: 'reference', _ref: snapshotId},
      sourceHeadingPath: b.headingPath,
    }
  })

function mapPositionId(sectionKey, positionKey) {
  // Mirrors seed/child-matrix/positions.ndjson _id conventions
  const table = {
    'personality/outer-character': 'position.child.personality.outer-character',
    'personality/sky-character': 'position.child.personality.sky-character',
    'personality/main-character': 'position.child.personality.outer-character', // legacy
    'personality/ideal-relationship': 'position.child.personality.ideal-relationship',
    'innate-talents/personal-talents': 'position.child.innate-talents.personal',
    'innate-talents/father-line-talents': 'position.child.innate-talents.father-line',
    'innate-talents/mother-line-talents': 'position.child.innate-talents.mother-line',
    'innate-talents/self-realization-direction': 'position.child.innate-talents.self-realization',
    'parent-relationship/generation-1': 'position.child.parent-relationship.generation-1',
    'parent-relationship/generation-2': 'position.child.parent-relationship.generation-2',
    'parent-relationship/generation-3': 'position.child.parent-relationship.generation-3',
    'parenting-guidance/father-guidance': 'position.child.parenting-guidance.father',
    'parenting-guidance/mother-guidance': 'position.child.parenting-guidance.mother',
    'ancestral-programs/ancestral-line': 'position.child.ancestral-programs.line',
    'personal-purpose/earth-purpose': 'position.child.personal-purpose.earth',
    'personal-purpose/heaven-purpose': 'position.child.personal-purpose.heaven',
    'personal-purpose/personal-result': 'position.child.personal-purpose.result',
    'social-purpose/social-male': 'position.child.social-purpose.male',
    'social-purpose/social-female': 'position.child.social-purpose.female',
    'social-purpose/social-result': 'position.child.social-purpose.result',
    'spiritual-purpose/spiritual-main': 'position.child.spiritual-purpose.main',
  }
  return table[`${sectionKey}/${positionKey}`] || null
}

function audienceFor(section) {
  if (section === 'parenting-guidance') return 'parent'
  if (section === 'parent-relationship' || section === 'ancestral-programs') return 'lineage'
  return 'child-profile'
}

function toneFor(section) {
  if (section === 'parenting-guidance') return 'parenting-advice'
  if (section === 'ancestral-programs') return 'growth'
  return 'neutral'
}

// ---------- Write NDJSON ----------

const snapshotFile = path.join(outDir, 'snapshots.ndjson')
const interpretationsFile = path.join(outDir, 'interpretations.ndjson')

fs.writeFileSync(snapshotFile, JSON.stringify(snapshot) + '\n')
fs.writeFileSync(
  interpretationsFile,
  interpretations.map((d) => JSON.stringify(d)).join('\n') + '\n',
)

console.error(`\n[done] wrote ${interpretations.length} interpretation blocks`)
console.error(`  snapshot:        ${snapshotFile}`)
console.error(`  interpretations: ${interpretationsFile}`)
console.error(`  content hash:    ${contentHash.slice(0, 16)}…`)
