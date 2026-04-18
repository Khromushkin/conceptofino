// src/app/[locale]/blog/page.tsx
import type { Metadata } from 'next'
import { getTranslations, setRequestLocale } from 'next-intl/server'
import { getBlogPosts } from '@/lib/content'
import { buildMetadata } from '@/lib/seo'
import SectionHeading from '@/components/ui/SectionHeading'

interface Props {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const titles: Record<string, string> = {
    es: 'Blog de diseño de interiores — ConceptoFino',
    en: 'Interior Design Blog — ConceptoFino Valencia',
    ru: 'Блог о дизайне интерьера — ConceptoFino',
  }
  const descriptions: Record<string, string> = {
    es: 'Artículos, consejos e inspiración sobre diseño de interiores, muebles a medida y decoración del hogar. Ideas para transformar tu espacio en Valencia y más allá.',
    en: 'Articles, tips and inspiration on interior design, custom furniture and home decoration. Ideas to transform your space in Valencia and beyond.',
    ru: 'Статьи, советы и вдохновение по дизайну интерьера, мебели на заказ и декору дома. Идеи для преобразования вашего пространства в Валенсии и за её пределами.',
  }
  return buildMetadata({
    title: titles[locale] ?? titles.es,
    description: descriptions[locale] ?? descriptions.es,
    path: `/${locale}/blog`,
    locale: locale as 'es' | 'en' | 'ru',
  })
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'blog' })
  const posts = await getBlogPosts()

  return (
    <div className="pt-24 lg:pt-32">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
        <SectionHeading
          label="Blog"
          title={t('title')}
          subtitle={t('subtitle')}
          className="mb-16"
        />
        {posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="font-serif text-2xl text-brand-gray/50">
              Próximamente...
            </p>
            <p className="font-sans text-sm text-brand-gray/40 mt-2">
              Estamos preparando contenido para ti.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Blog cards will appear here when Sanity is connected */}
          </div>
        )}
      </div>
    </div>
  )
}
