import { defineType, defineField } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'siteName', title: 'Site name', type: 'string' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'localizedString' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'whatsapp', title: 'WhatsApp number', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'address', title: 'Address', type: 'string' }),
    defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
    defineField({ name: 'googleMapsEmbed', title: 'Google Maps embed URL', type: 'url' }),
    defineField({ name: 'ogImage', title: 'Default OG image', type: 'image', options: { hotspot: true } }),
  ],
})
