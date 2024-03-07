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
      name: 'released',
      title: 'Released',
      description: 'Check this box when the video is ready for the public',
      type: 'boolean',
      default: false,
    },
    {
      name: 'free',
      title: 'Free',
      description: 'Available to everyone without a purchase',
      type: 'boolean',
      default: false,
    },
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
    {
      name: 'digitalDownloads',
      title: 'Digital Downloads',
      description: 'Embed digital downloads related to this video',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {name: 'title', title: 'Title', type: 'string'},
            {name: 'file', title: 'File', type: 'file', options: {storeOriginalFilename: true}},
          ],
        },
      ],
    },
    positionField,
  ],
}
