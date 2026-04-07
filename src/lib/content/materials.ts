import { sanityClient } from '@/sanity/client'
import { materialsQuery, materialBySlugQuery } from '@/sanity/queries'
import { materials as fallback } from '@/data/materials'
import type { Material, MaterialCategory } from '@/types'

async function fetchMaterials(): Promise<Material[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return []
  try {
    return await sanityClient.fetch<Material[]>(materialsQuery, {}, { next: { revalidate: 60 } })
  } catch {
    return []
  }
}

export async function getMaterials(): Promise<Material[]> {
  const data = await fetchMaterials()
  return data.length ? data : fallback
}

export async function getMaterialBySlug(slug: string): Promise<Material | null> {
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    try {
      const data = await sanityClient.fetch<Material | null>(
        materialBySlugQuery,
        { slug },
        { next: { revalidate: 60 } }
      )
      if (data) return data
    } catch {}
  }
  return fallback.find((m) => m.slug === slug) ?? null
}

export async function getMaterialsByCategory(category: MaterialCategory): Promise<Material[]> {
  const all = await getMaterials()
  return all.filter((m) => m.category === category)
}

export async function getMaterialsByIds(ids: string[]): Promise<Material[]> {
  const all = await getMaterials()
  return all.filter((m) => ids.includes(m.id))
}
