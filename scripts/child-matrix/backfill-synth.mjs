#!/usr/bin/env node
/**
 * One-shot: synthesize missing collision / nested docs into interpretations.ndjson
 * from already-scraped inventory (no network).
 *
 *   node scripts/child-matrix/backfill-synth.mjs [--out ./out/child-matrix]
 */

import fs from 'node:fs'
import path from 'node:path'
import {calculateMatrixNumbers} from './matrixNumbers.mjs'
import {POS_ID_TO_KEY} from './inventory.mjs'

function parseArgs(argv) {
  const out = {outDir: './out/child-matrix'}
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === '--out') out.outDir = argv[++i]
  }
  return out
}

function posKey(doc) {
  return POS_ID_TO_KEY[doc.position?._ref] || doc._positionKey
}

function cloneDoc(doc, positionKey, positionRef) {
  const human = `${doc.experienceKind || 'child'}.${positionKey}.${doc.arcanaNumber}`
  return {
    ...doc,
    _id: `drafts.interpretationBlock.${human}`,
    position: {_type: 'reference', _ref: positionRef},
    _positionKey: positionKey,
    sourceHeadingPath: [...(doc.sourceHeadingPath || []), `(backfill-synth ${positionKey})`],
    notes: `Synthesized ${positionKey} from ${posKey(doc)} (calc collision / nested).`,
  }
}

function main() {
  const args = parseArgs(process.argv.slice(2))
  const interpPath = path.join(args.outDir, 'interpretations.ndjson')
  const snapPath = path.join(args.outDir, 'snapshots.ndjson')
  if (!fs.existsSync(interpPath)) {
    console.error(`Missing ${interpPath}`)
    process.exit(1)
  }

  const docs = fs
    .readFileSync(interpPath, 'utf8')
    .split(/\n/)
    .filter(Boolean)
    .map((l) => JSON.parse(l))

  const byId = new Map(docs.map((d) => [d._id, d]))
  const have = new Set()
  for (const d of docs) {
    const k = posKey(d)
    if (k) have.add(`${k}:${d.arcanaNumber}`)
  }

  // Map snapshotId -> birthdate
  const dateBySnap = new Map()
  if (fs.existsSync(snapPath)) {
    for (const line of fs.readFileSync(snapPath, 'utf8').split(/\n/)) {
      if (!line.trim()) continue
      const s = JSON.parse(line)
      try {
        const norm = JSON.parse(s.normalizedJson || '{}')
        if (norm.inputs?.date) dateBySnap.set(s._id, norm.inputs.date)
      } catch {
        /* ignore */
      }
    }
  }

  let added = 0
  const extras = []

  for (const d of docs) {
    const snapId = d.sourceSnapshot?._ref
    const date = dateBySnap.get(snapId)
    if (!date) continue
    let nums
    try {
      nums = calculateMatrixNumbers(date)
    } catch {
      continue
    }

    const key = posKey(d)

    if (
      key === 'social-male' &&
      nums['socialization.m'] === nums['socialization.f'] &&
      d.arcanaNumber === nums['socialization.m'] &&
      !have.has(`social-female:${d.arcanaNumber}`)
    ) {
      const neo = cloneDoc(d, 'social-female', 'position.child.social-purpose.female')
      if (!byId.has(neo._id)) {
        extras.push(neo)
        byId.set(neo._id, neo)
        have.add(`social-female:${d.arcanaNumber}`)
        added++
      }
    }

    if (
      key === 'heaven-purpose' &&
      nums['purpose.sky'] === nums['purpose.earth'] &&
      d.arcanaNumber === nums['purpose.sky'] &&
      !have.has(`earth-purpose:${d.arcanaNumber}`)
    ) {
      const neo = cloneDoc(d, 'earth-purpose', 'position.child.personal-purpose.earth')
      if (!byId.has(neo._id)) {
        extras.push(neo)
        byId.set(neo._id, neo)
        have.add(`earth-purpose:${d.arcanaNumber}`)
        added++
      }
    }

    if (
      ['personal-talents', 'father-line-talents', 'mother-line-talents'].includes(key) &&
      !have.has(`self-realization-direction:${d.arcanaNumber}`)
    ) {
      // Gadalkindom always nests self-realization under each talent arcana block.
      const neo = cloneDoc(
        d,
        'self-realization-direction',
        'position.child.innate-talents.self-realization',
      )
      if (!byId.has(neo._id)) {
        extras.push(neo)
        byId.set(neo._id, neo)
        have.add(`self-realization-direction:${d.arcanaNumber}`)
        added++
      }
    }
  }

  if (added === 0) {
    console.error('No synth backfills needed.')
    return
  }

  const all = [...byId.values()]
  fs.writeFileSync(interpPath, all.map((d) => JSON.stringify(d)).join('\n') + '\n')
  console.error(`Backfilled ${added} synthesized interpretation(s) → ${interpPath}`)
}

main()
