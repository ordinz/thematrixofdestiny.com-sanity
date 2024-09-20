export default {
  name: 'connection',
  title: 'Connection',
  type: 'object',
  fields: [
    {
      name: 'why',
      title: 'Why Did They Meet?',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'lessonsOfTheCouple', //only negative
      title: 'Couples Lessons',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'possibleReasonOfABreakup',
      title: 'Possible Reason of a Breakup',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'karmic',
      name: 'Karmic',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'positive',
      title: 'Positive',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'negative',
      title: 'Negative',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'recommendation',
      title: 'Recommendation',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'money',
      title: 'Money',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'love',
      title: 'Love',
      type: 'array',
      of: [{type: 'block'}],
    },
  ],
}
