export default {
  name: 'line',
  title: 'Line',
  type: 'document',
  preview: {
    select: {
      title: 'numbers.current',
      subtitle: 'type',
    },
  },
  fields: [
    {
      name: 'numbers',
      type: 'slug',
      description: '15-5-8',
    },
    {
      name: 'type',
      type: 'string',
      options: {
        list: [
          {title: 'Money', value: 'money'},
          {title: 'Karma', value: 'karma'},
          {title: 'Love', value: 'love'},
        ],
      },
    },
    {
      name: 'description',
      type: 'array',
      of: [{type: 'block'}],
    },
  ],
}
