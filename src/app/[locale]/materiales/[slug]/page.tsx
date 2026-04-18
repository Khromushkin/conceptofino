// src/app/[locale]/materiales/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getMaterialBySlug, getMaterialsByCategory, getProjects } from '@/lib/content'
import { buildBreadcrumbJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/ui/JsonLd'
import type { Locale, MaterialCategory } from '@/types'
import { getLocalizedField } from '@/lib/utils'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  const slugs = ['roble-natural','nogal-americano','acero-inoxidable','piedra-natural','terciopelo-gris','maderas','piedra','metales','textiles']
  return slugs.map((slug) => ({ slug }))
}

const CATEGORIES: MaterialCategory[] = ['maderas', 'piedra', 'metales', 'textiles']

const categoryLabels: Record<MaterialCategory, Record<string, string>> = {
  maderas: { es: 'Maderas', en: 'Woods', ru: 'Дерево' },
  piedra: { es: 'Piedra', en: 'Stone', ru: 'Камень' },
  metales: { es: 'Metales', en: 'Metals', ru: 'Металлы' },
  textiles: { es: 'Textiles', en: 'Textiles', ru: 'Текстиль' },
}

export default async function MaterialSlugPage({ params }: Props) {
  const { locale, slug } = await params
  const loc = locale as Locale

  // If slug is a category name, render category listing
  if (CATEGORIES.includes(slug as MaterialCategory)) {
    const category = slug as MaterialCategory
    const categoryMaterials = await getMaterialsByCategory(category)
    const label = categoryLabels[category][loc] ?? categoryLabels[category].es

    return (
      <div className="pt-24 lg:pt-32">
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
          <div className="mb-12">
            <Link
              href={`/${loc}/materiales`}
              className="font-sans text-xs tracking-[0.15em] uppercase text-brand-accent hover:underline mb-4 inline-block"
            >
              ← {loc === 'es' ? 'Todos los materiales' : loc === 'ru' ? 'Все материалы' : 'All materials'}
            </Link>
            <h1 className="font-serif text-4xl lg:text-5xl text-brand-black">{label}</h1>
          </div>

          {categoryMaterials.length === 0 ? (
            <p className="font-sans text-brand-gray">
              {loc === 'es' ? 'Próximamente.' : loc === 'ru' ? 'Скоро.' : 'Coming soon.'}
            </p>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {categoryMaterials.map((mat) => (
                <Link
                  key={mat.id}
                  href={`/${loc}/materiales/${mat.slug}`}
                  className="group block"
                >
                  <div className="relative overflow-hidden aspect-square mb-4">
                    <Image
                      src={mat.textureImage.src}
                      alt={getLocalizedField(mat.textureImage.alt, loc)}
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <p className="font-sans text-[10px] tracking-[0.15em] uppercase text-brand-accent mb-1">
                    {mat.category}
                  </p>
                  <h3 className="font-serif text-lg text-brand-black group-hover:text-brand-accent transition-colors duration-200">
                    {getLocalizedField(mat.title, loc)}
                  </h3>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    )
  }

  // Otherwise treat slug as a material slug
  const material = await getMaterialBySlug(slug)
  if (!material) notFound()

  const allProjects = await getProjects()
  const relatedProjects = allProjects.filter((p) =>
    material.projectIds?.includes(p.id) ?? false
  )

  return (
    <div className="pt-24 lg:pt-32">
      <JsonLd data={buildBreadcrumbJsonLd([
        { name: loc === 'es' ? 'Inicio' : loc === 'ru' ? 'Главная' : 'Home', url: `https://conceptofino.com/${loc}` },
        { name: loc === 'es' ? 'Materiales' : loc === 'ru' ? 'Материалы' : 'Materials', url: `https://conceptofino.com/${loc}/materiales` },
        { name: getLocalizedField(material.title, loc), url: `https://conceptofino.com/${loc}/materiales/${material.slug}` },
      ])} />
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
          <Link
            href={`/${loc}/materiales/${material.category}`}
            className="font-sans text-xs tracking-[0.2em] uppercase text-brand-accent mb-2 inline-block hover:underline"
          >
            {material.category}
          </Link>
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
