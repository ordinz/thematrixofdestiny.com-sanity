#!/usr/bin/env node
/**
 * Greedy weighted set-cover: pick unique-chart dates that cover the most
 * valuable still-missing (positionKey × arcana) tuples.
 *
 * Improvements vs naive cover:
 *   - Defaults --inventory to out/child-matrix/interpretations.ndjson
 *   - Skips coverageMode "skip" positions
 *   - Weights rare / hard tuples higher (social-female when m≠f, distinct purpose)
 *   - Soft-predicts all-22 slots via candidate calc paths
 *
 *   node scripts/child-matrix/pick-dates.mjs [--limit 50]
 */

import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {calculateMatrixNumbers, resolveCalcValue} from './matrixNumbers.mjs'
import {SOFT_CANDIDATES, loadHaveSet, tupleKey} from './inventory.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function parseArgs(argv) {
  const out = {
    possibilities: path.join(__dirname, 'data/child-position-possibilities.json'),
    map: path.join(__dirname, 'position-calc-map.json'),
    uniqueDates: path.resolve(__dirname, '../../../../app/tmp/dates/unique-dates.csv'),
    inventory: './out/child-matrix/interpretations.ndjson',
    scrapedDates: null,
    out: './out/child-matrix/dates-to-scrape.json',
    limit: 50,
  }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--possibilities') out.possibilities = argv[++i]
    else if (a === '--map') out.map = argv[++i]
    else if (a === '--unique-dates') out.uniqueDates = argv[++i]
    else if (a === '--inventory') out.inventory = argv[++i]
    else if (a === '--scraped-dates') out.scrapedDates = argv[++i]
    else if (a === '--out') out.out = argv[++i]
    else if (a === '--limit') out.limit = Number(argv[++i])
  }
  return out
}

function readDates(filePath) {
  if (!fs.existsSync(filePath)) return []
  return fs
    .readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.split(',')[0]?.trim().replace(/^"|"$/g, '') ?? '')
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
}

function parseTuple(t) {
  const i = t.lastIndexOf(':')
  return {positionKey: t.slice(0, i), arcana: Number(t.slice(i + 1))}
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const map = JSON.parse(fs.readFileSync(args.map, 'utf8'))
  if (!fs.existsSync(args.possibilities)) {
    console.error(
      `Missing ${args.possibilities}. Run in app: pnpm child:position-possibilities`,
    )
    process.exit(1)
  }
  const possibilities = JSON.parse(fs.readFileSync(args.possibilities, 'utf8'))

  const target = new Set()
  const missingByPosition = new Map()
  for (const [positionKey, slot] of Object.entries(possibilities.positions)) {
    if (slot.coverageMode === 'skip') continue
    missingByPosition.set(positionKey, new Set())
    for (const arcana of slot.observed) {
      const k = tupleKey(positionKey, arcana)
      target.add(k)
      missingByPosition.get(positionKey).add(arcana)
    }
  }

  const have = loadHaveSet(args.inventory, {fs})
  for (const k of have) {
    const {positionKey, arcana} = parseTuple(k)
    missingByPosition.get(positionKey)?.delete(arcana)
  }

  const alreadyScraped = new Set()
  const scrapedPath = args.scrapedDates || path.join(path.dirname(args.out), 'scraped-dates.json')
  if (fs.existsSync(scrapedPath)) {
    const doc = JSON.parse(fs.readFileSync(scrapedPath, 'utf8'))
    for (const d of doc.dates || []) alreadyScraped.add(d)
  }

  let missing = new Set([...target].filter((t) => !have.has(t)))
  console.error(
    `Target tuples: ${target.size}, have: ${have.size}, missing: ${missing.size}, inventory: ${args.inventory}`,
  )

  // Rarity weight: fewer remaining for a position → higher weight per tuple
  function tupleWeight(t, numbers) {
    const {positionKey, arcana} = parseTuple(t)
    const rem = missingByPosition.get(positionKey)?.size || 1
    let w = 1 + 8 / rem // rare leftovers worth more

    // Hard structural slots: only count full weight when date can actually emit them
    if (positionKey === 'social-female') {
      const m = numbers['socialization.m']
      const f = numbers['socialization.f']
      if (m === f) w *= 0.15 // source rarely emits a distinct female block
      else w *= 3.5
    }
    if (positionKey === 'earth-purpose' || positionKey === 'heaven-purpose') {
      const sky = numbers['purpose.sky']
      const earth = numbers['purpose.earth']
      if (sky === earth) w *= 0.25
      else w *= 2.2
    }
    if (positionKey === 'social-male' || positionKey === 'social-result') {
      w *= 1.2
    }
    // Soft-predicted all-22: downweight so they don't dominate over locked paths
    if (SOFT_CANDIDATES[positionKey]) w *= 0.45
    return w
  }

  const dates = readDates(args.uniqueDates).filter((d) => !alreadyScraped.has(d))
  const dateCovers = []
  for (const date of dates) {
    const numbers = calculateMatrixNumbers(date)
    const covers = new Map() // tuple -> soft|hard

    for (const [positionKey, def] of Object.entries(map.positions)) {
      if (def.coverageMode === 'skip') continue
      const value = resolveCalcValue(numbers, def)
      if (typeof value === 'number') {
        const k = tupleKey(positionKey, value)
        if (missing.has(k)) covers.set(k, 'hard')
      } else if (Array.isArray(value)) {
        for (const v of value) {
          const k = tupleKey(positionKey, v)
          if (missing.has(k)) covers.set(k, 'hard')
        }
      }
    }

    // Soft candidates for unmapped positions
    for (const [positionKey, paths] of Object.entries(SOFT_CANDIDATES)) {
      if (map.positions[positionKey]?.coverageMode === 'skip') continue
      for (const p of paths) {
        const v = numbers[p]
        if (typeof v !== 'number') continue
        const k = tupleKey(positionKey, v)
        if (missing.has(k) && !covers.has(k)) covers.set(k, 'soft')
      }
    }

    // When m===f, scraping male also advances female coverage (synth in scraper)
    const m = numbers['socialization.m']
    const f = numbers['socialization.f']
    if (typeof m === 'number' && m === f) {
      const k = tupleKey('social-female', m)
      if (missing.has(k)) covers.set(k, 'hard')
    }
    // When sky===earth, heaven block doubles as earth (synth in scraper)
    const sky = numbers['purpose.sky']
    const earth = numbers['purpose.earth']
    if (typeof sky === 'number' && sky === earth) {
      const k = tupleKey('earth-purpose', earth)
      if (missing.has(k)) covers.set(k, 'hard')
    }

    if (covers.size > 0) dateCovers.push({date, covers, numbers})
  }

  const picked = []
  while (picked.length < args.limit && missing.size > 0) {
    let best = null
    for (const row of dateCovers) {
      if (picked.some((p) => p.date === row.date)) continue
      let gain = 0
      for (const [t, kind] of row.covers) {
        if (!missing.has(t)) continue
        const w = tupleWeight(t, row.numbers)
        gain += kind === 'soft' ? w * 0.5 : w
      }
      // Prefer modern dates slightly (gadalkindom quirks on ancient years)
      const year = Number(row.date.slice(0, 4))
      if (year >= 1900 && year <= 2035) gain *= 1.05
      if (!best || gain > best.gain) best = {date: row.date, covers: row.covers, numbers: row.numbers, gain}
    }
    if (!best || best.gain <= 0) break

    const newTuples = [...best.covers.keys()].filter((t) => missing.has(t))
    for (const t of newTuples) {
      missing.delete(t)
      const {positionKey, arcana} = parseTuple(t)
      missingByPosition.get(positionKey)?.delete(arcana)
    }
    const m = best.numbers['socialization.m']
    const f = best.numbers['socialization.f']
    picked.push({
      date: best.date,
      newCoverage: newTuples.length,
      weightedGain: Math.round(best.gain * 100) / 100,
      tuples: newTuples,
      gender: m !== f ? 'female' : 'male', // prefer female scrape when lines differ
      name: `Child${picked.length + 1}`,
      hints: {
        socialDistinct: m !== f,
        purposeDistinct: best.numbers['purpose.sky'] !== best.numbers['purpose.earth'],
      },
    })
  }

  const result = {
    generated_at: new Date().toISOString(),
    target: target.size,
    have: have.size,
    remaining_after: missing.size,
    picked: picked.length,
    dates: picked,
  }

  fs.mkdirSync(path.dirname(args.out), {recursive: true})
  fs.writeFileSync(args.out, JSON.stringify(result, null, 2) + '\n')
  console.error(
    `Picked ${picked.length} dates (remaining missing: ${missing.size}, weighted) → ${args.out}`,
  )
  if (picked[0]) {
    console.error(
      `  top pick ${picked[0].date}: +${picked[0].newCoverage} tuples, weight ${picked[0].weightedGain}`,
    )
  }
}

main()
