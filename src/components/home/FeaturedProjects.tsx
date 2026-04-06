import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { Project, Locale } from '@/types'
import ProjectCard from '@/components/projects/ProjectCard'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

interface Props {
  projects: Project[]
  locale: Locale
}

export default async function FeaturedProjects({ projects, locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'projects' })

  const [wide, ...narrows] = projects.slice(0, 3)

  return (
    <section className="py-24 lg:py-32 bg-brand-white">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <RevealOnScroll>
          <div className="flex items-end justify-between mb-12">
            <h2 className="font-serif text-3xl lg:text-4xl text-brand-black">
              {t('title')}
            </h2>
            <Link
              href={`/${locale}/proyectos`}
              className="hidden sm:flex items-center gap-2 font-sans text-xs tracking-[0.12em] uppercase text-brand-accent hover:text-brand-black transition-colors"
            >
              {t('view_all')} →
            </Link>
          </div>
        </RevealOnScroll>

        {wide && (
          <RevealOnScroll delay={0.1}>
            <div className="mb-3">
              <ProjectCard project={wide} locale={locale} variant="wide" />
            </div>
          </RevealOnScroll>
        )}

        {narrows.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
            {narrows.map((project, i) => (
              <RevealOnScroll key={project.id} delay={0.1 + i * 0.1}>
                <ProjectCard project={project} locale={locale} variant="narrow" />
              </RevealOnScroll>
            ))}
          </div>
        )}

        <div className="sm:hidden mt-8 text-center">
          <Link
            href={`/${locale}/proyectos`}
            className="font-sans text-xs tracking-[0.12em] uppercase text-brand-accent hover:text-brand-black transition-colors"
          >
            {t('view_all')} →
          </Link>
        </div>
      </div>
    </section>
  )
}
