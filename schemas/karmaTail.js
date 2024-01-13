export default {
  name: 'karmaTail',
  title: 'Karma Tail',
  type: 'document',
  preview: {
    select: {
      title: 'numbers',
      subtitle: 'title',
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
      name: 'tinySummary',
      title: 'Tiny Summary',
      type: 'array',
      of: [{type: 'block'}],
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
    {
      name: 'birthdate',
      title: 'Birthdate',
      description: 'A birthdate that is used to calculate the karma tail',
      type: 'date',
    },
  ],
}
