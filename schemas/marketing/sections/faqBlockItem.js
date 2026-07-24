export default {
  name: 'faqBlockItem',
  title: 'FAQ Item',
  type: 'object',
  preview: {
    select: {
      title: 'question',
    },
  },
  fields: [
    {
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'answer',
      title: 'Answer',
      type: 'array',
      of: [{type: 'block'}],
      validation: (Rule) => Rule.required(),
    },
  ],
}
