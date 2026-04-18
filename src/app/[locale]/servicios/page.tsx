import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getServices } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import type { Locale } from '@/types'
import { getLocalizedField } from '@/lib/utils'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const titles: Record<string, string> = {
    es: 'Servicios de diseño y fabricación — ConceptoFino',
    en: 'Design & Manufacturing Services — ConceptoFino',
    ru: 'Услуги дизайна и производства — ConceptoFino',
  }
  const descriptions: Record<string, string> = {
    es: 'Diseño personalizado, fabricación artesanal y montaje profesional de muebles a medida en Valencia. Tres etapas, un resultado único adaptado a tu espacio y estilo.',
    en: 'Bespoke design, artisan manufacturing and professional installation of custom furniture in Valencia. Three stages, one unique result tailored to your space and style.',
    ru: 'Индивидуальный дизайн, ремесленное производство и профессиональный монтаж мебели на заказ в Валенсии. Три этапа, один уникальный результат, адаптированный под вас.',
  }
  return buildMetadata({
    title: titles[locale] ?? titles.es,
    description: descriptions[locale] ?? descriptions.es,
    path: `/${locale}/servicios`,
    locale: locale as 'es' | 'en' | 'ru',
  })
}

export default async function ServiciosPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const loc = locale as Locale
  const services = await getServices()
  const t = await getTranslations({ locale, namespace: 'services' })

  const steps = [
    { num: '01', label: t('step1'), desc: t('step1_desc'), img: '/images/projects/cocinas/3-lg.webp' },
    { num: '02', label: t('step2'), desc: t('step2_desc'), img: '/images/projects/armarios/1-lg.webp' },
    { num: '03', label: t('step3'), desc: t('step3_desc'), img: '/images/projects/vestidores/3-lg.webp' },
  ]

  return (
    <>
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <Image
          src="/images/projects/cocinas/0-lg.webp"
          alt="ConceptoFino servicios"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-black/55" />
        <div className="absolute inset-0 flex items-end pb-16 px-6 lg:px-16 max-w-screen-xl mx-auto">
          <RevealOnScroll>
            <p className="font-sans text-xs tracking-[0.25em] uppercase text-brand-accent mb-3">
              ConceptoFino
            </p>
            <h1 className="font-serif text-4xl lg:text-6xl text-white">
              {t('title')}
            </h1>
            <p className="font-sans text-brand-light/70 mt-3 text-lg">{t('subtitle')}</p>
          </RevealOnScroll>
        </div>
      </div>

      {/* Service cards */}
      <section className="py-24 max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, i) => (
            <RevealOnScroll key={service.id} delay={i * 0.1}>
              <Link
                href={`/${loc}/servicios/${service.slug}`}
                className="group block border border-brand-light hover:border-brand-accent transition-colors duration-300 overflow-hidden"
              >
                <div className="relative h-52 overflow-hidden">
                  <Image
                    src={[
                      '/images/projects/cocinas/1-lg.webp',
                      '/images/projects/armarios/0-lg.webp',
                      '/images/projects/vestidores/1-lg.webp',
                    ][i]}
                    alt={getLocalizedField(service.title, loc)}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-8">
                  <span className="font-serif text-3xl text-brand-accent/30 block mb-4">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h2 className="font-serif text-xl text-brand-black group-hover:text-brand-accent transition-colors mb-3">
                    {getLocalizedField(service.title, loc)}
                  </h2>
                  <p className="font-sans text-sm text-brand-gray leading-relaxed">
                    {getLocalizedField(service.description, loc).slice(0, 120)}…
                  </p>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </section>

      {/* Process steps */}
      <section className="bg-brand-light py-24">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <RevealOnScroll>
            <p className="font-sans text-xs tracking-[0.25em] uppercase text-brand-accent mb-3">
              {loc === 'es' ? 'Nuestro proceso' : loc === 'ru' ? 'Наш процесс' : 'Our process'}
            </p>
            <h2 className="font-serif text-3xl lg:text-4xl text-brand-black mb-16">
              {loc === 'es' ? 'De la idea a tu hogar en 3 pasos' : loc === 'ru' ? 'От идеи до дома за 3 шага' : 'From idea to your home in 3 steps'}
            </h2>
          </RevealOnScroll>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {steps.map((step, i) => (
              <RevealOnScroll key={step.num} delay={i * 0.15}>
                <div className="relative overflow-hidden">
                  <div className="relative h-64 mb-6 overflow-hidden">
                    <Image
                      src={step.img}
                      alt={step.label}
                      fill
                      sizes="(max-width: 1024px) 100vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute top-4 left-4 bg-brand-black/70 px-3 py-1">
                      <span className="font-sans text-xs text-brand-accent tracking-widest">{step.num}</span>
                    </div>
                  </div>
                  <h3 className="font-serif text-xl text-brand-black mb-2">{step.label}</h3>
                  <p className="font-sans text-sm text-brand-gray">{step.desc}</p>
                </div>
              </RevealOnScroll>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 text-center max-w-screen-xl mx-auto px-6 lg:px-10">
        <RevealOnScroll>
          <h2 className="font-serif text-3xl lg:text-4xl text-brand-black mb-6">
            {loc === 'es' ? '¿Preparado para empezar tu proyecto?' : loc === 'ru' ? 'Готовы начать свой проект?' : 'Ready to start your project?'}
          </h2>
          <Link
            href={`/${loc}/contacto`}
            className="inline-block bg-brand-accent text-white font-sans text-xs tracking-[0.2em] uppercase px-10 py-4 hover:bg-brand-accent/90 transition-colors"
          >
            {loc === 'es' ? 'Solicitar presupuesto gratuito' : loc === 'ru' ? 'Запросить бесплатную смету' : 'Request a free quote'}
          </Link>
        </RevealOnScroll>
      </section>
    </>
  )
}
