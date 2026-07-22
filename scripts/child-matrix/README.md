# Child Matrix — Scraper & Importer

Tools for capturing Russian source content (currently gadalkindom.ru) into the Child Matrix content model defined in [`../../schemas/child-matrix/`](../../schemas/child-matrix/README.md).

## Files

| File | Purpose |
| --- | --- |
| `scrape-gadalkindom.mjs` | Fetches `https://gadalkindom.ru/matritsa-sudby/detskaya.html` for a given birthdate/gender/name and writes two NDJSON files: one `sourceSnapshot` and up to ~18 draft `interpretationBlock`s. |
| `import.mjs` | Imports NDJSON files into Sanity using `@sanity/client`. Supports `--dry` for a preview. |

Seed data lives in [`../../seed/child-matrix/`](../../seed/child-matrix/):

- `sections.ndjson` — the 8 Child Matrix `matrixSection` documents
- `positions.ndjson` — 17 `matrixPosition` documents covering all sub-slots

## Full pipeline (staging)

```bash
# 1. Install deps (adds @sanity/client)
pnpm install

# 2. Scrape one birthdate into ./out/child-matrix/
pnpm cm:scrape -- --date 2025-09-25 --gender male --name Elijah --out ./out/child-matrix

# 3. Dry-run the import so you can eyeball the payload
SANITY_STUDIO_PROJECT_ID=... SANITY_STUDIO_DATASET=staging \
  pnpm cm:import:dry

# 4. Actual import (needs a write token from manage.sanity.io)
SANITY_STUDIO_PROJECT_ID=... SANITY_STUDIO_DATASET=staging SANITY_WRITE_TOKEN=sk... \
  pnpm cm:import
```

The importer uses `createOrReplace` for sections/positions/snapshots (`--replace` flag) and `createIfNotExists` for `drafts.*` interpretation blocks so editors never lose in-progress edits.

## What the scraper does

1. Fetches the child matrix page for the given inputs via GET (form params: `m_name`, `gender`, `m_date`).
2. Slices out the "Расшифровка матрицы судьбы" section.
3. Tokenizes by `<h3>`/`<h4>` and paragraph/list items, tolerant of the source's malformed `<p><h3>...` nesting.
4. Walks the token stream, mapping section titles → `sectionKey`, sub-labels → `positionKey`, and `N аркан` → arcana number.
5. Emits one `sourceSnapshot` (with `rawText`, `rawHtml`, `normalizedJson`, and a SHA-256 `contentHash`) and one draft `interpretationBlock` per arcana block.

Interpretation blocks are always written with:

- `qualityStatus: "raw"`
- `bodyRu` populated (from paragraphs, as portable text)
- `bulletsRu` populated (from `<li>` items)
- `bodyEnLiteral` and `bodyEnProduct` **empty** — editors fill these in.

## Ordinal positions

Two sections don't label their positions in the source HTML — they rely on order:

- `personal-purpose`: 1st arcana → `earth-purpose`, 2nd → `heaven-purpose`
- `social-purpose`: 1st arcana → `social-male`, 2nd → `social-female`

The scraper handles this via `arcanaIndexInSection`.

## Change detection

Each snapshot includes a `contentHash` of the extracted body text. Re-running the scraper for the same inputs produces the same `_id` (`sourceSnapshot.gadalkindom.child.<hash12>`), so `createOrReplace` is a no-op when the source hasn't changed.

## Next sources

The same tokenizer approach will work for:

- `tvoyamatritsa.ru` — Personal Qualities + parenting section (free)
- `matrica-sudby.ru` — profile card (partly free)
- `beloesolnce.ru` — raw ancestral numbers (numbers only, no interpretation)

Each will need its own scraper module writing into the same `sourceSnapshot` + `interpretationBlock` shape, so we can compare interpretations across sources and pick the strongest for the English product.
