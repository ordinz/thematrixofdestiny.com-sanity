import {Languages} from 'lucide-react'

export default {
  name: 'uiMessage',
  title: 'UI Message',
  type: 'document',
  icon: Languages,
  // Pipeline-only: non-EN documents are written exclusively by the Inngest
  // translateUiMessage function. Only EN documents should be edited in Studio.
  preview: {
    select: {
      namespace: 'namespace',
      language: 'language',
    },
    prepare({namespace, language}) {
      return {
        title: namespace,
        subtitle: language ?? 'en',
      }
    },
  },
  fields: [
    {
      name: 'namespace',
      title: 'Namespace',
      type: 'string',
      description: 'Matches the next-intl namespace key (e.g. "Hero", "Nav", "Footer")',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'language',
      title: 'Language',
      type: 'string',
      description: 'BCP 47 language tag (e.g. "en", "de", "ru")',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'messages',
      title: 'Messages',
      type: 'array',
      description: 'Flat key-value pairs for this namespace. Keys match next-intl message keys. _key = message key (e.g. "headline").',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'value',
              title: 'Value',
              type: 'text',
              rows: 2,
            },
          ],
          preview: {
            select: {
              key: '_key',
              value: 'value',
            },
            prepare({key, value}) {
              return {title: key, subtitle: value?.slice(0, 80)}
            },
          },
        },
      ],
    },
  ],
}
