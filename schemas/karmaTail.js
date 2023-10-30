export default {
  name: 'karmaTail',
  title: 'Karma Tail',
  type: 'document',
  preview: {
    select: {
      title: 'title',
      subtitle: 'number.current',
    },
  },
  fields: [
    {
      name: 'numbers',
      title: 'Numbers',
      description: 'N-N-N',
      type: 'string',
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'breakdown',
      title: 'Breakdown',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'past',
      title: 'In The Past',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'thisLife',
      title: 'In This Life',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'recommendations',
      title: 'Recommendations',
      type: 'array',
      of: [{type: 'block'}],
    },
  ],
}
