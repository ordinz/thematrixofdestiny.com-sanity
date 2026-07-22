import images from './images'
import love from './love'
import purpose from './purpose'
import moneyLine from './money'
import character from './character'
import talents from './talents'
import {romance, friendship} from './connection'
import year from './year'
import inspiration from './inspiration'
import mission from './mission'
import {fatherLine, motherLine} from './ancestralLine'

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
    {name: 'ancestral', title: 'Father / Mother Lines'},
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
      name: 'teaserHook',
      title: 'Teaser Hook',
      type: 'string',
      group: 'basics',
      description:
        'Marketing hook for karmic-tail gates (≤140 chars). Generated offline; editable in review.',
      validation: (Rule) => Rule.max(160),
    },
    {
      name: 'patternName',
      title: 'Pattern Name',
      type: 'string',
      group: 'basics',
      description: 'Named karmic pattern for karmic-tail reveal (2–4 words, title case).',
      validation: (Rule) => Rule.max(40),
    },
    {
      name: 'loveTeaser',
      title: 'Love Teaser',
      type: 'string',
      group: 'basics',
      description: 'Marketing hook for love-line gates (≤140 chars).',
      validation: (Rule) => Rule.max(160),
    },
    {
      name: 'moneyTeaser',
      title: 'Money Teaser',
      type: 'string',
      group: 'basics',
      description: 'Marketing hook for money-line gates (≤140 chars).',
      validation: (Rule) => Rule.max(160),
    },
    {
      name: 'talentTeaser',
      title: 'Talents Teaser',
      type: 'string',
      group: 'basics',
      description: 'Marketing hook for talents section (≤140 chars). Center talent-line position.',
      validation: (Rule) => Rule.max(160),
    },
    {
      name: 'purposeTeaser',
      title: 'General Purpose Teaser',
      type: 'string',
      group: 'basics',
      description:
        'Marketing hook for purpose / Spiritual Harmony (general purpose) section (≤140 chars).',
      validation: (Rule) => Rule.max(160),
    },
    {
      name: 'teasersGenerated',
      title: 'Teasers Generated',
      type: 'boolean',
      group: 'basics',
      initialValue: false,
    },
    {
      name: 'teasersReviewed',
      title: 'Teasers Reviewed',
      type: 'boolean',
      group: 'basics',
      initialValue: false,
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
    {...fatherLine},
    {...motherLine},
  ],
}
