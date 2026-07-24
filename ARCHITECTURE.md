# Architecture

Content studio for [thematrixofdestiny.com](https://thematrixofdestiny.com). Dataset: `8j8wjy7o`.

## i18n pattern

Locale variants use a document-level `language` field (BCP 47), matching `uiMessage`, `arcana_v2`, and `karmicTail_v2`. English documents are authored in Studio; non-EN variants are written by the Flash translation pipeline as `__i18n_<locale>_<docId>`. Do **not** use `@sanity/document-internationalization` — mixing patterns would break the pipeline.

## Marketing doc types

| Type | Kind | Role |
| --- | --- | --- |
| `marketingPage` | document | Page container: `slug`, `language`, Studio `title`, `metadata` → `pageMetadata`, typed `sections[]` |
| `marketingGlobal` | document | One doc per locale: shared testimonials, social-proof bar, mega FAQ |
| `pageMetadata` | document | SEO / Open Graph; optional `language` (missing → treat as `en`) |

### Section object types (`schemas/marketing/sections/`)

Used only inside `marketingPage.sections` (and `faqBlockItem` also in `marketingGlobal.megaFaq`):

- `heroSection` — eyebrow, headline, subheadline, optional CTA + review ref
- `featureGridSection` — title + items `{icon, title, description, href?}`
- `stepGuideSection` — title + steps `{number, title, content, href, ctas[]}`
- `faqBlockSection` — title + `faqBlockItem[]` (page-scoped; distinct from global `faq` docs)
- `comparisonTableSection` — title, headers[], rows `{cells[]}`
- `ctaSection` — headline, optional subheadline, CTA label/href
- `proseSection` — optional title + block body
- `sectionHeading` — eyebrow, title, optional subtitle
- `faqBlockItem` — `{question, answer}` shared by FAQ sections and mega FAQ

### Flash pipeline discovery

Translate `marketingPage` / `marketingGlobal` (and locale `pageMetadata`) the same way as other `language`-keyed docs: query by type + `language == "en"`, write non-EN copies with the `__i18n_<locale>_<docId>` id convention. Rich-text fields use inline `block` arrays (same as `faq` / `review`), not the unused blog `blockContent` type.

### Non-goals (kept as-is)

- Global `faq` documents — unchanged; page FAQs live in `faqBlockSection`
- `genericText` — unchanged; new marketing pages use `marketingPage`
