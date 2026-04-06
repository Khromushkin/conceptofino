// src/app/[locale]/proyectos/page.tsx
import type { Metadata } from 'next'
import { getProjects } from '@/lib/content'
import type { Locale } from '@/types'
import ProjectGrid from '@/components/projects/ProjectGrid'
import { buildMetadata } from '@/lib/seo'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const titles: Record<string, string> = { es: 'Proyectos — ConceptoFino', en: 'Projects — ConceptoFino', ru: 'Проекты — ConceptoFino' }
  const descriptions: Record<string, string> = {
    es: 'Galería de proyectos de muebles a medida en Valencia. Armarios, cocinas, salones y más.',
    en: 'Custom furniture project gallery in Valencia. Wardrobes, kitchens, living rooms and more.',
    ru: 'Галерея проектов мебели на заказ в Валенсии. Шкафы, кухни, гостиные и другое.',
  }
  return buildMetadata({ title: titles[locale] ?? titles.es, description: descriptions[locale] ?? descriptions.es, path: `/${locale}/proyectos`, locale: locale as 'es' | 'en' | 'ru' })
}

export default async function ProyectosPage({ params }: Props) {
  const { locale } = await params
  const projects = await getProjects()

  return (
    <div className="pt-24 lg:pt-32">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
        <div className="mb-12">
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-brand-accent mb-3">
            Portfolio
          </p>
          <h1 className="font-serif text-4xl lg:text-5xl text-brand-black">
            Proyectos
          </h1>
        </div>
        <ProjectGrid projects={projects} locale={locale as Locale} />
      </div>
    </div>
  )
}
