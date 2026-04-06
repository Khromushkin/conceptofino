// src/app/[locale]/contacto/page.tsx
import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import { Phone, Mail, MapPin } from 'lucide-react'
import { getSiteSettings } from '@/lib/content'
import type { Locale } from '@/types'
import { getLocalizedField } from '@/lib/utils'
import ContactForm from '@/components/contact/ContactForm'
import GoogleMap from '@/components/contact/GoogleMap'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const titles: Record<string, string> = { es: 'Contacto — ConceptoFino Valencia', en: 'Contact — ConceptoFino Valencia', ru: 'Контакты — ConceptoFino Валенсия' }
  const descriptions: Record<string, string> = {
    es: 'Solicita tu presupuesto gratuito. Diseñamos y fabricamos muebles a medida en Valencia.',
    en: 'Request your free quote. We design and make custom furniture in Valencia.',
    ru: 'Запросите бесплатную смету. Проектируем и изготавливаем мебель на заказ в Валенсии.',
  }
  return buildMetadata({ title: titles[locale] ?? titles.es, description: descriptions[locale] ?? descriptions.es, path: `/${locale}/contacto`, locale: locale as 'es' | 'en' | 'ru' })
}

export default async function ContactoPage({ params }: Props) {
  const { locale } = await params
  const loc = locale as Locale
  const [t, settings] = await Promise.all([
    getTranslations({ locale, namespace: 'contact' }),
    getSiteSettings(),
  ])

  return (
    <div className="pt-24 lg:pt-32">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left: info */}
          <div>
            <h1 className="font-serif text-4xl lg:text-5xl text-brand-black mb-4">
              {t('title')}
            </h1>
            <p className="font-sans text-brand-gray mb-10">{t('subtitle')}</p>

            <ul className="space-y-5 mb-12">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-accent mt-0.5 flex-shrink-0" />
                <p className="font-sans text-sm text-brand-black">
                  {getLocalizedField(settings.address, loc)}
                </p>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-accent flex-shrink-0" />
                <a
                  href={`tel:${settings.phone.replace(/\s/g, '')}`}
                  className="font-sans text-sm text-brand-black hover:text-brand-accent transition-colors"
                >
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand-accent flex-shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="font-sans text-sm text-brand-black hover:text-brand-accent transition-colors"
                >
                  {settings.email}
                </a>
              </li>
            </ul>

            <GoogleMap embedUrl={settings.googleMapsEmbedUrl} />
          </div>

          {/* Right: form */}
          <div>
            <ContactForm />
          </div>
        </div>
      </div>
    </div>
  )
}
