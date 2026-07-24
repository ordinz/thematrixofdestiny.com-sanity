export default {
  name: 'comparisonTableSection',
  title: 'Comparison Table Section',
  type: 'object',
  preview: {
    select: {
      title: 'title',
      headers: 'headers',
    },
    prepare({title, headers}) {
      return {
        title: title || 'Comparison Table',
        subtitle: headers?.length ? `${headers.length} column(s)` : undefined,
      }
    },
  },
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'headers',
      title: 'Headers',
      type: 'array',
      of: [{type: 'string'}],
    },
    {
      name: 'rows',
      title: 'Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'comparisonTableRow',
          title: 'Row',
          preview: {
            select: {
              cells: 'cells',
            },
            prepare({cells}) {
              return {
                title: cells?.filter(Boolean).join(' · ') || 'Row',
              }
            },
          },
          fields: [
            {
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [{type: 'string'}],
            },
          ],
        },
      ],
    },
  ],
}
