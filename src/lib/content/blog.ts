import type { BlogPost } from '@/types'

// Visual-first: empty blog, ready for Sanity migration
export async function getBlogPosts(): Promise<BlogPost[]> {
  return []
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function getBlogPostBySlug(_slug: string): Promise<BlogPost | null> {
  return null
}
