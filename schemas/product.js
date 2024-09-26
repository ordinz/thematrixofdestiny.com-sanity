const paymentPlanFields = {
  title: 'Payment Plans',
  name: 'paymentPlans',
  type: 'array',
  of: [
    {
      type: 'object',
      fields: [
        {
          title: 'Price',
          name: 'price',
          type: 'number', // Define the type as number for the price
          description: 'Set the price for this plan',
        },
        {
          title: 'Number of Payments (Iterations)',
          name: 'totalIterations',
          type: 'number', // Define the type as number for the price
          description: 'Total number of payments for this plan',
        },
        {
          title: 'Billing Interval',
          name: 'interval',
          type: 'string', // Define the billing interval
          options: {
            list: ['daily', 'monthly', 'bi-weekly'],
          },
          description: 'Frequency at which a subscription is billed',
        },
        {
          title: 'Price ID',
          name: 'priceId',
          type: 'string', // The Stripe Price ID associated with this plan
          description: 'Stripe Price ID for billing',
        },
      ],
      preview: {
        select: {
          price: 'price',
          priceId: 'priceId',
          interval: 'interval',
          totalIterations: 'totalIterations',
        },
        prepare({price, priceId, interval, totalIterations}) {
          return {
            title: `${totalIterations ? totalIterations : 'Iterations not set'} x ${
              price ? '$' + price : 'Price not set'
            } ${interval ? interval : 'Interval not set'}`,
            subtitle: priceId,
          }
        },
      },
    },
  ],
}

const stripeFields = [
  {
    name: 'priceId',
    title: 'Price ID',
    type: 'string',
  },
  {
    name: 'price',
    title: 'Price',
    type: 'number',
  },
  {
    name: 'higherPrice',
    title: 'Higher Price',
    description: "To show the 'from' price",
    type: 'number',
  },
  {
    name: 'promo',
    title: 'Promo',
    type: 'object',
    fields: [
      {
        name: 'priceId',
        title: 'Price ID',
        type: 'string',
      },
      {
        name: 'price',
        title: 'Price',
        type: 'number',
      },
      {
        name: 'higherPrice',
        title: 'Higher Price',
        description: "To show the 'from' price",
        type: 'number',
      },
    ],
  },
  paymentPlanFields,
]

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
      name: 'isSubscription',
      title: 'Is Subscription',
      type: 'boolean',
      initialValue: false,
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
      name: 'featureItems',
      title: 'Feature Items',
      type: 'array',
      of: [{type: 'string'}],
    },
    // {
    //   name: 'features',
    //   title: 'Features',
    //   type: 'array',
    //   of: [{type: 'block'}],
    // },
    // {
    //   name: 'higherPrice',
    //   title: 'Higher Price',
    //   description: "To show the 'from' price",
    //   type: 'number',
    // },
    // {
    //   name: 'price',
    //   title: 'Price',
    //   type: 'number',
    // },
    {
      name: 'stripe',
      title: 'Stripe',
      type: 'object',
      fields: [
        {
          name: 'mx_development',
          title: 'Mx Development',
          type: 'object',
          fields: stripeFields,
        },
        {
          name: 'mx_production',
          title: 'Mx Production',
          type: 'object',
          fields: stripeFields,
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
