// src/app/[locale]/servicios/page.tsx
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { getServices } from '@/lib/content'
import type { Locale } from '@/types'
import { getLocalizedField } from '@/lib/utils'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function ServiciosPage({ params }: Props) {
  const { locale } = await params
  const loc = locale as Locale
  const services = await getServices()
  const t = await getTranslations({ locale, namespace: 'services' })

  return (
    <div className="pt-24 lg:pt-32">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
        <RevealOnScroll>
          <h1 className="font-serif text-4xl lg:text-5xl text-brand-black mb-4">
            {t('title')}
          </h1>
          <p className="font-sans text-brand-gray mb-16">{t('subtitle')}</p>
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <RevealOnScroll key={service.id} delay={i * 0.1}>
              <Link
                href={`/${loc}/servicios/${service.slug}`}
                className="group block border border-brand-light p-8 hover:border-brand-accent transition-colors duration-300"
              >
                <span className="font-serif text-4xl text-brand-accent/30 block mb-4">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h2 className="font-serif text-xl text-brand-black group-hover:text-brand-accent transition-colors mb-3">
                  {getLocalizedField(service.title, loc)}
                </h2>
                <p className="font-sans text-sm text-brand-gray leading-relaxed">
                  {getLocalizedField(service.description, loc).slice(0, 120)}…
                </p>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </div>
  )
}
