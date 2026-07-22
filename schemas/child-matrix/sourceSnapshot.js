export default {
  name: 'sourceSnapshot',
  title: 'Source Snapshot',
  type: 'document',
  description:
    'Raw captured content from an external source page (e.g. gadalkindom.ru child matrix). Kept for provenance and reversible import.',
  preview: {
    select: {
      title: 'pageTitle',
      subtitle: 'sourceUrl',
      media: 'fetchedAt',
    },
    prepare(selection) {
      const {title, subtitle} = selection
      return {
        title: title || subtitle || 'Untitled Snapshot',
        subtitle,
      }
    },
  },
  fields: [
    {
      name: 'pageTitle',
      title: 'Page Title',
      type: 'string',
    },
    {
      name: 'sourceUrl',
      title: 'Source URL',
      type: 'url',
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'sourceSite',
      title: 'Source Site',
      type: 'string',
      description: 'Short slug for the source site, e.g. gadalkindom, tvoyamatritsa, beloesolnce.',
    },
    {
      name: 'experienceKind',
      title: 'Experience Kind',
      type: 'string',
      options: {
        list: [
          {title: 'Child Matrix', value: 'child'},
          {title: 'Adult Matrix', value: 'adult'},
          {title: 'Compatibility', value: 'compatibility'},
          {title: 'Finance', value: 'finance'},
        ],
      },
    },
    {
      name: 'language',
      title: 'Language',
      type: 'string',
      initialValue: 'ru',
    },
    {
      name: 'fetchedAt',
      title: 'Fetched At',
      type: 'datetime',
    },
    {
      name: 'parserVersion',
      title: 'Parser Version',
      type: 'string',
      description: 'Version tag of the scraper/parser that produced this snapshot.',
    },
    {
      name: 'contentHash',
      title: 'Content Hash',
      type: 'string',
      description: 'Hash of rawText for change detection.',
    },
    {
      name: 'rawText',
      title: 'Raw Text',
      type: 'text',
      rows: 20,
      description: 'Plain-text capture of the page.',
    },
    {
      name: 'rawHtml',
      title: 'Raw HTML',
      type: 'text',
      rows: 20,
      description: 'Original HTML fragment. Optional.',
    },
    {
      name: 'normalizedJson',
      title: 'Normalized JSON',
      type: 'text',
      rows: 20,
      description: 'Structured JSON extracted from the page (sections, positions, arcana, bullets).',
    },
    {
      name: 'notes',
      title: 'Editorial Notes',
      type: 'text',
    },
  ],
}
