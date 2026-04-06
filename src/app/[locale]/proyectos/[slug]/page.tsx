// src/app/[locale]/proyectos/[slug]/page.tsx
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import {
  getProjectBySlug,
  getRelatedProjects,
  getMaterialsByIds,
} from '@/lib/content'
import type { Locale } from '@/types'
import { getLocalizedField } from '@/lib/utils'
import ProjectGallery from '@/components/projects/ProjectGallery'
import SimilarProjectCTA from '@/components/projects/SimilarProjectCTA'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const project = await getProjectBySlug(slug)
  if (!project) return {}
  return {
    title: `${getLocalizedField(project.seo.metaTitle, locale as Locale)} — ConceptoFino`,
    description: getLocalizedField(project.seo.metaDescription, locale as Locale),
  }
}

export default async function ProjectPage({ params }: Props) {
  const { locale, slug } = await params
  const loc = locale as Locale

  const [project, related] = await Promise.all([
    getProjectBySlug(slug),
    getProjectBySlug(slug).then((p) =>
      p ? getRelatedProjects(slug, p.category) : []
    ),
  ])

  if (!project) notFound()

  const materials = await getMaterialsByIds(project.materialIds)
  const t = await getTranslations({ locale, namespace: 'projects' })

  return (
    <article className="pt-16">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[400px]">
        <Image
          src={project.mainImage.src}
          alt={getLocalizedField(project.mainImage.alt, loc)}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/70 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12 max-w-screen-xl mx-auto">
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-brand-accent mb-2">
            {project.category} · {project.year} · {project.location}
          </p>
          <h1 className="font-serif text-3xl lg:text-5xl text-brand-cream">
            {getLocalizedField(project.title, loc)}
          </h1>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-12">
            <p className="font-sans text-base text-brand-gray leading-relaxed">
              {getLocalizedField(project.description, loc)}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div>
                <h2 className="font-serif text-xl text-brand-black mb-3">
                  {t('challenge')}
                </h2>
                <div className="w-8 h-px bg-brand-accent mb-4" />
                <p className="font-sans text-sm text-brand-gray leading-relaxed">
                  {getLocalizedField(project.challenge, loc)}
                </p>
              </div>
              <div>
                <h2 className="font-serif text-xl text-brand-black mb-3">
                  {t('solution')}
                </h2>
                <div className="w-8 h-px bg-brand-accent mb-4" />
                <p className="font-sans text-sm text-brand-gray leading-relaxed">
                  {getLocalizedField(project.solution, loc)}
                </p>
              </div>
            </div>

            {project.gallery.length > 0 && (
              <ProjectGallery images={project.gallery} locale={loc} />
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-1 space-y-10">
            {materials.length > 0 && (
              <div>
                <h3 className="font-sans text-xs tracking-[0.15em] uppercase text-brand-gray mb-4">
                  {t('materials_used')}
                </h3>
                <ul className="space-y-3">
                  {materials.map((mat) => (
                    <li key={mat.id}>
                      <Link
                        href={`/${loc}/materiales/${mat.slug}`}
                        className="group flex items-center gap-3 hover:text-brand-accent transition-colors"
                      >
                        <div className="w-10 h-10 relative overflow-hidden flex-shrink-0">
                          <Image
                            src={mat.textureImage.src}
                            alt={getLocalizedField(mat.textureImage.alt, loc)}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <span className="font-sans text-sm text-brand-dark group-hover:text-brand-accent transition-colors">
                          {getLocalizedField(mat.title, loc)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {related.length > 0 && (
              <div>
                <h3 className="font-sans text-xs tracking-[0.15em] uppercase text-brand-gray mb-4">
                  {t('related')}
                </h3>
                <ul className="space-y-4">
                  {related.map((rel) => (
                    <li key={rel.id}>
                      <Link
                        href={`/${loc}/proyectos/${rel.slug}`}
                        className="group flex items-center gap-3"
                      >
                        <div className="w-16 h-12 relative overflow-hidden flex-shrink-0">
                          <Image
                            src={rel.mainImage.src}
                            alt={getLocalizedField(rel.mainImage.alt, loc)}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <span className="font-sans text-sm text-brand-dark group-hover:text-brand-accent transition-colors leading-snug">
                          {getLocalizedField(rel.title, loc)}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </div>

      <SimilarProjectCTA projectSlug={project.slug} locale={loc} />
    </article>
  )
}
