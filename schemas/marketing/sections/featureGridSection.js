export default {
  name: 'featureGridSection',
  title: 'Feature Grid Section',
  type: 'object',
  preview: {
    select: {
      title: 'title',
      items: 'items',
    },
    prepare({title, items}) {
      return {
        title: title || 'Feature Grid',
        subtitle: items?.length ? `${items.length} item(s)` : undefined,
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
      title: 'Items',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'featureGridItem',
          title: 'Feature',
          preview: {
            select: {
              title: 'title',
              subtitle: 'description',
            },
          },
          fields: [
            {
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Icon identifier used by the frontend',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'href',
              title: 'Href',
              type: 'string',
            },
          ],
        },
      ],
    },
  ],
}
