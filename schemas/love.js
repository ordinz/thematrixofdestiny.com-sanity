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
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'meetingScenarios',
      title: 'Meeting Scenarios',
      type: 'array',
      of: [{type: 'block'}],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'positiveAspects',
      title: 'Positive Aspects',
      type: 'array',
      of: [{type: 'block'}],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'negativeAspects',
      title: 'Negative Aspects',
      type: 'array',
      of: [{type: 'block'}],
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'recommendations',
      title: 'Recommendations',
      type: 'array',
      of: [{type: 'block'}],
      validation: (Rule) => Rule.required(),
    },
  ],
}
