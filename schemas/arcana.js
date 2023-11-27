import love from './love'
import purpose from './purpose'
import moneyLine from './money'

let newFields = []

moneyLine.fields.forEach((field) => {
  let newField = {...field}
  newField.name = 'ai_' + field.name
  newField.title = field.title + ' (AI)'
  newFields.push(field)
  newFields.push(newField)
})

moneyLine.fields = newFields

export default {
  name: 'arcana',
  title: 'Arcana',
  type: 'document',
  groups: [
    {
      name: 'basics',
      title: 'Basic Information',
    },
    {
      name: 'aspects',
      title: 'Aspects',
    },
    {
      name: 'character',
      title: 'Character',
    },
    {
      name: 'money',
      title: 'Money',
    },
    {name: 'love', title: 'Love'},
    {name: 'purpose', title: 'Purpose'},
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'number.current',
    },
  },
  fields: [
    {
      name: 'number',
      group: 'basics',
      title: 'Number',
      type: 'slug',
      description: 'Number of the card',
      // validation: (Rule) => Rule.positive().integer(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'basics',
      description: 'Title of the document',
    },
    {
      name: 'characteristics',
      title: 'Characteristics',
      type: 'array',
      group: 'character',
      of: [{type: 'block'}],
      description: 'Characteristics of this energy type',
    },
    {
      name: 'positiveAspect',
      title: 'Positive Aspect',
      type: 'array',
      of: [{type: 'block'}],
      group: 'character',
      description: 'Positive aspects of this energy type',
    },
    {
      name: 'negativeAspect',
      title: 'Negative Aspect',
      type: 'array',
      of: [{type: 'block'}],
      group: 'character',
      description: 'Negative aspects of this energy type',
    },
    {
      name: 'workingOnNegatives',
      title: 'Working on Negatives',
      type: 'array',
      of: [{type: 'block'}],
      group: 'character',
      description: 'Suggestions for working on negatives',
    },
    {
      title: 'Recommendations',
      name: 'recommendations',
      type: 'array',
      of: [{type: 'block'}],
      group: 'character',
    },
    {
      title: 'Questions for Self Evaluation',
      name: 'selfEvaluation',
      type: 'array',
      of: [{type: 'block'}],
      group: 'character',
    },
    {...moneyLine},
    {...love, group: 'love'},
    {
      ...purpose,
      group: 'purpose',
    },
  ],
}
