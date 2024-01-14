import {positionField, positionOrdering} from '../position'
import video from './video'

// Video Schema
export default {
  name: 'video',
  title: 'Video',
  type: 'document',
  orderings: [positionOrdering],
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
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
      type: 'text',
    },
    positionField,
  ],
}
