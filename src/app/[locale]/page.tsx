import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { getFeaturedProjects } from '@/lib/content'
import type { Locale } from '@/types'
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
  const t = await getTranslations({ locale, namespace: 'hero' })
  return {
    title: `ConceptoFino — ${t('title')}`,
    description: t('subtitle'),
    openGraph: {
      title: `ConceptoFino Valencia`,
      description: t('subtitle'),
      images: ['/og-image.jpg'],
      locale: locale,
    },
  }
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
