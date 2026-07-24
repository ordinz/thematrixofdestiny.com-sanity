import {Languages} from 'lucide-react'

export default {
  name: 'marketingPage',
  title: 'Marketing Page',
  type: 'document',
  icon: Languages,
  // Pipeline-only: non-EN documents are written exclusively by the Flash
  // translate pipeline. Only EN documents should be edited in Studio.
  preview: {
    select: {
      title: 'title',
      slug: 'slug.current',
      language: 'language',
    },
    prepare({title, slug, language}) {
      return {
        title: title || slug || 'Marketing Page',
        subtitle: [language ?? 'en', slug].filter(Boolean).join(' · '),
      }
    },
  },
  fields: [
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      description: 'Page path segment (e.g. "what-is-destiny-matrix")',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'language',
      title: 'Language',
      type: 'string',
      description:
        'BCP 47 language tag (e.g. "en", "de", "ru"). English docs are studio-editable; non-EN variants are written by the Flash pipeline only.',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Internal Studio label (not shown on the site)',
    },
    {
      name: 'metadata',
      title: 'Metadata',
      type: 'reference',
      to: [{type: 'pageMetadata'}],
    },
    {
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [
        {type: 'heroSection'},
        {type: 'featureGridSection'},
        {type: 'stepGuideSection'},
        {type: 'faqBlockSection'},
        {type: 'comparisonTableSection'},
        {type: 'ctaSection'},
        {type: 'proseSection'},
        {type: 'sectionHeading'},
      ],
    },
  ],
}
