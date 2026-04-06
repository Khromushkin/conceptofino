// src/app/[locale]/materiales/page.tsx
import type { Metadata } from 'next'
import { getMaterials } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import type { Locale } from '@/types'
import MaterialGrid from '@/components/materials/MaterialGrid'
import SectionHeading from '@/components/ui/SectionHeading'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const titles: Record<string, string> = { es: 'Materiales y acabados — ConceptoFino', en: 'Materials & finishes — ConceptoFino', ru: 'Материалы и отделка — ConceptoFino' }
  const descriptions: Record<string, string> = {
    es: 'Descubre los materiales premium que usamos: maderas nobles, lacados, acero y más.',
    en: 'Discover the premium materials we use: fine woods, lacquers, steel and more.',
    ru: 'Откройте для себя материалы премиум-класса: ценные породы дерева, лаки, сталь и другое.',
  }
  return buildMetadata({ title: titles[locale] ?? titles.es, description: descriptions[locale] ?? descriptions.es, path: `/${locale}/materiales`, locale: locale as 'es' | 'en' | 'ru' })
}

export default async function MaterialesPage({ params }: Props) {
  const { locale } = await params
  const materials = await getMaterials()

  return (
    <div className="pt-24 lg:pt-32">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
        <SectionHeading
          label="Catálogo"
          title="Nuestros materiales"
          subtitle="Solo los mejores materiales para espacios que duran toda la vida."
          className="mb-16"
        />
        <MaterialGrid materials={materials} locale={locale as Locale} />
      </div>
    </div>
  )
}
