export default {
  name: 'interpretationBlock',
  title: 'Interpretation Block',
  type: 'document',
  description:
    'One piece of reading copy tied to an experience + section + optional position + arcana. This is the core reusable content unit for the Child Matrix (and later Adult / Compatibility / Finance).',
  preview: {
    select: {
      title: 'titleEn',
      section: 'section.titleEn',
      position: 'position.titleEn',
      arcana: 'arcana.title',
      arcanaNum: 'arcana.number.current',
      status: 'qualityStatus',
    },
    prepare(selection) {
      const {title, section, position, arcana, arcanaNum, status} = selection
      const parts = [section, position].filter(Boolean).join(' › ')
      const arcanaLabel = arcanaNum ? `Arcana ${arcanaNum}` : arcana
      return {
        title: title || arcanaLabel || 'Interpretation Block',
        subtitle: [parts, arcanaLabel, status].filter(Boolean).join(' · '),
      }
    },
  },
  fields: [
    {
      name: 'experienceKind',
      title: 'Experience Kind',
      type: 'string',
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
      name: 'section',
      title: 'Section',
      type: 'reference',
      to: [{type: 'matrixSection'}],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'position',
      title: 'Position',
      type: 'reference',
      to: [{type: 'matrixPosition'}],
      description: 'Optional. Use when the section has sub-slots that carry their own copy.',
    },
    {
      name: 'arcana',
      title: 'Arcana',
      type: 'reference',
      to: [{type: 'arcana'}],
      description: 'The numbered energy this interpretation is about.',
    },
    {
      name: 'arcanaNumber',
      title: 'Arcana Number (denormalized)',
      type: 'number',
      description:
        'Optional numeric shortcut (1–22) for import/lookup before arcana references are wired up.',
      validation: (Rule) => Rule.min(1).max(22),
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
    },
    {
      name: 'bodyRu',
      title: 'Body (Russian)',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Original Russian source text.',
    },
    {
      name: 'bodyEnLiteral',
      title: 'Body (English — Literal)',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Raw/literal translation for traceability.',
    },
    {
      name: 'bodyEnProduct',
      title: 'Body (English — Product)',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Polished English copy shown in the product.',
    },
    {
      name: 'bulletsRu',
      title: 'Bullets (Russian)',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      name: 'bulletsEn',
      title: 'Bullets (English)',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      name: 'tone',
      title: 'Tone',
      type: 'string',
      options: {
        list: [
          {title: 'Neutral', value: 'neutral'},
          {title: 'Warning', value: 'warning'},
          {title: 'Growth', value: 'growth'},
          {title: 'Parenting Advice', value: 'parenting-advice'},
        ],
      },
    },
    {
      name: 'audience',
      title: 'Audience',
      type: 'string',
      options: {
        list: [
          {title: 'General', value: 'general'},
          {title: 'Parent', value: 'parent'},
          {title: 'Child Profile', value: 'child-profile'},
          {title: 'Lineage', value: 'lineage'},
        ],
      },
      initialValue: 'general',
    },
    {
      name: 'qualityStatus',
      title: 'Quality Status',
      type: 'string',
      options: {
        list: [
          {title: 'Raw', value: 'raw'},
          {title: 'Translated', value: 'translated'},
          {title: 'Reviewed', value: 'reviewed'},
          {title: 'Published', value: 'published'},
        ],
        layout: 'radio',
      },
      initialValue: 'raw',
    },
    {
      name: 'sourceSnapshot',
      title: 'Source Snapshot',
      type: 'reference',
      to: [{type: 'sourceSnapshot'}],
      description: 'The raw capture this interpretation was derived from.',
    },
    {
      name: 'sourceHeadingPath',
      title: 'Source Heading Path',
      type: 'array',
      of: [{type: 'string'}],
      description: 'Ordered heading trail from the source page, e.g. ["Отношения ребёнка с родителями","1 поколение","7 аркан"].',
    },
  ],
}
