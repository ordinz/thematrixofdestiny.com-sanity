// teamMember
export default {
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  preview: {
    select: {
      title: 'name',
      media: 'image',
      order: 'sortOrder', // Summon the sortOrder from the depths
    },
    prepare(selection) {
      const {title, order} = selection // Separate the spirits from one another

      return {
        ...selection,
        title: `${order}. ${title}`, // Combine them in a dance most harmonious
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
              name: 'title',
              title: 'Title',
              type: 'string',
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
  ],
}
