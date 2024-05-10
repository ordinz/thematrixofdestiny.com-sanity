import {positionField, positionOrdering} from '../position'

export default {
  name: 'video-course',
  title: 'Video Course',
  type: 'document',
  orderings: [positionOrdering],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
      },
      validation: (Rule) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'text',
      title: 'Text',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'image',
      title: 'Cover Image',
      type: 'image',
    },
    {
      name: 'headerImage',
      title: 'Header Image for Mobile',
      type: 'image',
    },
    {
      name: 'headerImage_lg',
      title: 'Header Image for Desktop',
      type: 'image',
    },
    {
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'section'}]}],
    },
    {
      name: 'product',
      title: 'Product',
      description: 'The product that this course is associated with (stripe)',
      type: 'reference',
      to: [{type: 'product'}], // Referencing the 'product' type
    },
    {
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [{type: 'string'}],
    },
    positionField,
    {
      name: 'faq',
      title: 'FAQ',
      type: 'array',
      of: [{type: 'faq'}],
    },
  ],
}
