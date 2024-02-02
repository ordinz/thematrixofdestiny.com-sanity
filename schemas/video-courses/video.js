import {positionField, positionOrdering} from '../position'
import video from './video'

// Video Schema
export default {
  name: 'video',
  title: 'Video',
  type: 'document',
  orderings: [positionOrdering],
  preview: {
    select: {
      title: 'title',
      subtitle: 'slug.current',
    },
  },
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
      name: 'videoId',
      title: 'Video ID',
      description: 'The ID of the video on Loom',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'array',
      of: [{type: 'block'}],
    },
    {
      name: 'length',
      title: 'Length',
      type: 'number',
      description: 'Length in seconds',
    },
    positionField,
  ],
}
