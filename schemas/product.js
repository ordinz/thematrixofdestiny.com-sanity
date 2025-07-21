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

// Base pricing fields that are shared across platforms
const basePricingFields = [
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

// Stripe-specific fields (maintaining current structure)
const stripeFields = basePricingFields

// Apple App Store configuration fields
const appleFields = [
  {
    name: 'productId',
    title: 'Product ID',
    type: 'string',
    description: 'Apple App Store Product ID (e.g., com.kairose.premium_monthly)',
  },
  {
    name: 'price',
    title: 'Price',
    type: 'number',
    description: 'Base price in USD',
  },
  {
    name: 'subscriptionGroupId',
    title: 'Subscription Group ID',
    type: 'string',
    description: 'Apple App Store Subscription Group ID',
  },
  {
    name: 'introOffer',
    title: 'Introductory Offer',
    type: 'object',
    fields: [
      {
        name: 'enabled',
        title: 'Enabled',
        type: 'boolean',
        initialValue: false,
      },
      {
        name: 'type',
        title: 'Offer Type',
        type: 'string',
        options: {
          list: ['free', 'pay_as_you_go', 'pay_up_front'],
        },
      },
      {
        name: 'duration',
        title: 'Duration (days)',
        type: 'number',
      },
      {
        name: 'price',
        title: 'Intro Price',
        type: 'number',
      },
    ],
  },
  {
    name: 'familySharing',
    title: 'Family Sharing',
    type: 'boolean',
    initialValue: false,
    description: 'Enable family sharing for this product',
  },
]

// Google Play configuration fields
const googlePlayFields = [
  {
    name: 'productId',
    title: 'Product ID',
    type: 'string',
    description: 'Google Play Product ID (e.g., premium_monthly)',
  },
  {
    name: 'price',
    title: 'Price',
    type: 'number',
    description: 'Base price in USD',
  },
  {
    name: 'subscriptionId',
    title: 'Subscription ID',
    type: 'string',
    description: 'Google Play Subscription ID',
  },
  {
    name: 'introOffer',
    title: 'Introductory Offer',
    type: 'object',
    fields: [
      {
        name: 'enabled',
        title: 'Enabled',
        type: 'boolean',
        initialValue: false,
      },
      {
        name: 'type',
        title: 'Offer Type',
        type: 'string',
        options: {
          list: ['free', 'pay_as_you_go', 'pay_up_front'],
        },
      },
      {
        name: 'duration',
        title: 'Duration (days)',
        type: 'number',
      },
      {
        name: 'price',
        title: 'Intro Price',
        type: 'number',
      },
    ],
  },
  {
    name: 'familySharing',
    title: 'Family Sharing',
    type: 'boolean',
    initialValue: false,
    description: 'Enable family sharing for this product',
  },
]

// Regional pricing configuration
const regionalPricingFields = [
  {
    name: 'region',
    title: 'Region',
    type: 'string',
    options: {
      list: [
        'US', 'CA', 'GB', 'DE', 'FR', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI',
        'AU', 'NZ', 'JP', 'KR', 'SG', 'HK', 'TW', 'IN', 'BR', 'MX', 'AR', 'CL', 'CO', 'PE'
      ],
    },
  },
  {
    name: 'currency',
    title: 'Currency',
    type: 'string',
    options: {
      list: ['USD', 'CAD', 'GBP', 'EUR', 'JPY', 'KRW', 'SGD', 'HKD', 'TWD', 'INR', 'BRL', 'MXN', 'ARS', 'CLP', 'COP', 'PEN'],
    },
  },
  {
    name: 'price',
    title: 'Local Price',
    type: 'number',
  },
  {
    name: 'higherPrice',
    title: 'Higher Price',
    type: 'number',
  },
]

// Company and environment configuration
const companyEnvironmentFields = (platformFields) => [
  {
    name: 'llc_production',
    title: 'LLC Production',
    type: 'object',
    fields: platformFields,
  },
  {
    name: 'llc_sandbox',
    title: 'LLC Sandbox',
    type: 'object',
    fields: platformFields,
  },
  {
    name: 'ltd_production',
    title: 'LTD Production',
    type: 'object',
    fields: platformFields,
  },
  {
    name: 'ltd_sandbox',
    title: 'LTD Sandbox',
    type: 'object',
    fields: platformFields,
  },
]

export default {
  name: 'product',
  title: 'Product',
  type: 'document',
  groups: [
    {
      name: 'basics',
      title: 'Basic Information',
    },
    {
      name: 'content',
      title: 'Content & Media',
    },
    {
      name: 'legacy',
      title: 'Legacy Stripe (Deprecated)',
    },
    {
      name: 'platforms',
      title: 'Platform Configurations',
    },
    {
      name: 'pricing',
      title: 'Pricing & Features',
    },
    {
      name: 'metadata',
      title: 'Metadata & Tracking',
    },
  ],
  fields: [
    // Basic Information Group
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      group: 'basics',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 200, // You can adjust the max length
      },
      group: 'basics',
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: [{type: 'productCategory'}],
      description: 'Optional category for organizing products',
      group: 'basics',
    },
    {
      name: 'productType',
      title: 'Product Type',
      type: 'string',
      options: {
        list: [
          {title: 'Subscription', value: 'subscription'},
          {title: 'One-time Purchase', value: 'one_time'},
          {title: 'Consumable', value: 'consumable'},
        ],
      },
      initialValue: 'subscription',
      group: 'basics',
    },
    {
      name: 'available',
      title: 'Available',
      type: 'boolean',
      initialValue: true, // Defaulted to true
      group: 'basics',
    },
    {
      name: 'allow_promotion_codes',
      title: 'Allow Promotion Codes',
      type: 'boolean',
      initialValue: false, // Defaulted to false
      group: 'basics',
    },
    {
      name: 'isSubscription',
      title: 'Is Subscription',
      type: 'boolean',
      initialValue: false,
      group: 'basics',
    },
    {
      name: 'quantity',
      title: 'Quantity',
      description: 'Number of products they receive',
      type: 'number',
      validation: (Rule) => Rule.min(1).integer(), // Ensuring it's a positive integer
      group: 'basics',
    },
    
    // Content & Media Group
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
      group: 'content',
    },
    {
      name: 'featureItems',
      title: 'Feature Items',
      type: 'array',
      of: [{type: 'string'}],
      group: 'content',
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
      group: 'content',
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      group: 'content',
    },
    
    // Legacy Stripe Group (Deprecated)
    {
      name: 'stripe',
      title: 'Stripe (Legacy - Deprecated)',
      type: 'object',
      fields: [
        {
          name: 'llc_production',
          title: 'LLC Production',
          type: 'object',
          fields: stripeFields,
        },
        {
          name: 'mx_production',
          title: 'Mx Production (DISCONTINUED)',
          type: 'object',
          fields: stripeFields,
        },
        {
          name: 'stripe_sandbox',
          title: 'Stripe Sandbox',
          type: 'object',
          fields: stripeFields,
        },
        {
          name: 'mx_development',
          title: 'Mx Development (DISCONTINUED)',
          type: 'object',
          fields: stripeFields,
        },
      ],
      group: 'legacy',
    },
    
    // Platform Configurations Group
    {
      name: 'platforms',
      title: 'Platform Configurations',
      type: 'object',
      fields: [
        {
          name: 'stripe',
          title: 'Stripe',
          type: 'object',
          fields: companyEnvironmentFields(stripeFields),
        },
        {
          name: 'apple',
          title: 'Apple App Store',
          type: 'object',
          fields: companyEnvironmentFields(appleFields),
        },
        {
          name: 'googlePlay',
          title: 'Google Play',
          type: 'object',
          fields: companyEnvironmentFields(googlePlayFields),
        },
      ],
      group: 'platforms',
    },
    
    // Pricing & Features Group
    {
      name: 'regionalPricing',
      title: 'Regional Pricing',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: regionalPricingFields,
        },
      ],
      group: 'pricing',
    },
    {
      name: 'features',
      title: 'Features/Entitlements',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Feature Name',
              type: 'string',
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
            },
            {
              name: 'type',
              title: 'Feature Type',
              type: 'string',
              options: {
                list: ['access', 'content', 'functionality', 'support'],
              },
            },
            {
              name: 'value',
              title: 'Feature Value',
              type: 'string',
              description: 'e.g., "unlimited", "10", "premium"',
            },
          ],
        },
      ],
      group: 'pricing',
    },
    
    // Metadata & Tracking Group
    {
      name: 'metadata',
      title: 'Metadata',
      type: 'object',
      fields: [
        {
          name: 'createdAt',
          title: 'Created At',
          type: 'datetime',
          readOnly: true,
        },
        {
          name: 'updatedAt',
          title: 'Updated At',
          type: 'datetime',
          readOnly: true,
        },
        {
          name: 'lastSynced',
          title: 'Last Synced',
          type: 'datetime',
          description: 'Last time product was synced to platforms',
        },
      ],
      group: 'metadata',
    },
    
    // Sync Status Group
    {
      name: 'syncStatus',
      title: 'Sync Status',
      type: 'object',
      fields: [
        {
          name: 'stripe',
          title: 'Stripe Sync Status',
          type: 'object',
          fields: [
            {
              name: 'synced',
              title: 'Synced',
              type: 'boolean',
              initialValue: false,
              description: 'Whether product is synced to Stripe',
            },
            {
              name: 'lastSync',
              title: 'Last Sync',
              type: 'datetime',
              description: 'Last successful sync to Stripe',
            },
            {
              name: 'error',
              title: 'Last Error',
              type: 'string',
              description: 'Last sync error message',
            },
            {
              name: 'productId',
              title: 'Stripe Product ID',
              type: 'string',
              description: 'Stripe Product ID after sync',
            },
            {
              name: 'priceId',
              title: 'Stripe Price ID',
              type: 'string',
              description: 'Stripe Price ID after sync',
            },
            {
              name: 'syncAttempts',
              title: 'Sync Attempts',
              type: 'number',
              initialValue: 0,
              description: 'Number of sync attempts',
            },
          ],
        },
        {
          name: 'apple',
          title: 'Apple App Store Sync Status',
          type: 'object',
          fields: [
            {
              name: 'synced',
              title: 'Synced',
              type: 'boolean',
              initialValue: false,
              description: 'Whether product is synced to Apple App Store',
            },
            {
              name: 'lastSync',
              title: 'Last Sync',
              type: 'datetime',
              description: 'Last successful sync to Apple App Store',
            },
            {
              name: 'error',
              title: 'Last Error',
              type: 'string',
              description: 'Last sync error message',
            },
            {
              name: 'productId',
              title: 'Apple Product ID',
              type: 'string',
              description: 'Apple App Store Product ID after sync',
            },
            {
              name: 'syncAttempts',
              title: 'Sync Attempts',
              type: 'number',
              initialValue: 0,
              description: 'Number of sync attempts',
            },
          ],
        },
        {
          name: 'google',
          title: 'Google Play Sync Status',
          type: 'object',
          fields: [
            {
              name: 'synced',
              title: 'Synced',
              type: 'boolean',
              initialValue: false,
              description: 'Whether product is synced to Google Play',
            },
            {
              name: 'lastSync',
              title: 'Last Sync',
              type: 'datetime',
              description: 'Last successful sync to Google Play',
            },
            {
              name: 'error',
              title: 'Last Error',
              type: 'string',
              description: 'Last sync error message',
            },
            {
              name: 'productId',
              title: 'Google Product ID',
              type: 'string',
              description: 'Google Play Product ID after sync',
            },
            {
              name: 'syncAttempts',
              title: 'Sync Attempts',
              type: 'number',
              initialValue: 0,
              description: 'Number of sync attempts',
            },
          ],
        },
      ],
      group: 'metadata',
    },
  ],
  preview: {
    select: {
      title: 'name',
      productType: 'productType',
      available: 'available',
      media: 'image',
    },
    prepare({title, productType, available, media}) {
      return {
        title: title || 'Untitled Product',
        subtitle: `${productType || 'Unknown Type'} • ${available ? 'Available' : 'Unavailable'}`,
        media: media,
      }
    },
  },
}
