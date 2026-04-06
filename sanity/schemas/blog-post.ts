import { defineType, defineField } from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title.es', maxLength: 96 }, validation: (R) => R.required() }),
    defineField({ name: 'title', title: 'Title', type: 'localizedString', validation: (R) => R.required() }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'localizedText' }),
    defineField({ name: 'coverImage', title: 'Cover image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'publishedAt', title: 'Published at', type: 'datetime', validation: (R) => R.required() }),
    defineField({ name: 'category', title: 'Category', type: 'string', options: { list: ['trends', 'tips', 'projects', 'materials'] } }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
  ],
  preview: { select: { title: 'title.es', media: 'coverImage' } },
  orderings: [
    { title: 'Published, newest', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
})
