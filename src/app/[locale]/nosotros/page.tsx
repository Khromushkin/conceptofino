// src/app/[locale]/nosotros/page.tsx
import type { Metadata } from 'next'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { buildMetadata } from '@/lib/seo'
import { getTeam, getReviews } from '@/lib/content'
import type { Locale } from '@/types'
import { getLocalizedField } from '@/lib/utils'
import ReviewsSection from '@/components/about/ReviewsSection'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const titles: Record<string, string> = { es: 'Sobre nosotros — ConceptoFino', en: 'About us — ConceptoFino', ru: 'О нас — ConceptoFino' }
  const descriptions: Record<string, string> = {
    es: 'Conoce al equipo de ConceptoFino — artesanos valencianos con pasión por el diseño de interiores a medida.',
    en: 'Meet the ConceptoFino team — Valencian craftspeople with a passion for bespoke interior design.',
    ru: 'Познакомьтесь с командой ConceptoFino — валенсийские мастера с страстью к дизайну интерьеров на заказ.',
  }
  return buildMetadata({ title: titles[locale] ?? titles.es, description: descriptions[locale] ?? descriptions.es, path: `/${locale}/nosotros`, locale: locale as 'es' | 'en' | 'ru' })
}

export default async function NosotrosPage({ params }: Props) {
  const { locale } = await params
  const loc = locale as Locale
  const [team, reviews, t] = await Promise.all([
    getTeam(),
    getReviews(),
    getTranslations({ locale, namespace: 'about' }),
  ])

  return (
    <>
      <div className="pt-24 lg:pt-32">
        {/* Header */}
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
          <RevealOnScroll>
            <h1 className="font-serif text-4xl lg:text-5xl text-brand-black mb-4">
              {t('title')}
            </h1>
            <p className="font-sans text-brand-gray max-w-xl">{t('subtitle')}</p>
          </RevealOnScroll>
        </div>

        {/* History */}
        <div className="bg-brand-light py-20">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <RevealOnScroll direction="left">
                <div className="relative h-[420px] overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1609220136736-443140cfeaa8?w=900&q=80"
                    alt="ConceptoFino workshop"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </RevealOnScroll>
              <RevealOnScroll direction="right">
                <div>
                  <h2 className="font-serif text-3xl text-brand-black mb-4">
                    {t('history_title')}
                  </h2>
                  <div className="w-8 h-px bg-brand-accent mb-6" />
                  <p className="font-sans text-base text-brand-gray leading-relaxed">
                    {t('history_body')}
                  </p>
                </div>
              </RevealOnScroll>
            </div>
          </div>
        </div>

        {/* Team */}
        <div className="py-20">
          <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
            <RevealOnScroll>
              <h2 className="font-serif text-3xl text-brand-black mb-12 text-center">
                El equipo
              </h2>
            </RevealOnScroll>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {team.map((member, i) => (
                <RevealOnScroll key={member.id} delay={i * 0.1}>
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-5 overflow-hidden rounded-full">
                      <Image
                        src={member.photoUrl}
                        alt={member.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h3 className="font-serif text-xl text-brand-black mb-1">
                      {member.name}
                    </h3>
                    <p className="font-sans text-xs tracking-[0.1em] uppercase text-brand-accent mb-3">
                      {getLocalizedField(member.role, loc)}
                    </p>
                    <p className="font-sans text-sm text-brand-gray leading-relaxed">
                      {getLocalizedField(member.bio, loc)}
                    </p>
                  </div>
                </RevealOnScroll>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ReviewsSection reviews={reviews} locale={loc} title={t('reviews_title')} />
    </>
  )
}
