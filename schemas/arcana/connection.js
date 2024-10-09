const romanceFields = [
  {
    name: 'seedWhyTheCoupleMet',
    title: 'Seed Why the Couple Met',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'whyTheCoupleMet',
    title: 'Why the Couple Met',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'seedEmotionalConnection',
    title: 'Seed Emotional Connection',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'EmotionalConnection',
    title: 'Emotional Connection',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'seedComfortZonePositives',
    title: 'Seed Comfort Zone: Positives',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'seedComfortZoneNegatives',
    title: 'Seed Comfort Zone: Negatives',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'seedComfortZoneAdvice',
    title: 'Seed Comfort Zone: Advice',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'comfortZonePositives',
    title: 'Comfort Zone: Positives',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'comfortZoneNegatives',
    title: 'Comfort Zone: Negatives',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'comfortZoneAdvice',
    title: 'Comfort Zone: Advice',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'seedSoulTasks',
    title: 'Seed Soul Tasks',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'soulTasks',
    title: 'Soul Tasks: Negatives, Lessons, Advice',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'seedKarmicConnectionProblems',
    title: 'Seed Karmic Connection and Biggest Problems',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'karmicConnectionProblems',
    title: 'Karmic Connection and Biggest Problems',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'seedKarmicAdvice',
    title: 'Seed Karmic Advice',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'karmicAdvice',
    title: 'Karmic Advice',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'seedWhyConnectionMightFail',
    title: 'Seed Why the Connection Might Fail',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'whyConnectionMightFail',
    title: 'Why the Connection Might Fail',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'seedFinancialSuccessTogether',
    title: 'Seed Financial Success Together',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'financialSuccessTogether',
    title: 'Financial Success Together',
    type: 'array',
    of: [{type: 'block'}],
  },
]

const friendshipFields = [...romanceFields]

export const romance = {
  name: 'romance',
  title: 'Romance',
  type: 'object',
  fields: romanceFields,
}

export const friendship = {
  name: 'friendship',
  title: 'Friendship',
  type: 'object',
  fields: friendshipFields,
}
