<<<<<<< HEAD
import {Boxes, DollarSign, Languages, Pyramid, Search, Sparkles} from 'lucide-react'
=======
import {Baby, Boxes, DollarSign, Pyramid, Search, Sparkles} from 'lucide-react'
>>>>>>> b466a1e (feat(schemas): add Child Matrix content model)
import arcana from './arcana'
import arcana_v2 from './arcana_v2'
// import {schemaTypes as blogSchemaTypes} from './blog'
import {
  matrixSection,
  matrixPosition,
  interpretationBlock,
  sourceSnapshot,
} from './child-matrix'
import faq from './faq'
import genericText from './genericText'
import karmaTail from './karmaTail'
import karmicTail_v2 from './karmicTail_v2'
import line from './line'
import pageMetadata from './pageMetadata'
import product from './product'
import review from './review'
import teamMember from './teamMember'
import uiMessage from './uiMessage'
// import videoCourses from './video-courses'

export const groups = [
<<<<<<< HEAD
  {title: 'Arcana', icon: Sparkles, schemaTypes: [arcana, arcana_v2, karmaTail, karmicTail_v2]},
=======
  {title: 'Arcana', icon: Sparkles, schemaTypes: [arcana, karmaTail]},
  {
    title: 'Child Matrix',
    icon: Baby,
    schemaTypes: [matrixSection, matrixPosition, interpretationBlock, sourceSnapshot],
  },
>>>>>>> b466a1e (feat(schemas): add Child Matrix content model)
  {title: 'Sales', icon: DollarSign, schemaTypes: [product]},
  {title: 'Landing Page', icon: Pyramid, schemaTypes: [review, faq, teamMember]},
  {title: 'SEO', icon: Search, schemaTypes: [pageMetadata]},
  {title: 'UI', icon: Languages, schemaTypes: [uiMessage]},
  {title: 'Other', icon: Boxes, schemaTypes: [genericText]},
]

export const schemaTypes = groups.reduce((types, group) => {
  return types.concat(group.schemaTypes)
}, [])
