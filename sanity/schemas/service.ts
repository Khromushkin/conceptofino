import { defineType, defineField } from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title.es' } }),
    defineField({ name: 'title', title: 'Title', type: 'localizedString', validation: (R) => R.required() }),
    defineField({ name: 'description', title: 'Description', type: 'localizedText' }),
    defineField({ name: 'longDescription', title: 'Long Description', type: 'localizedText' }),
    defineField({ name: 'icon', title: 'Icon name (Lucide)', type: 'string' }),
    defineField({ name: 'image', title: 'Hero image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'featured', title: 'Featured on homepage', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Display order', type: 'number' }),
    defineField({ name: 'startingPrice', title: 'Starting price (€)', type: 'number' }),
  ],
  preview: { select: { title: 'title.es' } },
})
