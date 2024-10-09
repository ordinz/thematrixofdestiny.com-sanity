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
    name: 'seedSoulTasksNegativeAspects',
    title: 'Seed Soul Tasks: Negative Aspects',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'seedSoulTasksLessons',
    title: 'Seed Soul Tasks: Lessons',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'seedSoulTasksAdvice',
    title: 'Seed Soul Tasks: Advice',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'soulTasksNegativeAspects',
    title: 'Soul Tasks: Negative Aspects',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'soulTasksLessons',
    title: 'Soul Tasks: Lessons',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'soulTasksAdvice',
    title: 'Soul Tasks: Advice',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'seedKarmicNegativeAspects',
    title: 'Seed Karmic: Negative Aspects',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'seedKarmicLessons',
    title: 'Seed Karmic: Lessons',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'seedKarmicAdvice',
    title: 'Seed Karmic: Advice',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'karmicNegativeAspects',
    title: 'Karmic: Negative Aspects',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'karmicLessons',
    title: 'Karmic: Lessons',
    type: 'array',
    of: [{type: 'block'}],
  },
  {
    name: 'karmicAdvice',
    title: 'Karmic: Advice',
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
