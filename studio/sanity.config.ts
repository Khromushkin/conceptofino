import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from '../sanity/schemas'

export default defineConfig({
  name: 'conceptofino',
  title: 'ConceptoFino CMS',
  projectId: 'qbetivec',
  dataset: 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
})
