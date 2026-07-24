import {Globe} from 'lucide-react'

export default {
  name: 'marketingGlobal',
  title: 'Marketing Global',
  type: 'document',
  icon: Globe,
  // One document per locale for cross-page marketing content.
  // Non-EN variants are written by the Flash pipeline only.
  preview: {
    select: {
      language: 'language',
    },
    prepare({language}) {
      return {
        title: `Marketing Global (${language ?? 'en'})`,
        subtitle: language ?? 'en',
      }
    },
  },
  fields: [
    {
      name: 'language',
      title: 'Language',
      type: 'string',
      description: 'BCP 47 language tag (e.g. "en", "de", "ru")',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'testimonials',
      title: 'Testimonials',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'review'}]}],
    },
    {
      name: 'socialProofBar',
      title: 'Social Proof Bar',
      type: 'object',
      fields: [
        {
          name: 'headline',
          title: 'Headline',
          type: 'string',
        },
        {
          name: 'logos',
          title: 'Logos',
          type: 'array',
          of: [
            {
              type: 'image',
              options: {hotspot: true},
              fields: [
                {
                  name: 'alt',
                  title: 'Alternative Text',
                  type: 'string',
                },
              ],
            },
          ],
        },
        {
          name: 'stat',
          title: 'Stat',
          type: 'string',
          description: 'Optional highlight stat (e.g. "10,000+ charts calculated")',
        },
      ],
    },
    {
      name: 'megaFaq',
      title: 'Mega FAQ',
      type: 'array',
      of: [{type: 'faqBlockItem'}],
      description: 'Site-wide MegaFAQ items',
    },
  ],
}
