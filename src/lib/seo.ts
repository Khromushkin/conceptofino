import type { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://conceptofino.com'
const SITE_NAME = 'ConceptoFino'
const LOCALES = ['es', 'en', 'ru'] as const
type Locale = (typeof LOCALES)[number]

interface BuildMetadataOptions {
  title: string
  description: string
  path: string
  locale: Locale
  image?: string
  noindex?: boolean
}

export function buildMetadata(opts: BuildMetadataOptions): Metadata {
  const { title, description, path, locale, image, noindex } = opts
  const url = `${SITE_URL}${path}`
  const ogImage = image ?? `${SITE_URL}/og-default.jpg`

  const alternateLanguages: Record<string, string> = {}
  for (const l of LOCALES) {
    const altPath = path.replace(`/${locale}/`, `/${l}/`).replace(`/${locale}`, `/${l}`)
    const hreflang = l === 'es' ? 'es-ES' : l === 'en' ? 'en-GB' : 'ru-RU'
    alternateLanguages[hreflang] = `${SITE_URL}${altPath}`
  }

  // x-default points to the Spanish version (primary market)
  const esPath = path.replace(`/${locale}/`, '/es/').replace(`/${locale}`, '/es')
  alternateLanguages['x-default'] = `${SITE_URL}${esPath}`

  return {
    title,
    description,
    alternates: { canonical: url, languages: alternateLanguages },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  }
}

export function buildLocalBusinessJsonLd(locale: Locale): Record<string, unknown> {
  const descriptions: Record<Locale, string> = {
    es: 'Muebles a medida y diseño de interiores en Valencia. Armarios, cocinas, salones — calidad artesanal al precio de IKEA.',
    en: 'Custom furniture and interior design in Valencia. Wardrobes, kitchens, living rooms — artisan quality at IKEA prices.',
    ru: 'Мебель на заказ и дизайн интерьера в Валенсии. Шкафы, кухни, гостиные — качество ремесленника по цене IKEA.',
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_NAME,
    description: descriptions[locale],
    url: SITE_URL,
    telephone: '+34 600 000 000',
    email: 'info@conceptofino.com',
    image: `${SITE_URL}/og-default.jpg`,
    logo: `${SITE_URL}/logo.svg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Valencia',
      addressLocality: 'Valencia',
      addressRegion: 'Comunitat Valenciana',
      postalCode: '46000',
      addressCountry: 'ES',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 39.4699, longitude: -0.3763 },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    sameAs: ['https://www.instagram.com/conceptofino/'],
    priceRange: '€€',
    areaServed: { '@type': 'State', name: 'Comunitat Valenciana' },
  }
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function buildArticleJsonLd(opts: {
  title: string
  description: string
  url: string
  image: string
  datePublished: string
  dateModified: string
  locale: Locale
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    image: opts.image,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    inLanguage: opts.locale,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.svg` },
    },
    author: { '@type': 'Organization', name: SITE_NAME },
  }
}
