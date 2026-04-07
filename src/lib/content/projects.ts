import { sanityClient } from '@/sanity/client'
import {
  projectsQuery,
  projectBySlugQuery,
  projectsByCategoryQuery,
} from '@/sanity/queries'
import { projects as fallback } from '@/data/projects'
import type { Project, ProjectCategory } from '@/types'

async function fetchProjects(): Promise<Project[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return []
  try {
    return await sanityClient.fetch<Project[]>(projectsQuery, {}, { next: { revalidate: 60 } })
  } catch {
    return []
  }
}

export async function getProjects(): Promise<Project[]> {
  const data = await fetchProjects()
  return data.length ? data : fallback.sort((a, b) => a.order - b.order)
}

export async function getFeaturedProjects(): Promise<Project[]> {
  const all = await getProjects()
  return all.filter((p) => p.featured)
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    try {
      const data = await sanityClient.fetch<Project | null>(
        projectBySlugQuery,
        { slug },
        { next: { revalidate: 60 } }
      )
      if (data) return data
    } catch {}
  }
  return fallback.find((p) => p.slug === slug) ?? null
}

export async function getProjectsByCategory(category: ProjectCategory): Promise<Project[]> {
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    try {
      const data = await sanityClient.fetch<Project[]>(
        projectsByCategoryQuery,
        { category },
        { next: { revalidate: 60 } }
      )
      if (data.length) return data
    } catch {}
  }
  return fallback.filter((p) => p.category === category).sort((a, b) => a.order - b.order)
}

export async function getRelatedProjects(
  currentSlug: string,
  category: ProjectCategory,
  limit = 3
): Promise<Project[]> {
  const all = await getProjectsByCategory(category)
  return all.filter((p) => p.slug !== currentSlug).slice(0, limit)
}
