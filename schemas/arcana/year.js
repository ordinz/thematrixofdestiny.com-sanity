export default {
  name: 'year',
  title: 'Year',
  type: 'object',
  fields: [
    {
      name: 'text',
      title: 'Text',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'aiText',
      title: 'Text',
      type: 'array',
      of: [{type: 'block'}],
    },
  ],
}
