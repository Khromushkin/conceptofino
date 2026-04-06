import { getProjectsByCategory } from '@/lib/content'
import type { Locale } from '@/types'
import ProjectGrid from '@/components/projects/ProjectGrid'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function IntegralesPage({ params }: Props) {
  const { locale } = await params
  const projects = await getProjectsByCategory('integrales')
  return (
    <div className="pt-24 lg:pt-32">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
        <h1 className="font-serif text-4xl lg:text-5xl text-brand-black mb-12">
          Reformas Integrales
        </h1>
        <ProjectGrid projects={projects} locale={locale as Locale} />
      </div>
    </div>
  )
}
