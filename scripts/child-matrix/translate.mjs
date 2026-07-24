#!/usr/bin/env node
/**
 * RU → EN for Child Matrix interpretationBlock docs already in Sanity.
 *
 * Queries live documents (default: production), fills:
 *   titleEn, bodyEnLiteral, bodyEnProduct, bulletsEn
 * and sets qualityStatus → "translated".
 *
 * Model: same Flash Lite as the app (`googleFlash` in app/lib/ai/models.ts) —
 *   google/gemini-3.1-flash-lite via Vercel AI Gateway (AI_GATEWAY_API_KEY).
 * Patches via Sanity mutate API (SANITY_API_TOKEN or SANITY_WRITE_TOKEN).
 *
 * Usage (from sanity/main, with app env loaded for keys):
 *   SANITY_STUDIO_PROJECT_ID=8j8wjy7o \
 *   SANITY_API_TOKEN=sk... \
 *   AI_GATEWAY_API_KEY=... \
 *     node scripts/child-matrix/translate.mjs \
 *       [--dataset production] [--limit 10] [--delay-ms 1500] \
 *       [--force] [--dry] [--id <docId>] [--date YYYY-MM-DD|DD.MM.YYYY]
 */

import {env, exit, argv} from 'node:process'
import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {calculateMatrixNumbers, resolveCalcValue} from './matrixNumbers.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

/** Load KEY=VALUE from app env files into process.env (no overwrite of existing). */
function loadEnvFiles(files) {
  for (const file of files) {
    if (!fs.existsSync(file)) continue
    for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
      const t = line.trim()
      if (!t || t.startsWith('#') || !t.includes('=')) continue
      const i = t.indexOf('=')
      const k = t.slice(0, i).trim()
      let v = t.slice(i + 1).trim()
      if (
        (v.startsWith('"') && v.endsWith('"')) ||
        (v.startsWith("'") && v.endsWith("'"))
      ) {
        v = v.slice(1, -1)
      }
      if (env[k] === undefined) env[k] = v
    }
  }
}

loadEnvFiles([
  path.resolve(__dirname, '../../../../app/.env'),
  path.resolve(__dirname, '../../../../app/.env.local'),
  path.resolve(__dirname, '../../.env'),
])

const PROTECTED_PHRASES = [
  'Matrix of Destiny',
  'Arcana',
  'Destiny Matrix',
  'Karmic Tail',
]

/** Mirrors app/lib/ai/models.ts `googleFlash` — do not drift. */
const GOOGLE_FLASH = 'google/gemini-3.1-flash-lite'
const DEFAULT_MODEL = env.CM_TRANSLATE_MODEL || GOOGLE_FLASH
const AI_GATEWAY_URL = 'https://ai-gateway.vercel.sh/v1/chat/completions'

const positionCalcMap = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'position-calc-map.json'), 'utf8'),
)

/** @param {string} raw */
function normalizeDate(raw) {
  const s = String(raw || '').trim()
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s
  const m = s.match(/^(\d{1,2})[./](\d{1,2})[./](\d{4})$/)
  if (m) {
    const dd = m[1].padStart(2, '0')
    const mm = m[2].padStart(2, '0')
    return `${m[3]}-${mm}-${dd}`
  }
  throw new Error(`Invalid --date "${raw}" (use YYYY-MM-DD or DD.MM.YYYY)`)
}

/**
 * Build set of "sectionKey|positionKey|arcanaNumber" keys for a birth date.
 * @param {string} isoDate YYYY-MM-DD
 * @returns {{ keys: Set<string>, tuples: {sectionKey:string,positionKey:string,arcanaNumber:number}[] }}
 */
function tuplesForDate(isoDate) {
  const numbers = calculateMatrixNumbers(isoDate)
  const tuples = []
  const keys = new Set()
  for (const [positionKey, def] of Object.entries(positionCalcMap.positions || {})) {
    const sectionKey = def.sectionKey
    if (!sectionKey) continue
    const resolved = resolveCalcValue(numbers, def)
    const arcanaList = Array.isArray(resolved)
      ? resolved
      : typeof resolved === 'number'
        ? [resolved]
        : []
    for (const arcanaNumber of arcanaList) {
      if (typeof arcanaNumber !== 'number') continue
      const key = `${sectionKey}|${positionKey}|${arcanaNumber}`
      if (keys.has(key)) continue
      keys.add(key)
      tuples.push({sectionKey, positionKey, arcanaNumber})
    }
  }
  return {keys, tuples, numbers}
}

function parseArgs(args) {
  const out = {
    dataset: env.SANITY_STUDIO_DATASET || env.NEXT_PUBLIC_SANITY_DATASET || 'production',
    limit: 0,
    delayMs: 1500,
    force: false,
    dry: false,
    id: null,
    date: null,
    model: DEFAULT_MODEL,
  }
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--dataset') out.dataset = args[++i]
    else if (a === '--limit') out.limit = Number(args[++i]) || 0
    else if (a === '--delay-ms') out.delayMs = Number(args[++i]) || 0
    else if (a === '--force') out.force = true
    else if (a === '--dry') out.dry = true
    else if (a === '--id') out.id = args[++i]
    else if (a === '--date') out.date = args[++i]
    else if (a === '--model') out.model = args[++i]
    else if (a === '--help' || a === '-h') out.help = true
  }
  return out
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

/** Extract Portable Text span texts + paths (relative to body root). */
function extractPtSpans(blocks) {
  const strings = []
  const paths = []
  if (!Array.isArray(blocks)) return {strings, paths}

  function walk(node, path) {
    if (node == null) return
    if (Array.isArray(node)) {
      node.forEach((item, i) => walk(item, [...path, i]))
      return
    }
    if (typeof node !== 'object') return
    if (node._type === 'span' && typeof node.text === 'string') {
      strings.push(node.text)
      paths.push([...path, 'text'])
      return
    }
    for (const [k, v] of Object.entries(node)) {
      if (k === '_key' || k === '_type' || k === '_ref') continue
      if (typeof v === 'object') walk(v, [...path, k])
    }
  }

  walk(blocks, [])
  return {strings, paths}
}

function applyPtSpans(blocks, paths, translated) {
  const out = deepClone(blocks || [])
  paths.forEach((path, index) => {
    if (translated[index] === undefined) return
    let cur = out
    for (let i = 0; i < path.length - 1; i++) cur = cur[path[i]]
    cur[path[path.length - 1]] = translated[index]
  })
  return out
}

function needsTranslation(doc, force) {
  if (!doc?.bodyRu?.length && !doc?.titleRu && !(doc?.bulletsRu?.length)) return false
  if (force) return true
  const hasEn =
    Boolean(doc.titleEn) ||
    (Array.isArray(doc.bodyEnProduct) && doc.bodyEnProduct.length > 0) ||
    (Array.isArray(doc.bodyEnLiteral) && doc.bodyEnLiteral.length > 0)
  return !hasEn
}

async function sanityFetch(projectId, dataset, token, query, params = {}) {
  // Child Matrix blocks live as drafts.* — need raw perspective or they are invisible.
  const url = new URL(`https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}`)
  url.searchParams.set('perspective', 'raw')
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({query, params}),
  })
  const json = await res.json()
  if (!res.ok) {
    throw new Error(`Sanity query failed ${res.status}: ${json?.message || JSON.stringify(json)}`)
  }
  return json.result
}

async function sanityPatch(projectId, dataset, token, id, setFields, dry) {
  if (dry) {
    console.error(`  [dry] would patch ${id} → ${Object.keys(setFields).join(', ')}`)
    return
  }
  const res = await fetch(`https://${projectId}.api.sanity.io/v2024-01-01/data/mutate/${dataset}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      mutations: [{patch: {id, set: setFields}}],
    }),
  })
  const json = await res.json()
  if (!res.ok) {
    throw new Error(`Sanity mutate failed ${res.status}: ${json?.message || JSON.stringify(json)}`)
  }
  return json
}

async function gatewayTranslate({
  apiKey,
  model,
  titleRu,
  bodySpans,
  bulletsRu,
  meta,
}) {
  const system = `You are an expert translator for The Matrix of Destiny (Destiny Matrix) child-profile content.
Translate Russian source into English for a parent-facing product.

Respond with a single JSON object only (no markdown), shape:
{
  "titleEn": string,
  "bodyEnLiteralSpans": string[],  // exactly ${bodySpans.length} — faithful literal EN per body span
  "bodyEnProductSpans": string[],  // exactly ${bodySpans.length} — polished parent-facing EN per span
  "bulletsEn": string[]            // exactly ${bulletsRu.length} English bullets
}

CRITICAL:
1. bodyEnLiteralSpans: faithful, close to source — same meaning, same span count (${bodySpans.length}).
2. bodyEnProductSpans: polished for parents — warm, clear, direct; same span count (${bodySpans.length}); do not invent claims.
3. bulletsEn: same count as bulletsRu (${bulletsRu.length}), one bullet per input.
4. Keep Arcana numbers and names clear (e.g. "Arcana 6 — The Lovers").
5. Do NOT translate these terms (keep as-is when they appear): ${PROTECTED_PHRASES.join(', ')}.
6. Do not add medical/psychological diagnoses. Do not moralize.
7. Output English only in string values.
8. Whitespace-only or symbol-only spans: return unchanged.`

  const userPayload = {
    meta,
    titleRu: titleRu || '',
    bodySpans,
    bulletsRu: bulletsRu || [],
  }

  let lastErr
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch(AI_GATEWAY_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          temperature: 0.2,
          messages: [
            {role: 'system', content: system},
            {role: 'user', content: JSON.stringify(userPayload)},
          ],
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        const msg = json?.error?.message || json?.message || JSON.stringify(json)
        if (res.status === 429 || res.status >= 500) {
          lastErr = new Error(`AI Gateway ${res.status}: ${msg}`)
          await sleep(2000 * (attempt + 1))
          continue
        }
        throw new Error(`AI Gateway ${res.status}: ${msg}`)
      }
      let text = json?.choices?.[0]?.message?.content || ''
      // Strip optional markdown fences if the model wraps JSON
      const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/)
      if (fence) text = fence[1].trim()
      const parsed = JSON.parse(text)

      const lit = Array.isArray(parsed.bodyEnLiteralSpans) ? parsed.bodyEnLiteralSpans : []
      const prod = Array.isArray(parsed.bodyEnProductSpans) ? parsed.bodyEnProductSpans : []
      const bullets = Array.isArray(parsed.bulletsEn) ? parsed.bulletsEn : []

      while (lit.length < bodySpans.length) lit.push(bodySpans[lit.length] || '')
      while (prod.length < bodySpans.length) prod.push(lit[prod.length] || bodySpans[prod.length] || '')
      while (bullets.length < (bulletsRu?.length || 0)) bullets.push(bulletsRu[bullets.length] || '')

      return {
        titleEn: typeof parsed.titleEn === 'string' ? parsed.titleEn : titleRu || '',
        bodyEnLiteralSpans: lit.slice(0, bodySpans.length),
        bodyEnProductSpans: prod.slice(0, bodySpans.length),
        bulletsEn: bullets.slice(0, bulletsRu?.length || 0),
      }
    } catch (e) {
      lastErr = e
      if (attempt < 2) await sleep(1500 * (attempt + 1))
    }
  }
  throw lastErr instanceof Error ? lastErr : new Error(String(lastErr))
}

const opts = parseArgs(argv.slice(2))
if (opts.help) {
  console.error(`Usage: node scripts/child-matrix/translate.mjs [options]
  --dataset production   Sanity dataset (default: env or production)
  --limit N              Max docs this run (0 = all)
  --delay-ms 1500        Pause between docs
  --force                Re-translate even if EN exists
  --dry                  Query + translate, do not patch
  --id <docId>           Single document
  --date YYYY-MM-DD|DD.MM.YYYY  Only blocks needed for that birth date
  --model ${GOOGLE_FLASH}   (default = app googleFlash)
`)
  exit(0)
}

const projectId = env.SANITY_STUDIO_PROJECT_ID || env.NEXT_PUBLIC_SANITY_PROJECT_ID
const token = env.SANITY_API_TOKEN || env.SANITY_WRITE_TOKEN
const apiKey = env.AI_GATEWAY_API_KEY

if (!projectId) {
  console.error('SANITY_STUDIO_PROJECT_ID (or NEXT_PUBLIC_SANITY_PROJECT_ID) is required.')
  exit(1)
}
if (!token) {
  console.error('SANITY_API_TOKEN (or SANITY_WRITE_TOKEN) is required.')
  exit(1)
}
if (!apiKey) {
  console.error('AI_GATEWAY_API_KEY is required (same gateway as app/lib/ai/models.ts googleFlash).')
  exit(1)
}

const filterParts = [
  '_type == "interpretationBlock"',
  'experienceKind == "child"',
  'defined(bodyRu) && count(bodyRu) > 0',
]
if (opts.id) {
  filterParts.push('_id == $id')
} else if (!opts.force) {
  filterParts.push(
    '(!defined(titleEn) || titleEn == "") && (!defined(bodyEnProduct) || count(bodyEnProduct) == 0)',
  )
}

const query = `*[${filterParts.join(' && ')}] | order(_updatedAt asc) {
  _id,
  titleRu,
  titleEn,
  bodyRu,
  bodyEnLiteral,
  bodyEnProduct,
  bulletsRu,
  bulletsEn,
  qualityStatus,
  arcanaNumber,
  "sectionKey": section->sectionKey,
  "positionKey": position->positionKey
}`

console.error(
  `[cm:translate] project=${projectId} dataset=${opts.dataset} model=${opts.model} dry=${opts.dry} force=${opts.force}${opts.date ? ` date=${opts.date}` : ''}`,
)

let dateFilter = null
if (opts.date) {
  const iso = normalizeDate(opts.date)
  const {keys, tuples} = tuplesForDate(iso)
  dateFilter = keys
  console.error(`[cm:translate] --date ${iso} → ${tuples.length} slot tuples`)
  for (const t of tuples.slice(0, 12)) {
    console.error(`    ${t.sectionKey}/${t.positionKey} #${t.arcanaNumber}`)
  }
  if (tuples.length > 12) console.error(`    … +${tuples.length - 12} more`)
}

let docs = await sanityFetch(projectId, opts.dataset, token, query, opts.id ? {id: opts.id} : {})
if (!Array.isArray(docs)) docs = docs ? [docs] : []
docs = docs.filter((d) => needsTranslation(d, opts.force))
if (dateFilter) {
  docs = docs.filter((d) =>
    dateFilter.has(`${d.sectionKey}|${d.positionKey}|${d.arcanaNumber}`),
  )
}
if (opts.limit > 0) docs = docs.slice(0, opts.limit)

console.error(`[cm:translate] ${docs.length} document(s) to translate`)

let ok = 0
let failed = 0
let skipped = 0

for (let i = 0; i < docs.length; i++) {
  const doc = docs[i]
  const label = `${i + 1}/${docs.length} ${doc._id}`
  try {
    const {strings: bodySpans, paths} = extractPtSpans(doc.bodyRu)
    if (!doc.titleRu && bodySpans.length === 0 && !(doc.bulletsRu || []).length) {
      console.error(`  skip empty ${doc._id}`)
      skipped++
      continue
    }

    console.error(`  … ${label} (spans=${bodySpans.length} bullets=${(doc.bulletsRu || []).length})`)

    const result = await gatewayTranslate({
      apiKey,
      model: opts.model,
      titleRu: doc.titleRu,
      bodySpans,
      bulletsRu: doc.bulletsRu || [],
      meta: {
        sectionKey: doc.sectionKey,
        positionKey: doc.positionKey,
        arcanaNumber: doc.arcanaNumber,
      },
    })

    const setFields = {
      titleEn: result.titleEn,
      bodyEnLiteral: applyPtSpans(doc.bodyRu, paths, result.bodyEnLiteralSpans),
      bodyEnProduct: applyPtSpans(doc.bodyRu, paths, result.bodyEnProductSpans),
      bulletsEn: result.bulletsEn,
      qualityStatus: 'translated',
    }

    if (opts.dry) {
      console.error(`  [dry] titleEn: ${result.titleEn}`)
      console.error(
        `  [dry] product preview: ${(result.bodyEnProductSpans[0] || '').slice(0, 120)}…`,
      )
      console.error(`  [dry] bulletsEn: ${result.bulletsEn.length}`)
    } else {
      await sanityPatch(projectId, opts.dataset, token, doc._id, setFields, false)
      console.error(`  ✓ patched ${doc._id}`)
    }
    ok++
  } catch (e) {
    failed++
    console.error(`  ✗ ${doc._id}: ${e instanceof Error ? e.message : e}`)
  }

  if (opts.delayMs > 0 && i < docs.length - 1) await sleep(opts.delayMs)
}

console.error(`[cm:translate] done ok=${ok} failed=${failed} skipped=${skipped}${opts.dry ? ' (dry)' : ''}`)
if (failed > 0) exit(1)
