export default {
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'The name of the reviewer.',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      description: 'Unique URL identifier for the review, generated from the name.',
    },
    {
      name: 'review',
      title: 'Review',
      type: 'text',
      description: 'The content of the review.',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      description: 'Image associated with the review, if any.',
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      description: 'Rating out of 5.',
      validation: (Rule) => Rule.required().min(1).max(5),
    },
    {
      name: 'postedAt',
      title: 'Posted At',
      type: 'datetime',
      description: 'Date and time when the review was posted.',
    },
    // Additional fields can be added as needed
  ],
}
