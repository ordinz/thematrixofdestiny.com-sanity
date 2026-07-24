export default {
  name: 'ctaSection',
  title: 'CTA Section',
  type: 'object',
  preview: {
    select: {
      title: 'headline',
      subtitle: 'ctaLabel',
    },
  },
  fields: [
    {
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 2,
    },
    {
      name: 'ctaLabel',
      title: 'CTA Label',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'ctaHref',
      title: 'CTA Href',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
  ],
}
