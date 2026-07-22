# Child Matrix — Scraper & Importer

Tools for capturing Russian source content (currently gadalkindom.ru) into the Child Matrix content model, driven by **empirical chart coverage** from the app’s unique-date corpus ([position-possibilities](../../../../app/product-wiki/wiki/chart/position-possibilities.md)).

## Files

| File | Purpose |
| --- | --- |
| `position-calc-map.json` | `positionKey` → `MatrixOfDestiny` calc path (+ coverage mode) |
| `matrixNumbers.mjs` | Local matrix calculator (no app import) |
| `scrape-gadalkindom.mjs` | Single-date scrape → snapshot + interpretation NDJSON |
| `pick-dates.mjs` | Greedy set-cover over missing `(position × arcana)` tuples |
| `scrape-batch.mjs` | Slow sequential batch scrape (15s+jitter, caps, backoff) |
| `coverage.mjs` | Report observed vs scraped; exit 1 if incomplete |
| `import.mjs` | Import NDJSON into Sanity |
| `data/child-position-possibilities.json` | Generated coverage targets (from app) |

## Full pipeline

```bash
# In app/ — build observed coverage from unique-dates.csv
pnpm child:position-possibilities

# In sanity/main/
npm run cm:pick-dates
npm run cm:scrape-batch          # polite defaults: 15s delay, max 20/run
npm run cm:coverage              # exit 1 until complete
npm run cm:import:dry            # then cm:import against staging
```

### Rate limits (scrape-batch defaults)

| Flag | Default |
| --- | --- |
| `--delay-ms` | 15000 |
| `--jitter-ms` | 5000 |
| `--max-per-run` | 20 |
| `--max-per-hour` | 40 |

On HTTP 429/503: exponential backoff from 60s (3 retries), then skip date.

## Completeness

**Mapped positions** (`calcPath` set): drive scrape planning from **observed** adult-chart tuples only. Do not chase engine-impossible combos.

**Unmapped positions** (`calcPath: null`, currently father/mother talents, parenting guidance, self-realization): **no coverage oracle**. Treat whatever gadalkindom emits as opportunistic fill — do not use `cm:coverage` exit-code as a hard fail for those slots, and do not burn batch quota trying to hit all 22.

Adult `MatrixOfDestiny` paths are a **working approximation** for many gadalkindom sections. [MX-272](https://linear.app/thematrixofdestiny/issue/MX-272) (true children’s 4-anchor calc) may retarget the map later; until then, do not rewrite the pipeline.
