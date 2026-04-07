import { sanityClient } from '@/sanity/client'
import { blogPostsQuery, blogPostBySlugQuery } from '@/sanity/queries'
import type { BlogPost } from '@/types'

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return []
  try {
    return await sanityClient.fetch<BlogPost[]>(blogPostsQuery, {}, { next: { revalidate: 300 } })
  } catch {
    return []
  }
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return null
  try {
    return await sanityClient.fetch<BlogPost | null>(
      blogPostBySlugQuery,
      { slug },
      { next: { revalidate: 300 } }
    )
  } catch {
    return null
  }
}
