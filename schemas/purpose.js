export default {
  name: 'purpose',
  title: 'Purpose',
  type: 'object',
  fields: [
    {
      name: 'characterists',
      title: 'Characterists',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'tasks',
      title: 'Spiritual Tasks',
      type: 'array',
      of: [{type: 'block'}],
    },
  ],
}
