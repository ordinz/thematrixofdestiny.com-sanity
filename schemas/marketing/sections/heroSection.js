export default {
  name: 'heroSection',
  title: 'Hero Section',
  type: 'object',
  preview: {
    select: {
      title: 'headline',
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
      name: 'headline',
      title: 'Headline',
      type: 'string',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'subheadline',
      title: 'Subheadline',
      type: 'text',
      rows: 3,
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'ctaLabel',
      title: 'CTA Label',
      type: 'string',
    },
    {
      name: 'ctaHref',
      title: 'CTA Href',
      type: 'string',
      description: 'Internal path or absolute URL',
    },
    {
      name: 'testimonial',
      title: 'Testimonial',
      type: 'reference',
      to: [{type: 'review'}],
    },
  ],
}
