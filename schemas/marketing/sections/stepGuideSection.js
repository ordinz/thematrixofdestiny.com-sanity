export default {
  name: 'stepGuideSection',
  title: 'Step Guide Section',
  type: 'object',
  preview: {
    select: {
      title: 'title',
      items: 'items',
    },
    prepare({title, items}) {
      return {
        title: title || 'Step Guide',
        subtitle: items?.length ? `${items.length} step(s)` : undefined,
      }
    },
  },
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'items',
      title: 'Steps',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'stepGuideItem',
          title: 'Step',
          preview: {
            select: {
              number: 'number',
              title: 'title',
            },
            prepare({number, title}) {
              return {
                title: number != null ? `${number}. ${title || 'Step'}` : title || 'Step',
              }
            },
          },
          fields: [
            {
              name: 'number',
              title: 'Number',
              type: 'number',
              validation: (Rule) => Rule.required().integer().positive(),
            },
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'content',
              title: 'Content',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'href',
              title: 'Href',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'ctas',
              title: 'CTAs',
              type: 'array',
              of: [{type: 'string'}],
              description: 'CTA label variants for this step',
            },
          ],
        },
      ],
    },
  ],
}
