export default {
  name: 'year',
  title: 'Year',
  type: 'object',
  fields: [
    {
      name: 'seedPositives',
      title: 'Seed Positives',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'positives',
      title: 'Positives',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'seedNegatives',
      title: 'Seed Negatives',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'negatives',
      title: 'Negatives',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'seedRelationships',
      title: 'Seed Relationships',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'relationships',
      title: 'Relationships',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'seedMoney',
      title: 'Seed Money',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'money',
      title: 'Money',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'seedHealth',
      title: 'Seed Health',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'health',
      title: 'Health',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'text',
      title: 'Text',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'aiText',
      title: 'AI Text',
      type: 'array',
      of: [{type: 'block'}],
    },
  ],
}
