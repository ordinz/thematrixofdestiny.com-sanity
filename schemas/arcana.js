export default {
  name: 'arcana',
  title: 'Arcana',
  type: 'document',
  preview: {
    select: {
      title: 'title',
      subtitle: 'number.current',
    },
  },
  fields: [
    {
      name: 'number',
      title: 'Number',
      type: 'slug',
      description: 'Number of the card',
      // validation: (Rule) => Rule.positive().integer(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Title of the document',
    },
    {
      name: 'characteristics',
      title: 'Characteristics',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Characteristics of this energy type',
    },
    {
      name: 'positiveAspect',
      title: 'Positive Aspect',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Positive aspects of this energy type',
    },
    {
      name: 'negativeAspect',
      title: 'Negative Aspect',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Negative aspects of this energy type',
    },
    {
      name: 'workingOnNegatives',
      title: 'Working on Negatives',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Suggestions for working on negatives',
    },
    {
      title: 'Recommendations',
      name: 'recommendations',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      title: 'Questions for Self Evaluation',
      name: 'selfEvaluation',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'moneyLine',
      title: 'Money Line',
      type: 'object',
      fields: [
        {
          name: 'description',
          title: 'Description',
          type: 'array',
          of: [{type: 'block'}],
        },
        {
          name: 'blocks',
          title: 'Blocks',
          type: 'array',
          of: [{type: 'block'}],
        },
        {
          name: 'recommendedJobs',
          title: 'Recommended Jobs',
          type: 'array',
          of: [{type: 'block'}],
        },
        {
          name: 'sourcesOfFinancialEnergy',
          title: 'Sources of Financial Energy',
          type: 'array',
          of: [{type: 'block'}],
        },
        {
          name: 'spendOn',
          title: 'Spend On',
          type: 'array',
          of: [{type: 'block'}],
        },
      ],
    },
  ],
}
