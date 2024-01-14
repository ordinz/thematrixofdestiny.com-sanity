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
      title: 'Image',
      type: 'image',
    },
    {
      name: 'sections',
      title: 'Sections',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'section'}]}],
    },
    positionField,
  ],
}
