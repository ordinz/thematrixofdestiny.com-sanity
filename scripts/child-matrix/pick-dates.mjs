#!/usr/bin/env node
/**
 * Greedy set-cover: pick unique-chart dates that cover the most still-missing
 * (positionKey × arcana) tuples for Child Matrix content.
 *
 *   node scripts/child-matrix/pick-dates.mjs \
 *     [--possibilities ./scripts/child-matrix/data/child-position-possibilities.json] \
 *     [--unique-dates /path/to/unique-dates.csv] \
 *     [--inventory ./out/child-matrix/interpretations.ndjson] \
 *     [--out ./out/child-matrix/dates-to-scrape.json] \
 *     [--limit 50]
 */

import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {calculateMatrixNumbers, resolveCalcValue} from './matrixNumbers.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function parseArgs(argv) {
  const out = {
    possibilities: path.join(__dirname, 'data/child-position-possibilities.json'),
    map: path.join(__dirname, 'position-calc-map.json'),
    uniqueDates: path.resolve(__dirname, '../../../../app/tmp/dates/unique-dates.csv'),
    inventory: null,
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

function tupleKey(positionKey, arcana) {
  return `${positionKey}:${arcana}`
}

function loadInventory(filePath) {
  const have = new Set()
  if (!filePath || !fs.existsSync(filePath)) return have
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\n/)) {
    if (!line.trim()) continue
    const doc = JSON.parse(line)
    const posRef = doc.position?._ref || ''
    const positionKey =
      doc._positionKey ||
      posRef.split('.').pop() ||
      null
    // Prefer embedded keys from normalized snapshot inventory if present
    const arcana = doc.arcanaNumber
    if (positionKey && arcana) have.add(tupleKey(positionKey, arcana))
  }
  return have
}

function loadInventoryFromNormalized(dir) {
  const have = new Set()
  const interp = path.join(dir, 'interpretations.ndjson')
  if (!fs.existsSync(interp)) return have
  for (const line of fs.readFileSync(interp, 'utf8').split(/\n/)) {
    if (!line.trim()) continue
    const doc = JSON.parse(line)
    const posId = doc.position?._ref || ''
    // position.child.personal-purpose.earth → try match map keys via reverse table
    const parts = posId.split('.')
    const tail = parts.slice(3).join('-') || parts.at(-1)
    const arcana = doc.arcanaNumber
    if (arcana && doc._positionKey) have.add(tupleKey(doc._positionKey, arcana))
    else if (arcana && tail) {
      // best-effort aliases
      const aliases = {
        'outer-character': 'outer-character',
        'sky-character': 'sky-character',
        personal: 'personal-talents',
        'father-line': 'father-line-talents',
        'mother-line': 'mother-line-talents',
        'self-realization': 'self-realization-direction',
        'generation-1': 'generation-1',
        'generation-2': 'generation-2',
        'generation-3': 'generation-3',
        father: 'father-guidance',
        mother: 'mother-guidance',
        line: 'ancestral-line',
        earth: 'earth-purpose',
        heaven: 'heaven-purpose',
        result: parts.includes('personal-purpose') ? 'personal-result' : 'social-result',
        male: 'social-male',
        female: 'social-female',
        main: 'spiritual-main',
      }
      const key = aliases[tail] || tail
      have.add(tupleKey(key, arcana))
    }
  }
  return have
}

function readDates(filePath) {
  if (!fs.existsSync(filePath)) return []
  return fs
    .readFileSync(filePath, 'utf8')
    .split(/\r?\n/)
    .map((l) => l.split(',')[0]?.trim().replace(/^"|"$/g, '') ?? '')
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d))
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
  for (const [positionKey, slot] of Object.entries(possibilities.positions)) {
    for (const arcana of slot.observed) target.add(tupleKey(positionKey, arcana))
  }

  let have = args.inventory
    ? loadInventory(args.inventory)
    : loadInventoryFromNormalized(path.dirname(args.out))
  // also merge any explicit inventory path's parent out dir
  if (args.inventory) {
    have = new Set([...have, ...loadInventory(args.inventory)])
  }

  const alreadyScraped = new Set()
  const scrapedPath = args.scrapedDates || path.join(path.dirname(args.out), 'scraped-dates.json')
  if (fs.existsSync(scrapedPath)) {
    const doc = JSON.parse(fs.readFileSync(scrapedPath, 'utf8'))
    for (const d of doc.dates || []) alreadyScraped.add(d)
  }

  let missing = new Set([...target].filter((t) => !have.has(t)))
  console.error(`Target tuples: ${target.size}, have: ${have.size}, missing: ${missing.size}`)

  const dates = readDates(args.uniqueDates).filter((d) => !alreadyScraped.has(d))
  // Precompute coverage sets per date
  const dateCovers = []
  for (const date of dates) {
    const numbers = calculateMatrixNumbers(date)
    const covers = new Set()
    for (const [positionKey, def] of Object.entries(map.positions)) {
      const value = resolveCalcValue(numbers, def)
      if (typeof value === 'number') {
        const k = tupleKey(positionKey, value)
        if (missing.has(k)) covers.add(k)
      } else if (Array.isArray(value)) {
        for (const v of value) {
          const k = tupleKey(positionKey, v)
          if (missing.has(k)) covers.add(k)
        }
      }
    }
    if (covers.size > 0) dateCovers.push({date, covers})
  }

  const picked = []
  while (picked.length < args.limit && missing.size > 0) {
    let best = null
    for (const row of dateCovers) {
      if (picked.some((p) => p.date === row.date)) continue
      let gain = 0
      for (const t of row.covers) if (missing.has(t)) gain++
      if (!best || gain > best.gain) best = {date: row.date, covers: row.covers, gain}
    }
    if (!best || best.gain === 0) break
    const newTuples = [...best.covers].filter((t) => missing.has(t))
    for (const t of newTuples) missing.delete(t)
    picked.push({
      date: best.date,
      newCoverage: best.gain,
      tuples: newTuples,
      gender: 'male',
      name: `Child${picked.length + 1}`,
    })
  }

  const result = {
    generated_at: new Date().toISOString(),
    target: target.size,
    remaining_after: missing.size,
    picked: picked.length,
    dates: picked,
  }

  fs.mkdirSync(path.dirname(args.out), {recursive: true})
  fs.writeFileSync(args.out, JSON.stringify(result, null, 2) + '\n')
  console.error(
    `Picked ${picked.length} dates (remaining missing tuples: ${missing.size}) → ${args.out}`,
  )
}

main()
