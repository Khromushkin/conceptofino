import type { Locale, LocalizedString } from '@/types'

export function getLocalizedField(
  field: LocalizedString,
  locale: Locale
): string {
  return field[locale] ?? field.es
}

export function formatDate(dateString: string, locale: Locale): string {
  const date = new Date(dateString)
  const localeMap: Record<Locale, string> = {
    es: 'es-ES',
    en: 'en-GB',
    ru: 'ru-RU',
  }
  return date.toLocaleDateString(localeMap[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
