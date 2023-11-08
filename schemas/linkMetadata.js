export default {
  name: 'linkMetadata',
  title: 'URL Metadata',
  type: 'document',
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
      options: {
        list: [
          {title: 'Website', value: 'website'},
          {title: 'Article', value: 'article'},
          {title: 'Book', value: 'book'},
          {title: 'Profile', value: 'profile'},
          {title: 'Music Song', value: 'music.song'},
          {title: 'Music Album', value: 'music.album'},
          {title: 'Music Playlist', value: 'music.playlist'},
          {title: 'Music Radio Station', value: 'music.radio_station'},
          {title: 'Video Movie', value: 'video.movie'},
          {title: 'Video Episode', value: 'video.episode'},
          {title: 'Video TV Show', value: 'video.tv_show'},
          {title: 'Video Other', value: 'video.other'},
        ],
      },
      description: 'The nature of the content. This will be used in the og:type meta tag.',
    },
    {
      name: 'ogSiteName',
      title: 'Site Name',
      type: 'string',
      description:
        'The name of the website or the overall site that the content belongs to. Used in the og:site_name meta tag.',
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
