// src/app/[locale]/blog/page.tsx
import { getTranslations } from 'next-intl/server'
import { getBlogPosts } from '@/lib/content'
import SectionHeading from '@/components/ui/SectionHeading'

interface Props {
  params: Promise<{ locale: string }>
}

export default async function BlogPage({ params }: Props) {
  const { locale } = await params
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
