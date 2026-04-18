// src/app/[locale]/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getBlogPostBySlug } from '@/lib/content'
import { buildMetadata, buildArticleJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/ui/JsonLd'
import { getLocalizedField } from '@/lib/utils'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) return {}
  const loc = locale as 'es' | 'en' | 'ru'
  return buildMetadata({
    title: `${getLocalizedField(post.title, loc)} — ConceptoFino`,
    description: getLocalizedField(post.excerpt, loc),
    path: `/${locale}/blog/${slug}`,
    locale: loc,
    image: post.mainImage?.src,
  })
}

export default async function BlogPostPage({ params }: Props) {
  const { locale, slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()
  const loc = locale as 'es' | 'en' | 'ru'
  // Will be implemented when Sanity is connected
  return (
    <>
      <JsonLd data={buildArticleJsonLd({
        title: getLocalizedField(post.title, loc),
        description: getLocalizedField(post.excerpt, loc),
        url: `https://conceptofino.com/${loc}/blog/${post.slug}`,
        image: post.mainImage?.src ?? `https://conceptofino.com/og-default.jpg`,
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        locale: loc,
      })} />
    </>
  )
}
