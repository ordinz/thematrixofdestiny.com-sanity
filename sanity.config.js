import {defineConfig} from 'sanity'
import {deskTool} from 'sanity/desk'
import {visionTool} from '@sanity/vision'
import {vercelDeployTool} from 'sanity-plugin-vercel-deploy'
import {schemaTypes, groups} from './schemas'

export default defineConfig({
  name: 'default',
  title: 'matrixofdestiny.com',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID,
  dataset: process.env.SANITY_STUDIO_DATASET,

  plugins: [
    deskTool({
      name: 'default',
      title: 'Content',
      structure: (S) => {
        // Function to create a list item for each schema type
        const createListItem = (schemaType) =>
          S.listItem()
            .title(schemaType.title) // Assuming each schema has a 'title' property

            .schemaType(schemaType.name)
            .child(S.documentTypeList(schemaType.name).title(schemaType.title))

        // Map over groups to create a section for each
        const groupSections = groups.map((group) =>
          S.listItem()
            .title(group.title)
            .icon(group.icon) // Add icon here
            .child(
              S.list().title(`${group.title} Content`).items(group.schemaTypes.map(createListItem)),
            ),
        )

        return S.list().title('Content').items(groupSections) // Add group sections here
      },
      // ... other configurations ...
    }),
    visionTool(),
    vercelDeployTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
