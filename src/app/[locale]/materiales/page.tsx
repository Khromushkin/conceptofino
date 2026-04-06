// src/app/[locale]/materiales/page.tsx
import { getMaterials } from '@/lib/content'
import type { Locale } from '@/types'
import MaterialGrid from '@/components/materials/MaterialGrid'
import SectionHeading from '@/components/ui/SectionHeading'

interface Props {
  params: Promise<{ locale: string }>
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
