// teamMember
export default {
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  orderings: [
    {
      title: 'Sort Order',
      by: [{field: 'sortOrder', direction: 'asc'}],
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      archived: 'archived',
      order: 'sortOrder',
    },
    prepare(selection) {
      const {title, order, archived} = selection

      return {
        ...selection,
        title: `${order}. ${title} ${archived ? '(archived)' : ''}`,
      }
    },
  },
  fields: [
    {
      name: 'sortOrder',
      title: 'Sort Order',
      type: 'number',
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Name',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      description: 'Email',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      description: 'Image',
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'Title',
    },
    {
      name: 'bio',
      title: 'Bio',
      type: 'array',
      of: [{type: 'block'}],
      description: 'Bio',
    },
    {
      name: 'social',
      title: 'Social',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'Twitter', value: 'twitter'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'TikTok', value: 'tiktok'},
                  {title: 'YouTube', value: 'youtube'},
                  {title: 'Telegram', value: 'telegram'},
                  {title: 'LinkedIn', value: 'linkedin'},
                  // ...and so forth for other platforms
                ],
              },
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
            },
          ],
        },
      ],
    },
    {
      name: 'archived',
      title: 'Archived',
      type: 'boolean',
      description: 'Archived',
    },
  ],
}
