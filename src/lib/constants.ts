import type { Locale } from '@/types'

export const LOCALES: Locale[] = ['es', 'en', 'ru']
export const DEFAULT_LOCALE: Locale = 'es'

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://conceptofino.com'

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '34657575939'

export const WHATSAPP_MESSAGES: Record<Locale, string> = {
  es: 'Hola, me interesa información sobre vuestros muebles a medida.',
  en: 'Hello, I am interested in information about your custom furniture.',
  ru: 'Здравствуйте, меня интересует информация о вашей мебели на заказ.',
}

export const PROJECT_CATEGORIES = [
  'cocinas',
  'vestidores',
  'muebles',
  'integrales',
] as const

export const MATERIAL_CATEGORIES = [
  'maderas',
  'piedra',
  'metales',
  'textiles',
] as const

export const NAV_ITEMS = {
  proyectos: [
    { key: 'cocinas', href: '/proyectos/cocinas' },
    { key: 'vestidores', href: '/proyectos/vestidores' },
    { key: 'muebles', href: '/proyectos/muebles' },
    { key: 'integrales', href: '/proyectos/integrales' },
  ],
  materiales: [
    { key: 'maderas', href: '/materiales/maderas' },
    { key: 'piedra', href: '/materiales/piedra' },
    { key: 'metales', href: '/materiales/metales' },
    { key: 'textiles', href: '/materiales/textiles' },
  ],
  servicios: [
    { key: 'diseno', href: '/servicios/diseno' },
    { key: 'fabricacion', href: '/servicios/fabricacion' },
    { key: 'montaje', href: '/servicios/montaje' },
  ],
}
