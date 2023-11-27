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
    {
      name: 'before40',
      title: 'Before 40',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'after40',
      title: 'After 40',
      type: 'array',
      of: [{type: 'block'}],
    },
  ],
}
