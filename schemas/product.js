export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 200, // You can adjust the max length
      },
    },
    {
      name: 'available',
      title: 'Available',
      type: 'boolean',
      initialValue: true, // Defaulted to true
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
    },
    {
      name: 'stripe',
      title: 'Stripe',
      type: 'object',
      fields: [
        {
          name: 'development',
          title: 'Development',
          type: 'object',
          fields: [
            {
              name: 'priceId',
              title: 'Price ID',
              type: 'string',
            },
          ],
        },
        {
          name: 'production',
          title: 'Production',
          type: 'object',
          fields: [
            {
              name: 'priceId',
              title: 'Price ID',
              type: 'string',
            },
          ],
        },
      ],
    },
    {
      name: 'quantity',
      title: 'Quantity',
      description: 'Number of products they receive',
      type: 'number',
      validation: (Rule) => Rule.min(1).integer(), // Ensuring it's a positive integer
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
    },
  ],
}
