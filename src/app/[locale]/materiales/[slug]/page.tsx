// src/app/[locale]/materiales/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getMaterialBySlug, getProjects } from '@/lib/content'
import type { Locale } from '@/types'
import { getLocalizedField } from '@/lib/utils'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export default async function MaterialPage({ params }: Props) {
  const { locale, slug } = await params
  const loc = locale as Locale
  const material = await getMaterialBySlug(slug)
  if (!material) notFound()

  const allProjects = await getProjects()
  const relatedProjects = allProjects.filter((p) =>
    material.projectIds.includes(p.id)
  )

  return (
    <div className="pt-24 lg:pt-32">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[360px]">
        <Image
          src={material.mainImage.src}
          alt={getLocalizedField(material.mainImage.alt, loc)}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/60 to-transparent" />
        <div className="absolute bottom-8 left-0 right-0 max-w-screen-xl mx-auto px-6 lg:px-10">
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-brand-accent mb-2">
            {material.category}
          </p>
          <h1 className="font-serif text-4xl text-brand-cream">
            {getLocalizedField(material.title, loc)}
          </h1>
        </div>
      </div>

      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-8">
            <p className="font-sans text-base text-brand-gray leading-relaxed">
              {getLocalizedField(material.description, loc)}
            </p>

            {/* Texture close-up */}
            <div className="relative h-64 overflow-hidden">
              <Image
                src={material.textureImage.src}
                alt={getLocalizedField(material.textureImage.alt, loc)}
                fill
                className="object-cover"
              />
            </div>
          </div>

          <aside className="space-y-8">
            {/* Characteristics */}
            <div>
              <h3 className="font-sans text-xs tracking-[0.15em] uppercase text-brand-gray mb-4">
                Características
              </h3>
              <ul className="space-y-2">
                {(material.characteristics[loc] ?? material.characteristics.es).map(
                  (char, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 font-sans text-sm text-brand-dark"
                    >
                      <span className="text-brand-accent mt-0.5">✓</span>
                      {char}
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Related projects */}
            {relatedProjects.length > 0 && (
              <div>
                <h3 className="font-sans text-xs tracking-[0.15em] uppercase text-brand-gray mb-4">
                  Proyectos con este material
                </h3>
                <ul className="space-y-3">
                  {relatedProjects.map((proj) => (
                    <li key={proj.id}>
                      <Link
                        href={`/${loc}/proyectos/${proj.slug}`}
                        className="group flex items-center gap-3"
                      >
                        <div className="w-14 h-10 relative overflow-hidden flex-shrink-0">
                          <Image
                            src={proj.mainImage.src}
                            alt={getLocalizedField(proj.mainImage.alt, loc)}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                        <span className="font-sans text-sm text-brand-dark group-hover:text-brand-accent transition-colors">
                          {getLocalizedField(proj.title, loc)}
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
    </div>
  )
}
