import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {vercelDeployTool} from 'sanity-plugin-vercel-deploy'
import {schemaTypes} from './schemas'


export default defineConfig({
  name: 'default',
  title: 'matrixofdestiny.com',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,

  plugins: [deskTool(), visionTool(), vercelDeployTool()],

  schema: {
    types: schemaTypes,
  },
})
