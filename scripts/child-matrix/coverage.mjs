#!/usr/bin/env node
/**
 * Coverage report: observed targets vs scraped interpretation inventory.
 *
 *   node scripts/child-matrix/coverage.mjs \
 *     [--possibilities ./scripts/child-matrix/data/child-position-possibilities.json] \
 *     [--inventory ./out/child-matrix/interpretations.ndjson]
 *
 * Exit 1 if any observed tuple is still missing.
 */

import fs from 'node:fs'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

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

const POS_ID_TO_KEY = {
  'position.child.personality.outer-character': 'outer-character',
  'position.child.personality.sky-character': 'sky-character',
  'position.child.personality.main-character': 'outer-character',
  'position.child.innate-talents.personal': 'personal-talents',
  'position.child.innate-talents.father-line': 'father-line-talents',
  'position.child.innate-talents.mother-line': 'mother-line-talents',
  'position.child.innate-talents.self-realization': 'self-realization-direction',
  'position.child.parent-relationship.generation-1': 'generation-1',
  'position.child.parent-relationship.generation-2': 'generation-2',
  'position.child.parent-relationship.generation-3': 'generation-3',
  'position.child.parenting-guidance.father': 'father-guidance',
  'position.child.parenting-guidance.mother': 'mother-guidance',
  'position.child.ancestral-programs.line': 'ancestral-line',
  'position.child.personal-purpose.earth': 'earth-purpose',
  'position.child.personal-purpose.heaven': 'heaven-purpose',
  'position.child.personal-purpose.result': 'personal-result',
  'position.child.social-purpose.male': 'social-male',
  'position.child.social-purpose.female': 'social-female',
  'position.child.social-purpose.result': 'social-result',
  'position.child.spiritual-purpose.main': 'spiritual-main',
}

function loadHave(inventoryPath) {
  const have = new Map() // positionKey -> Set(arcana)
  if (!fs.existsSync(inventoryPath)) return have
  for (const line of fs.readFileSync(inventoryPath, 'utf8').split(/\n/)) {
    if (!line.trim()) continue
    const doc = JSON.parse(line)
    const key = POS_ID_TO_KEY[doc.position?._ref] || doc._positionKey
    if (!key || !doc.arcanaNumber) continue
    if (!have.has(key)) have.set(key, new Set())
    have.get(key).add(doc.arcanaNumber)
  }
  return have
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  if (!fs.existsSync(args.possibilities)) {
    console.error(`Missing ${args.possibilities}. Run pnpm child:position-possibilities in app.`)
    process.exit(1)
  }
  const possibilities = JSON.parse(fs.readFileSync(args.possibilities, 'utf8'))
  const have = loadHave(args.inventory)

  let incomplete = false
  console.log('positionKey\tobserved\tscraped\tmissing')
  for (const [positionKey, slot] of Object.entries(possibilities.positions)) {
    const scraped = have.get(positionKey) || new Set()
    const missing = slot.observed.filter((a) => !scraped.has(a))
    if (missing.length) incomplete = true
    console.log(
      `${positionKey}\t${slot.count}\t${scraped.size}\t${missing.length ? missing.join(',') : '—'}`,
    )
  }

  if (incomplete) {
    console.error('\nCoverage incomplete.')
    process.exit(1)
  }
  console.error('\nCoverage complete for all observed tuples.')
}

main()
