import { defineType, defineField, defineArrayMember } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Proyecto',
  type: 'document',
  fields: [
    defineField({ name: 'slug', title: 'Slug (URL)', type: 'slug', options: { source: 'title.es', maxLength: 96 }, validation: (R) => R.required() }),
    defineField({ name: 'title', title: 'Título', type: 'localizedString', validation: (R) => R.required() }),
    defineField({ name: 'description', title: 'Descripción corta', type: 'localizedText' }),
    defineField({ name: 'challenge', title: 'Reto / desafío', type: 'localizedText' }),
    defineField({ name: 'solution', title: 'Solución', type: 'localizedText' }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: { list: ['cocinas', 'vestidores', 'muebles', 'integrales'] },
      validation: (R) => R.required(),
    }),
    defineField({ name: 'location', title: 'Ubicación', type: 'string' }),
    defineField({ name: 'year', title: 'Año', type: 'number' }),
    defineField({ name: 'featured', title: 'Destacado en portada', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Orden de visualización', type: 'number', initialValue: 99 }),
    defineField({
      name: 'mainImage',
      title: 'Imagen principal',
      type: 'object',
      fields: [
        defineField({ name: 'asset', title: 'Imagen', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'alt', title: 'Texto alternativo', type: 'localizedString' }),
      ],
    }),
    defineField({
      name: 'gallery',
      title: 'Galería',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({ name: 'asset', title: 'Imagen', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'alt', title: 'Texto alternativo', type: 'localizedString' }),
          ],
          preview: { select: { media: 'asset' } },
        }),
      ],
    }),
    defineField({
      name: 'materialIds',
      title: 'Materiales usados (slugs)',
      type: 'array',
      of: [defineArrayMember({ type: 'string' })],
      description: 'Slugs de materiales: roble-natural, nogal-americano, etc.',
    }),
  ],
  preview: {
    select: { title: 'title.es', media: 'mainImage.asset' },
    prepare({ title, media }) {
      return { title, media }
    },
  },
  orderings: [
    { title: 'Orden manual', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
})
