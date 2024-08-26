export default {
  name: 'genericText',
  title: 'Text (Generic)',
  type: 'document',
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
  },
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Title of the document',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'teamMember'},
    },
    {
      name: 'a',
      title: 'Text A',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Text of the document',
    },
    {
      name: 'b',
      title: 'Text B',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Text of the document',
    },
    {
      name: 'c',
      title: 'Text C',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Text of the document',
    },
    {
      name: 'listA',
      title: 'List A',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
            },
            {
              name: 'subtitle',
              title: 'Subtitle',
              type: 'string',
            },
            {
              name: 'text',
              title: 'Text',
              type: 'array',
              of: [{type: 'block'}],
            },
            {
              name: 'image',
              title: 'Image',
              type: 'image',
            },
            {
              name: 'url',
              title: 'URL',
              type: 'string',
            },
            {
              name: 'free',
              title: 'Free',
              type: 'boolean',
            },
            {
              name: 'hidden',
              title: 'Hidden',
              type: 'boolean',
            },
          ],
        },
      ],
    },
  ],
}
