import { defineType, defineField } from 'sanity'

export const material = defineType({
  name: 'material',
  title: 'Material',
  type: 'document',
  fields: [
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name.es' } }),
    defineField({ name: 'name', title: 'Name', type: 'localizedString', validation: (R) => R.required() }),
    defineField({ name: 'description', title: 'Description', type: 'localizedText' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'category', title: 'Category', type: 'string', options: { list: ['wood', 'lacquer', 'metal', 'stone', 'glass', 'fabric'] } }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Display order', type: 'number' }),
  ],
  preview: { select: { title: 'name.es', media: 'image' } },
})
