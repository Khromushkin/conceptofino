import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
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
    en: 'ConceptoFino — Custom Furniture in Valencia',
    ru: 'ConceptoFino — Мебель на заказ в Валенсии',
  }
  const descriptions: Record<string, string> = {
    es: 'Armarios, cocinas y muebles de diseño personalizados. Por el precio de IKEA, pero hecho a medida para ti en Valencia.',
    en: 'Custom wardrobes, kitchens and designer furniture. At IKEA prices, but made to measure for you in Valencia.',
    ru: 'Шкафы, кухни и дизайнерская мебель на заказ. По цене IKEA, но сделано специально для вас в Валенсии.',
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
