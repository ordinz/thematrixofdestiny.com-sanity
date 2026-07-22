import images from './arcana/images'
import love from './arcana/love'
import purpose from './arcana/purpose'
import moneyLine from './arcana/money'
import character from './arcana/character'
import talents from './arcana/talents'
import {romance, friendship} from './arcana/connection'
import year from './arcana/year'
import inspiration from './arcana/inspiration'
import mission from './arcana/mission'

export default {
  name: 'arcana_v2',
  title: 'Arcana V2',
  type: 'document',
  groups: [
    {
      name: 'basics',
      title: 'Basic Information',
    },
    {
      name: 'images',
      title: 'Images',
    },
    {
      name: 'aspects',
      title: 'Aspects',
    },
    {
      name: 'character',
      title: 'Character',
    },
    {
      name: 'money',
      title: 'Money Line',
    },
    {name: 'love', title: 'Love Line'},
    {name: 'purpose', title: 'Purpose'},
    {name: 'talents', title: 'Talents'},
    {name: 'year', title: 'Year'},
    {name: 'romance', title: 'Romance Connection'},
    {name: 'friendship', title: 'Friendship Connection'},
    {name: 'inspiration', title: 'Inspiration'},
    {name: 'mission', title: 'Mission'},
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'number.current',
    },
  },
  fields: [
    {
      name: 'number',
      group: 'basics',
      title: 'Number',
      type: 'slug',
      description: 'Number of the card',
      // validation: (Rule) => Rule.positive().integer(),
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      group: 'basics',
      description: 'Title of the document',
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'string'}],
      group: 'basics',
    },
    ...images,
    ...character, // an array of fields
    {...moneyLine},
    {...love, group: 'love'},
    {
      ...purpose,
      group: 'purpose',
    },
    {...talents, group: 'talents'},
    {...romance, group: 'romance'},
    {...friendship, group: 'friendship'},
    {...year, group: 'year'},
    {...inspiration, group: 'inspiration'},
    ...mission,
  ],
}
