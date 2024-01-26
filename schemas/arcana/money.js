const moneyLine = {
  name: 'moneyLine',
  title: 'Money Line',
  type: 'object',
  group: 'money',
  fields: [
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'descriptionSummary',
      title: 'Description Summary',
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
      name: 'blocksSummary',
      title: 'Blocks Summary',
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
}

let newFields = []

moneyLine.fields.forEach((field) => {
  let newField = {...field}
  newField.name = 'ai_' + field.name
  newField.title = field.title + ' (AI)'
  newFields.push(field)
  newFields.push(newField)
})

moneyLine.fields = newFields

export default moneyLine
