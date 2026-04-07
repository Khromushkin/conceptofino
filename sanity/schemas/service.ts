import { defineType, defineField, defineArrayMember } from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Servicio',
  type: 'document',
  fields: [
    defineField({ name: 'slug', title: 'Slug (URL)', type: 'slug', options: { source: 'title.es' }, validation: (R) => R.required() }),
    defineField({ name: 'title', title: 'Título', type: 'localizedString', validation: (R) => R.required() }),
    defineField({ name: 'description', title: 'Descripción', type: 'localizedText' }),
    defineField({ name: 'icon', title: 'Icono (nombre Lucide)', type: 'string' }),
    defineField({
      name: 'mainImage',
      title: 'Imagen hero',
      type: 'object',
      fields: [
        defineField({ name: 'asset', title: 'Imagen', type: 'image', options: { hotspot: true } }),
        defineField({ name: 'alt', title: 'Texto alternativo', type: 'localizedString' }),
      ],
    }),
    defineField({
      name: 'steps',
      title: 'Pasos del proceso',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          name: 'step',
          fields: [
            defineField({ name: 'title', title: 'Título del paso', type: 'localizedString' }),
            defineField({ name: 'description', title: 'Descripción', type: 'localizedText' }),
            defineField({ name: 'icon', title: 'Icono (nombre Lucide)', type: 'string' }),
            defineField({
              name: 'image',
              title: 'Imagen',
              type: 'object',
              fields: [
                defineField({ name: 'asset', title: 'Imagen', type: 'image', options: { hotspot: true } }),
                defineField({ name: 'alt', title: 'Texto alternativo', type: 'localizedString' }),
              ],
            }),
          ],
          preview: { select: { title: 'title.es' } },
        }),
      ],
    }),
    defineField({ name: 'featured', title: 'Destacado en portada', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Orden de visualización', type: 'number', initialValue: 99 }),
  ],
  preview: { select: { title: 'title.es' } },
  orderings: [
    { title: 'Orden manual', name: 'orderAsc', by: [{ field: 'order', direction: 'asc' }] },
  ],
})
