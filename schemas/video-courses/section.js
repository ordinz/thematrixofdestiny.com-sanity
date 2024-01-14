import {positionField, positionOrdering} from '../position'

export default {
  name: 'section',
  title: 'Section',
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
      name: 'videos',
      title: 'Videos',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'video'}]}],
    },
    {
      name: 'downloads',
      title: 'Downloadable Content',
      type: 'array',
      of: [{type: 'file'}],
    },
    positionField,
  ],
}
