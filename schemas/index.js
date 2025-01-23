import {Boxes, DollarSign, Pyramid, Search, Sparkles} from 'lucide-react'
import arcana from './arcana'
// import {schemaTypes as blogSchemaTypes} from './blog'
import faq from './faq'
import genericText from './genericText'
import karmaTail from './karmaTail'
import line from './line'
import pageMetadata from './pageMetadata'
import product from './product'
import review from './review'
import teamMember from './teamMember'
// import videoCourses from './video-courses'

export const groups = [
  {title: 'Arcana', icon: Sparkles, schemaTypes: [arcana, karmaTail]},
  {title: 'Sales', icon: DollarSign, schemaTypes: [product]},
  {title: 'Landing Page', icon: Pyramid, schemaTypes: [review, faq, teamMember]},
  {title: 'SEO', icon: Search, schemaTypes: [pageMetadata]},
  {title: 'Other', icon: Boxes, schemaTypes: [genericText]},
]

export const schemaTypes = groups.reduce((types, group) => {
  return types.concat(group.schemaTypes)
}, [])
