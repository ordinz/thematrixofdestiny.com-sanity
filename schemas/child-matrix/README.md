# Child Matrix Content Model

This folder contains the Sanity document types that model the **Child Matrix** experience (and, later, adult / compatibility / finance variants). It's designed around **reusable interpretation blocks with provenance** rather than page-shaped documents so we can:

- Import Russian source content once and translate/rewrite it into product English over time.
- Reuse the same numbered arcana meanings across many computed positions.
- Keep every piece of copy traceable back to its original source URL.

## Document types

| Type | Purpose |
| --- | --- |
| `matrixSection` | Editorial section within an experience — e.g. personality, innate talents, parent relationship, ancestral programs, personal/social/spiritual purpose. |
| `matrixPosition` | Sub-slot inside a section that carries its own copy — e.g. father-line talent, generation-1 karma, earth-purpose. Optional. |
| `interpretationBlock` | The core reusable content unit. One block = `experience + section + [position] + arcana` with Russian source, literal English, and polished product English. |
| `sourceSnapshot` | Raw capture (URL, HTML, text, hash) of an external source page for provenance and reversible imports. |

Arcana meanings live in the existing `arcana` document — `interpretationBlock` references it rather than duplicating it.

## Section keys (Child Matrix)

Stable machine keys used by the frontend:

- `personality`
- `innate-talents`
- `parent-relationship`
- `father-guidance`
- `mother-guidance`
- `ancestral-programs`
- `personal-purpose`
- `social-purpose`
- `spiritual-purpose`

## Position keys (examples)

- `outer-character`, `sky-character` (personality day/month)
- `personal-talents`, `father-line-talents`, `mother-line-talents`
- `generation-1`, `generation-2`, `generation-3`
- `earth-purpose`, `heaven-purpose`, `personal-result`
- `social-male`, `social-female`, `social-result`
- `spiritual-main`, `ancestral-line`

Calc paths and coverage modes: [`scripts/child-matrix/position-calc-map.json`](../../scripts/child-matrix/position-calc-map.json).

## Import shape

Scraper writes one JSON record per extracted chunk:

```json
{
  "experienceKind": "child",
  "sectionKey": "parent-relationship",
  "positionKey": "generation-1",
  "arcanaNumber": 7,
  "titleRu": "…",
  "bodyRu": ["…"],
  "bulletsRu": ["…"],
  "sourceUrl": "https://gadalkindom.ru/matritsa-sudby",
  "sourceHeadingPath": ["Отношения ребёнка с родителями", "1 поколение", "7 аркан"]
}
```

Pipeline:

1. Scraper writes each chunk to a `sourceSnapshot`.
2. Transform step creates draft `interpretationBlock` documents with `qualityStatus: "raw"`.
3. Editors advance status through `translated` → `reviewed` → `published`.

## Query shape (front-end)

```groq
*[_type == "interpretationBlock"
  && experienceKind == "child"
  && section->sectionKey == $sectionKey
  && (!defined($positionKey) || position->positionKey == $positionKey)
  && arcana->number.current == $arcanaNumber
  && qualityStatus == "published"
][0]{
  titleEn,
  bodyEnProduct,
  bulletsEn,
  arcana->{number, title}
}
```
