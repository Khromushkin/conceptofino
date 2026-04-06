import { defineType, defineField } from 'sanity'

export const localizedString = defineType({
  name: 'localizedString',
  title: 'Localized String',
  type: 'object',
  fields: [
    defineField({ name: 'es', title: 'Español', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'en', title: 'English', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'ru', title: 'Русский', type: 'string', validation: (R) => R.required() }),
  ],
})

export const localizedText = defineType({
  name: 'localizedText',
  title: 'Localized Text',
  type: 'object',
  fields: [
    defineField({ name: 'es', title: 'Español', type: 'text' }),
    defineField({ name: 'en', title: 'English', type: 'text' }),
    defineField({ name: 'ru', title: 'Русский', type: 'text' }),
  ],
})
