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
      name: 'description',
      title: 'Description',
      type: 'text',
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
