// src/app/[locale]/materiales/page.tsx
import type { Metadata } from 'next'
import { getMaterials } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import type { Locale } from '@/types'
import MaterialGrid from '@/components/materials/MaterialGrid'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const titles: Record<string, string> = { es: 'Materiales y acabados — ConceptoFino', en: 'Materials & finishes — ConceptoFino', ru: 'Материалы и отделка — ConceptoFino' }
  const descriptions: Record<string, string> = {
    es: 'Descubre los materiales premium que usamos en ConceptoFino: maderas nobles como roble y nogal, acero inoxidable, piedra natural, lacados y textiles de calidad.',
    en: 'Discover the premium materials we use at ConceptoFino: fine woods like oak and walnut, stainless steel, natural stone, lacquers and quality textiles.',
    ru: 'Откройте материалы премиум-класса ConceptoFino: ценные породы дерева — дуб и орех, нержавеющая сталь, натуральный камень, лаки и качественные текстильные изделия.',
  }
  return buildMetadata({ title: titles[locale] ?? titles.es, description: descriptions[locale] ?? descriptions.es, path: `/${locale}/materiales`, locale: locale as 'es' | 'en' | 'ru' })
}

export default async function MaterialesPage({ params }: Props) {
  const { locale } = await params
  const materials = await getMaterials()

  return (
    <div className="pt-24 lg:pt-32">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
        <div className="mb-16">
          <p className="font-sans text-xs tracking-[0.25em] uppercase text-brand-accent mb-3">Catálogo</p>
          <h1 className="font-serif text-4xl lg:text-5xl text-brand-black mb-4">Nuestros materiales</h1>
          <p className="font-sans text-brand-gray">Solo los mejores materiales para espacios que duran toda la vida.</p>
        </div>
        <MaterialGrid materials={materials} locale={locale as Locale} />
      </div>
    </div>
  )
}
