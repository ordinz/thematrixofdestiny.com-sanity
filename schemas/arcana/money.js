export default {
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
