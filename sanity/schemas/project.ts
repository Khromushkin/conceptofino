import { defineType, defineField, defineArrayMember } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title.es', maxLength: 96 }, validation: (R) => R.required() }),
    defineField({ name: 'title', title: 'Title', type: 'localizedString', validation: (R) => R.required() }),
    defineField({ name: 'description', title: 'Description', type: 'localizedText' }),
    defineField({ name: 'longDescription', title: 'Long Description', type: 'localizedText' }),
    defineField({ name: 'category', title: 'Category', type: 'string', options: { list: ['wardrobes', 'kitchens', 'living', 'bathrooms', 'commercial', 'complete'] } }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'images', title: 'Gallery Images', type: 'array', of: [defineArrayMember({ type: 'image', options: { hotspot: true } })] }),
    defineField({ name: 'area', title: 'Area (m²)', type: 'number' }),
    defineField({ name: 'location', title: 'Location', type: 'localizedString' }),
    defineField({ name: 'completedAt', title: 'Completed At', type: 'date' }),
    defineField({ name: 'featured', title: 'Featured on homepage', type: 'boolean', initialValue: false }),
    defineField({ name: 'materials', title: 'Materials', type: 'array', of: [defineArrayMember({ type: 'reference', to: [{ type: 'material' }] })] }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime' }),
  ],
  preview: { select: { title: 'title.es', media: 'coverImage' } },
  orderings: [
    { title: 'Newest first', name: 'completedAtDesc', by: [{ field: 'completedAt', direction: 'desc' }] },
  ],
})
