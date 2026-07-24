export default {
  name: 'sectionHeading',
  title: 'Section Heading',
  type: 'object',
  preview: {
    select: {
      title: 'title',
      subtitle: 'eyebrow',
    },
  },
  fields: [
    {
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'subtitle',
      title: 'Subtitle',
      type: 'text',
      rows: 2,
    },
  ],
}
