// src/app/[locale]/blog/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { getBlogPostBySlug } from '@/lib/content'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)
  if (!post) notFound()
  // Will be implemented when Sanity is connected
  return null
}
