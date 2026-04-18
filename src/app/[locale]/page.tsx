import type { Metadata } from 'next'
import { setRequestLocale } from 'next-intl/server'
import { getFeaturedProjects } from '@/lib/content'
import type { Locale } from '@/types'
import { buildMetadata } from '@/lib/seo'
import HeroSection from '@/components/home/HeroSection'
import UTPSection from '@/components/home/UTPSection'
import FeaturedProjects from '@/components/home/FeaturedProjects'
import PhilosophySection from '@/components/home/PhilosophySection'
import ServicesPreview from '@/components/home/ServicesPreview'
import CTASection from '@/components/home/CTASection'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const titles: Record<string, string> = {
    es: 'ConceptoFino — Muebles a medida en Valencia',
    en: 'ConceptoFino — Custom Furniture in Valencia, Spain',
    ru: 'ConceptoFino — Мебель на заказ в Валенсии, Испания',
  }
  const descriptions: Record<string, string> = {
    es: 'Armarios empotrados, cocinas y muebles de diseño personalizados en Valencia. Calidad artesanal integrada en tu hogar, al precio de IKEA. Presupuesto gratuito.',
    en: 'Custom built-in wardrobes, kitchens and designer furniture in Valencia. Artisan quality tailored to your home at IKEA prices. Request a free quote today.',
    ru: 'Встроенные шкафы, кухни и дизайнерская мебель на заказ в Валенсии. Качество ремесленника, интегрированное в ваш дом, по цене IKEA. Бесплатная смета.',
  }
  return buildMetadata({
    title: titles[locale] ?? titles.es,
    description: descriptions[locale] ?? descriptions.es,
    path: `/${locale}`,
    locale: locale as 'es' | 'en' | 'ru',
  })
}

export default async function HomePage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const featuredProjects = await getFeaturedProjects()

  return (
    <>
      <HeroSection locale={locale as Locale} />
      <UTPSection />
      <FeaturedProjects projects={featuredProjects} locale={locale as Locale} />
      <PhilosophySection />
      <ServicesPreview locale={locale as Locale} />
      <CTASection locale={locale as Locale} />
    </>
  )
}
