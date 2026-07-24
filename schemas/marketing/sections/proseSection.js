export default {
  name: 'proseSection',
  title: 'Prose Section',
  type: 'object',
  preview: {
    select: {
      title: 'title',
    },
    prepare({title}) {
      return {
        title: title || 'Prose',
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
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{type: 'block'}],
      validation: (Rule) => Rule.required(),
    },
  ],
}
