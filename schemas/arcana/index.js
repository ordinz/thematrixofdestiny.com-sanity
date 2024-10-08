import love from './love'
import purpose from './purpose'
import moneyLine from './money'
import character from './character'
import talents from './talents'
import {romance, friendship} from './connection'
import year from './year'

export default {
  name: 'arcana',
  title: 'Arcana',
  type: 'document',
  groups: [
    {
      name: 'basics',
      title: 'Basic Information',
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
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      group: 'basics',
    },

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
  ],
}
