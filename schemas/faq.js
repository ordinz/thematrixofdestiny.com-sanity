export default {
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    {
      name: 'question',
      title: 'Question',
      type: 'string',
      description: 'What is the frequently asked question?',
    },
    {
      name: 'answer',
      title: 'Answer',
      type: 'array', // Using an array to hold the block content
      of: [{type: 'block'}], // Specifying that it contains block types
      description: 'What is the answer to the question?',
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Order in which the FAQ should appear',
    },
  ],
}
