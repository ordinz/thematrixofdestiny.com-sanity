export default {
  name: 'faqBlockSection',
  title: 'FAQ Block Section',
  type: 'object',
  preview: {
    select: {
      title: 'title',
      items: 'items',
    },
    prepare({title, items}) {
      return {
        title: title || 'FAQ Block',
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
      of: [{type: 'faqBlockItem'}],
      description: 'Page-scoped FAQ items (distinct from the global faq documents)',
    },
  ],
}
