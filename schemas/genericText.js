export default {
  name: 'genericText',
  title: 'Text (Generic)',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Title of the document',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
    },
    {
      name: 'a',
      title: 'Text A',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Text of the document',
    },
    {
      name: 'b',
      title: 'Text A',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Text of the document',
    },
  ],
}
