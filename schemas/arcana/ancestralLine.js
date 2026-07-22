/**
 * Father / Mother ancestral lines on arcana docs (MX-271).
 * Corners use portable text; midpoints use plain text (Plus/Minus)
 * to stay under Sanity’s per-document attribute limit.
 *
 * Chart mapping:
 *   Father spiritual Е/D, mechanism Х/D2, talent Ц/D1
 *   Father material  З/D6, mechanism Щ/D4, talent Ы/D5
 *   Mother spiritual Ж/C5, mechanism Ч/C3, talent Ш/C4
 *   Mother material  И/C,  mechanism Э/C2, talent Ю/C1
 */

const ancestralLineFields = [
  {
    name: 'spiritual',
    title: 'Spiritual',
    type: 'array',
    of: [{type: 'block'}],
    description: 'Corner spiritual/mental inheritance (Father: Е/D, Mother: Ж/C5)',
  },
  {
    name: 'spiritualSummary',
    title: 'Spiritual Summary',
    type: 'array',
    of: [{type: 'block'}],
    description: 'Public teaser for spiritual content',
  },
  {
    name: 'spiritualMechanism',
    title: 'Spiritual Mechanism',
    type: 'text',
    rows: 6,
    description: 'Midpoint “why” (Father: Х/D2, Mother: Ч/C3) — plain text Plus/Minus',
  },
  {
    name: 'spiritualTalent',
    title: 'Spiritual Talent',
    type: 'text',
    rows: 6,
    description: 'Result / gift (Father: Ц/D1, Mother: Ш/C4) — plain text Plus/Minus',
  },
  {
    name: 'material',
    title: 'Material',
    type: 'array',
    of: [{type: 'block'}],
    description: 'Corner material/karmic inheritance (Father: З/D6, Mother: И/C)',
  },
  {
    name: 'materialSummary',
    title: 'Material Summary',
    type: 'array',
    of: [{type: 'block'}],
    description: 'Public teaser for material content',
  },
  {
    name: 'materialMechanism',
    title: 'Material Mechanism',
    type: 'text',
    rows: 6,
    description: 'Midpoint “why” (Father: Щ/D4, Mother: Э/C2) — plain text Plus/Minus',
  },
  {
    name: 'materialTalent',
    title: 'Material Talent',
    type: 'text',
    rows: 6,
    description: 'Result / gift (Father: Ы/D5, Mother: Ю/C1) — plain text Plus/Minus',
  },
  {
    name: 'workingNote',
    title: 'Working Note',
    type: 'array',
    of: [{type: 'block'}],
    description: 'One-question prompt for this line',
  },
]

export const fatherLine = {
  name: 'fatherLine',
  title: 'Father Line',
  type: 'object',
  group: 'ancestral',
  description:
    'Paternal inheritance — spiritual Е→Х→Ц (D/D2/D1) and material З→Щ→Ы (D6/D4/D5)',
  fields: ancestralLineFields,
}

export const motherLine = {
  name: 'motherLine',
  title: 'Mother Line',
  type: 'object',
  group: 'ancestral',
  description:
    'Maternal inheritance — spiritual Ж→Ч→Ш (C5/C3/C4) and material И→Э→Ю (C/C2/C1)',
  fields: ancestralLineFields,
}
