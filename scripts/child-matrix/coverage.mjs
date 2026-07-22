#!/usr/bin/env node
/**
 * Coverage report: observed targets vs scraped interpretation inventory.
 *
 *   node scripts/child-matrix/coverage.mjs
 *
 * Exit 1 if any observed tuple is still missing (skips coverageMode "skip").
 */

import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'
import {loadHaveMap} from './inventory.mjs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function parseArgs(argv) {
  const out = {
    possibilities: path.join(__dirname, 'data/child-position-possibilities.json'),
    inventory: './out/child-matrix/interpretations.ndjson',
  }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--possibilities') out.possibilities = argv[++i]
    else if (a === '--inventory') out.inventory = argv[++i]
  }
  return out
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  if (!fs.existsSync(args.possibilities)) {
    console.error(`Missing ${args.possibilities}. Run pnpm child:position-possibilities in app.`)
    process.exit(1)
  }
  const possibilities = JSON.parse(fs.readFileSync(args.possibilities, 'utf8'))
  const have = loadHaveMap(args.inventory, {fs})

  let incomplete = false
  let missingTotal = 0
  let targetTotal = 0
  console.log('positionKey\tobserved\tscraped\tmissing')
  for (const [positionKey, slot] of Object.entries(possibilities.positions)) {
    if (slot.coverageMode === 'skip') continue
    const scraped = have.get(positionKey) || new Set()
    const missing = slot.observed.filter((a) => !scraped.has(a))
    targetTotal += slot.observed.length
    missingTotal += missing.length
    if (missing.length) incomplete = true
    console.log(
      `${positionKey}\t${slot.count}\t${[...scraped].filter((a) => slot.observed.includes(a)).length}\t${missing.length ? missing.join(',') : '—'}`,
    )
  }

  const filled = targetTotal - missingTotal
  console.error(
    `\nFilled ${filled}/${targetTotal} (${((100 * filled) / targetTotal).toFixed(1)}%). Missing ${missingTotal}.`,
  )

  if (incomplete) {
    console.error('Coverage incomplete.')
    process.exit(1)
  }
  console.error('Coverage complete for all observed tuples.')
}

main()
