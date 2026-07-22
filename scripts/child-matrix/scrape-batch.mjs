#!/usr/bin/env node
/**
 * Slow sequential batch scrape driven by dates-to-scrape.json.
 *
 * Defaults (polite):
 *   --delay-ms 15000  --jitter-ms 5000  --max-per-run 20  --max-per-hour 40
 *
 *   node scripts/child-matrix/scrape-batch.mjs \
 *     [--dates ./out/child-matrix/dates-to-scrape.json] \
 *     [--out ./out/child-matrix]
 */

import fs from 'node:fs'
import path from 'node:path'
import {spawn} from 'node:child_process'
import {fileURLToPath} from 'node:url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function parseArgs(argv) {
  const out = {
    dates: './out/child-matrix/dates-to-scrape.json',
    outDir: './out/child-matrix',
    delayMs: 15000,
    jitterMs: 5000,
    maxPerRun: 20,
    maxPerHour: 40,
  }
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i]
    if (a === '--dates') out.dates = argv[++i]
    else if (a === '--out') out.outDir = argv[++i]
    else if (a === '--delay-ms') out.delayMs = Number(argv[++i])
    else if (a === '--jitter-ms') out.jitterMs = Number(argv[++i])
    else if (a === '--max-per-run') out.maxPerRun = Number(argv[++i])
    else if (a === '--max-per-hour') out.maxPerHour = Number(argv[++i])
  }
  return out
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}

function runScrape({date, gender, name, outDir}) {
  return new Promise((resolve, reject) => {
    const child = spawn(
      process.execPath,
      [
        path.join(__dirname, 'scrape-gadalkindom.mjs'),
        '--date',
        date,
        '--gender',
        gender || 'male',
        '--name',
        name || 'Child',
        '--out',
        path.join(outDir, 'tmp', date),
      ],
      {stdio: ['ignore', 'pipe', 'pipe']},
    )
    let stderr = ''
    child.stderr.on('data', (d) => {
      stderr += d
      process.stderr.write(d)
    })
    child.on('close', (code) => {
      if (code === 0) resolve({ok: true})
      else reject(new Error(`scrape failed (${code}): ${stderr.slice(-500)}`))
    })
  })
}

function appendNdjson(fromFile, toFile) {
  if (!fs.existsSync(fromFile)) return 0
  const lines = fs.readFileSync(fromFile, 'utf8').trim()
  if (!lines) return 0
  fs.mkdirSync(path.dirname(toFile), {recursive: true})
  fs.appendFileSync(toFile, lines + '\n')
  return lines.split('\n').length
}

function dedupeInterpretations(filePath) {
  if (!fs.existsSync(filePath)) return {kept: 0, dropped: 0}
  const byId = new Map()
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\n/)) {
    if (!line.trim()) continue
    const doc = JSON.parse(line)
    const prev = byId.get(doc._id)
    if (!prev) {
      byId.set(doc._id, doc)
      continue
    }
    const prevLen = (prev.bodyRu?.length || 0) + (prev.bulletsRu?.length || 0)
    const nextLen = (doc.bodyRu?.length || 0) + (doc.bulletsRu?.length || 0)
    if (nextLen > prevLen) byId.set(doc._id, doc)
  }
  const all = [...byId.values()]
  fs.writeFileSync(filePath, all.map((d) => JSON.stringify(d)).join('\n') + '\n')
  return {kept: all.length}
}

async function main() {
  const args = parseArgs(process.argv.slice(2))
  if (!fs.existsSync(args.dates)) {
    console.error(`Missing ${args.dates}. Run cm:pick-dates first.`)
    process.exit(1)
  }
  const plan = JSON.parse(fs.readFileSync(args.dates, 'utf8'))
  const scrapedPath = path.join(args.outDir, 'scraped-dates.json')
  const scraped = fs.existsSync(scrapedPath)
    ? JSON.parse(fs.readFileSync(scrapedPath, 'utf8'))
    : {dates: [], history: []}
  const scrapedSet = new Set(scraped.dates || [])

  const queue = (plan.dates || []).filter((d) => !scrapedSet.has(d.date))
  const hourTimestamps = []
  let done = 0

  console.error(
    `[batch] queue=${queue.length} delay=${args.delayMs}ms±${args.jitterMs} max/run=${args.maxPerRun}`,
  )

  for (const item of queue) {
    if (done >= args.maxPerRun) {
      console.error(`[batch] hit --max-per-run ${args.maxPerRun}; stop. Re-run later.`)
      break
    }
    const now = Date.now()
    while (hourTimestamps.length && now - hourTimestamps[0] > 3600_000) hourTimestamps.shift()
    if (hourTimestamps.length >= args.maxPerHour) {
      console.error(`[batch] hit --max-per-hour ${args.maxPerHour}; stop.`)
      break
    }

    let attempt = 0
    let ok = false
    while (attempt < 4 && !ok) {
      try {
        await runScrape({
          date: item.date,
          gender: item.gender,
          name: item.name,
          outDir: args.outDir,
        })
        ok = true
      } catch (err) {
        attempt++
        const msg = String(err.message || err)
        const retryable = /429|503|Fetch failed: HTTP/.test(msg)
        if (!retryable || attempt >= 4) {
          console.error(`[batch] skip ${item.date}: ${msg}`)
          scraped.history.push({date: item.date, ok: false, error: msg, at: new Date().toISOString()})
          break
        }
        const backoff = 60_000 * 2 ** (attempt - 1)
        console.error(`[batch] backoff ${backoff}ms after failure (${attempt}/3)`)
        await sleep(backoff)
      }
    }

    if (ok) {
      const tmp = path.join(args.outDir, 'tmp', item.date)
      appendNdjson(path.join(tmp, 'snapshots.ndjson'), path.join(args.outDir, 'snapshots.ndjson'))
      appendNdjson(
        path.join(tmp, 'interpretations.ndjson'),
        path.join(args.outDir, 'interpretations.ndjson'),
      )
      scrapedSet.add(item.date)
      scraped.dates = [...scrapedSet]
      scraped.history.push({date: item.date, ok: true, at: new Date().toISOString()})
      hourTimestamps.push(Date.now())
      done++
      console.error(`[batch] ok ${item.date} (${done}/${args.maxPerRun})`)
    }

    fs.writeFileSync(scrapedPath, JSON.stringify(scraped, null, 2) + '\n')

    if (done < Math.min(args.maxPerRun, queue.length) && done > 0) {
      const wait = args.delayMs + Math.floor(Math.random() * (args.jitterMs + 1))
      console.error(`[batch] sleeping ${wait}ms…`)
      await sleep(wait)
    }
  }

  const dedupe = dedupeInterpretations(path.join(args.outDir, 'interpretations.ndjson'))
  console.error(`[batch] done. interpretations kept=${dedupe.kept}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
