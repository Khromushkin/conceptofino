// src/lib/content/materials.ts
import { materials } from '@/data/materials'
import type { Material, MaterialCategory } from '@/types'

export async function getMaterials(): Promise<Material[]> {
  return materials
}

export async function getMaterialBySlug(slug: string): Promise<Material | null> {
  return materials.find((m) => m.slug === slug) ?? null
}

export async function getMaterialsByCategory(
  category: MaterialCategory
): Promise<Material[]> {
  return materials.filter((m) => m.category === category)
}

export async function getMaterialsByIds(ids: string[]): Promise<Material[]> {
  return materials.filter((m) => ids.includes(m.id))
}
