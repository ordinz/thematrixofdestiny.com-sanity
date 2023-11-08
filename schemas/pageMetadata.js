export default {
  name: 'pageMetadata',
  title: 'URL Metadata',
  type: 'document',
  preview: {
    select: {
      title: 'title',
      subtitle: 'url.current',
      media: 'ogImage',
    },
  },
  fields: [
    {
      name: 'url',
      title: 'URL',
      type: 'slug',
      description:
        'The URL of your object that will be used as its permanent ID in the graph, e.g., /chart',
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      description: 'The title of the page, often used in the og:title meta tag.',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'A brief description of the page, often used in the og:description meta tag.',
    },
    {
      name: 'ogType',
      title: 'Type',
      type: 'string',
      initialValue: 'website',
      options: {
        list: [
          {title: 'Website', value: 'website'},
          {title: 'Article', value: 'article'},
          {title: 'Profile', value: 'profile'},
          {title: 'Video Other', value: 'video.other'},
        ],
      },
      description: 'The nature of the content. This will be used in the og:type meta tag.',
    },
    {
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'The image that represents the content. Used in the og:image meta tag.',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'url',
          title: 'URL',
          type: 'url',
          description: 'The URL of the image.',
        },
        {
          name: 'alt',
          title: 'Alternative Text',
          type: 'string',
          description: 'A description of the image for accessibility and SEO.',
        },
      ],
    },
    // Add more fields as necessary
  ],
}
