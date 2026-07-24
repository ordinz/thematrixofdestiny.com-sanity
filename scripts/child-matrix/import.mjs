#!/usr/bin/env node
/**
 * Import Child Matrix NDJSON files into a Sanity dataset.
 *
 * Uses @sanity/client (already a repo dev dep via Sanity Studio). Reads the
 * project id and dataset from env, plus a write token in SANITY_WRITE_TOKEN.
 *
 * Usage:
 *   SANITY_STUDIO_PROJECT_ID=... \
 *   SANITY_STUDIO_DATASET=staging \
 *   SANITY_WRITE_TOKEN=sk... \
 *     node scripts/child-matrix/import.mjs \
 *       --file seed/child-matrix/sections.ndjson \
 *       --file seed/child-matrix/positions.ndjson \
 *       --file out/child-matrix/snapshots.ndjson \
 *       --file out/child-matrix/interpretations.ndjson \
 *       [--replace]
 *
 * By default the importer uses `createOrReplace` for non-draft docs and
 * `createIfNotExists` for drafts. Pass --dry to see what would be written.
 */

import fs from 'node:fs'
import readline from 'node:readline'
import {argv, env, exit} from 'node:process'
import {createClient} from '@sanity/client'

function parseArgs(args) {
  const out = {files: [], dry: false, replace: false}
  for (let i = 0; i < args.length; i++) {
    const a = args[i]
    if (a === '--file') out.files.push(args[++i])
    else if (a === '--dry') out.dry = true
    else if (a === '--replace') out.replace = true
  }
  return out
}

const opts = parseArgs(argv.slice(2))
if (opts.files.length === 0) {
  console.error('No --file arguments provided.')
  exit(1)
}

const projectId = env.SANITY_STUDIO_PROJECT_ID
const dataset = env.SANITY_STUDIO_DATASET
const token = env.SANITY_WRITE_TOKEN

if (!projectId || !dataset) {
  console.error('SANITY_STUDIO_PROJECT_ID and SANITY_STUDIO_DATASET must be set.')
  exit(1)
}
if (!token && !opts.dry) {
  console.error('SANITY_WRITE_TOKEN must be set (or pass --dry).')
  exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2024-01-01',
  token,
  useCdn: false,
})

async function readNdjson(file) {
  const docs = []
  const rl = readline.createInterface({input: fs.createReadStream(file), crlfDelay: Infinity})
  for await (const line of rl) {
    const t = line.trim()
    if (!t) continue
    docs.push(JSON.parse(t))
  }
  return docs
}

let totalCreate = 0
let totalReplace = 0
let totalSkipped = 0

for (const file of opts.files) {
  const docs = await readNdjson(file)
  console.error(`\n[${file}] ${docs.length} documents`)

  if (opts.dry) {
    for (const d of docs) console.error(`  would upsert ${d._type} ${d._id}`)
    continue
  }

  let tx = client.transaction()
  let inTx = 0
  for (const d of docs) {
    const isDraft = typeof d._id === 'string' && d._id.startsWith('drafts.')
    if (isDraft) {
      tx = tx.createIfNotExists(d)
      totalCreate++
    } else if (opts.replace) {
      tx = tx.createOrReplace(d)
      totalReplace++
    } else {
      tx = tx.createIfNotExists(d)
      totalCreate++
    }
    inTx++
    if (inTx >= 50) {
      await tx.commit()
      console.error(`  … committed batch of ${inTx}`)
      tx = client.transaction()
      inTx = 0
    }
  }
  if (inTx > 0) {
    await tx.commit()
    console.error(`  … committed final batch of ${inTx}`)
  }
}

console.error(
  `\n[done] createIfNotExists=${totalCreate} createOrReplace=${totalReplace} skipped=${totalSkipped}${opts.dry ? ' (dry run)' : ''}`,
)
