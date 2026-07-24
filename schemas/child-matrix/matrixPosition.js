export default {
  name: 'matrixPosition',
  title: 'Matrix Position',
  type: 'document',
  description:
    'A specific slot inside a section that carries its own interpretation, e.g. father-line-talent, mother-line-talent, generation-1, earth-purpose, heaven-purpose.',
  orderings: [
    {
      title: 'Sort Order',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'titleEn',
      subtitle: 'positionKey',
      section: 'section.titleEn',
    },
    prepare(selection) {
      const {title, subtitle, section} = selection
      return {
        title: title || subtitle,
        subtitle: section ? `${section} · ${subtitle}` : subtitle,
      }
    },
  },
  fields: [
    {
      name: 'section',
      title: 'Section',
      type: 'reference',
      to: [{type: 'matrixSection'}],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'positionKey',
      title: 'Position Key',
      type: 'string',
      description:
        'Stable machine key. Examples: main-character, personal-talents, father-line-talents, mother-line-talents, generation-1, generation-2, generation-3, earth-purpose, heaven-purpose, social-purpose, spiritual-purpose.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'titleRu',
      title: 'Title (Russian)',
      type: 'string',
    },
    {
      name: 'titleEn',
      title: 'Title (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'formulaKey',
      title: 'Formula Key',
      type: 'string',
      description:
        'Optional identifier for the calculation that produces this position (e.g. earth+heaven=personal, male+female=social).',
    },
    {
      name: 'descriptionRu',
      title: 'Description (Russian)',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'descriptionEn',
      title: 'Description (English)',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
    },
  ],
}
