import { defineType, defineField } from 'sanity'

export const review = defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({ name: 'authorName', title: 'Author name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'authorLocation', title: 'Author location', type: 'string' }),
    defineField({ name: 'rating', title: 'Rating (1-5)', type: 'number', validation: (R) => R.min(1).max(5) }),
    defineField({ name: 'text', title: 'Review text', type: 'localizedText' }),
    defineField({ name: 'projectRef', title: 'Related project', type: 'reference', to: [{ type: 'project' }] }),
    defineField({ name: 'publishedAt', title: 'Published at', type: 'date' }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'source', title: 'Source', type: 'string', options: { list: ['google', 'instagram', 'direct', 'houzz'] } }),
  ],
  preview: { select: { title: 'authorName', subtitle: 'text.es' } },
})
