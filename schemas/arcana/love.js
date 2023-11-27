export default {
  name: 'love',
  title: 'Love',
  type: 'object',
  fields: [
    {
      name: 'keyFocus',
      title: 'Key Focus',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'meetingScenarios',
      title: 'Meeting Scenarios',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'positiveAspects',
      title: 'Positive Aspects',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'negativeAspects',
      title: 'Negative Aspects',
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
