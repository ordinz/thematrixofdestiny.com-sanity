export default {
  name: 'matrixSection',
  title: 'Matrix Section',
  type: 'document',
  description:
    'Reusable editorial section within a matrix experience (e.g. Child Matrix personality, talents, parent relationship, ancestral programs, purpose).',
  orderings: [
    {
      title: 'Sort Order',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'titleEn',
      subtitle: 'sectionKey',
      order: 'sortOrder',
    },
    prepare(selection) {
      const {title, subtitle, order} = selection
      return {
        title: `${order != null ? order + '. ' : ''}${title || subtitle}`,
        subtitle,
      }
    },
  },
  fields: [
    {
      name: 'experienceKind',
      title: 'Experience Kind',
      type: 'string',
      description:
        'Which matrix experience this section belongs to. Start with child; adult/compatibility/finance follow the same model.',
      options: {
        list: [
          {title: 'Child Matrix', value: 'child'},
          {title: 'Adult Matrix', value: 'adult'},
          {title: 'Compatibility', value: 'compatibility'},
          {title: 'Finance', value: 'finance'},
        ],
      },
      initialValue: 'child',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'sectionKey',
      title: 'Section Key',
      type: 'string',
      description:
        'Stable machine key used by the frontend. Examples: personality, innate-talents, parent-relationship, father-guidance, mother-guidance, ancestral-programs, personal-purpose, social-purpose, spiritual-purpose.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'titleRu',
      title: 'Title (Russian)',
      type: 'string',
      description: 'Original section title from the source page.',
    },
    {
      name: 'titleEn',
      title: 'Title (English)',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'titleEn', maxLength: 96},
    },
    {
      name: 'introRu',
      title: 'Intro (Russian)',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'introEn',
      title: 'Intro (English)',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
    },
    {
      name: 'notes',
      title: 'Editorial Notes',
      type: 'text',
      description: 'Internal notes about this section (not shown to end users).',
    },
  ],
}
