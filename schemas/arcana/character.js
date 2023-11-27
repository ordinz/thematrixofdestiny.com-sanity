const group = 'character'

export default [
  {
    name: 'tinySummary',
    title: 'Tiny Summary',
    group,
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'characteristics',
    title: 'Characteristics',
    group,
    type: 'array',
    of: [{type: 'block'}],
    description: 'Characteristics of this energy type',
  },
  {
    name: 'positiveAspect',
    title: 'Positive Aspect',
    type: 'array',
    of: [{type: 'block'}],
    group,
    description: 'Positive aspects of this energy type',
  },
  {
    name: 'negativeAspect',
    title: 'Negative Aspect',
    type: 'array',
    of: [{type: 'block'}],
    group,
    description: 'Negative aspects of this energy type',
  },
  {
    name: 'workingOnNegatives',
    title: 'Working on Negatives',
    type: 'array',
    of: [{type: 'block'}],
    group,
    description: 'Suggestions for working on negatives',
  },
  {
    title: 'Recommendations',
    name: 'recommendations',
    type: 'array',
    of: [{type: 'block'}],
    group,
  },
  {
    title: 'Questions for Self Evaluation',
    name: 'selfEvaluation',
    type: 'array',
    of: [{type: 'block'}],
    group,
  },
]
