import { defineType, defineField, defineArrayMember } from 'sanity'

export const material = defineType({
  name: 'material',
  title: 'Material',
  type: 'document',
  fields: [
    defineField({ name: 'slug', title: 'Slug (URL)', type: 'slug', options: { source: 'title.es' }, validation: (R) => R.required() }),
    defineField({ name: 'title', title: 'Nombre', type: 'localizedString', validation: (R) => R.required() }),
    defineField({ name: 'description', title: 'Descripción', type: 'localizedText' }),
    defineField({
      name: 'characteristics',
      title: 'Características',
      type: 'object',
      fields: [
        defineField({ name: 'es', title: 'Español', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
        defineField({ name: 'en', title: 'English', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
        defineField({ name: 'ru', title: 'Русский', type: 'array', of: [defineArrayMember({ type: 'string' })] }),
      ],
    }),
    defineField({
      name: 'category',
      title: 'Categoría',
      type: 'string',
      options: { list: ['maderas', 'piedra', 'metales', 'textiles'] },
      validation: (R) => R.required(),
    }),
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
      name: 'textureImage',
      title: 'Imagen de textura',
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
    defineField({ name: 'featured', title: 'Destacado', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Orden de visualización', type: 'number', initialValue: 99 }),
  ],
  preview: { select: { title: 'title.es', media: 'mainImage.asset' } },
  orderings: [
    { title: 'Orden manual', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
})
