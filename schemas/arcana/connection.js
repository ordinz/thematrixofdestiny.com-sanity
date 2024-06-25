const xFields = [
  {
    name: 'theyMetFor',
    title: 'What did the couple meet for?',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'howTheyShowUp',
    title: 'How does a couple show up',
    type: 'array',
    of: [{type: 'block'}],
  },
]

export default {
  name: 'connection',
  title: 'Connection',
  type: 'object',
  fields: [
    {
      name: 'positive',
      title: 'Positive',
      type: 'object',
      fields: xFields,
    },
    {
      name: 'negative',
      title: 'Negative',
      type: 'object',
      fields: xFields,
    },
    {
      name: 'partnership',
      title: 'Partnership Goals',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'relationship',
      title: 'Relationship Goals',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'comfortZone',
      title: 'Comfort Zone',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'moneyLove',
      title: 'Money & Love',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'negativeKarma',
      title: 'Negative Karma',
      type: 'array',
      of: [{type: 'block'}],
    },
  ],
}
