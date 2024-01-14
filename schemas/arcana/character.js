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
    name: 'characteristicsSummary',
    title: 'Characteristics Summary',
    group,
    type: 'array',
    of: [{type: 'block'}],
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
    name: 'positiveAspectSummary',
    title: 'Positive Aspect Summary',
    type: 'array',
    group,
    of: [{type: 'block'}],
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
    name: 'negativeAspectSummary',
    title: 'Negative Aspect Summary',
    type: 'array',
    group,
    of: [{type: 'block'}],
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
    name: 'workingOnNegativesSummary',
    title: 'Working on Negatives Summary',
    type: 'array',
    group,
    of: [{type: 'block'}],
  },
  {
    title: 'Recommendations',
    name: 'recommendations',
    type: 'array',
    of: [{type: 'block'}],
    group,
  },
  {
    name: 'recommendationsSummary',
    title: 'Recommendations Summary',
    group,
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    title: 'Questions for Self Evaluation',
    name: 'selfEvaluation',
    type: 'array',
    of: [{type: 'block'}],
    group,
  },
]