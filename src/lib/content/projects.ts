// src/lib/content/projects.ts
import { projects } from '@/data/projects'
import type { Project, ProjectCategory } from '@/types'

export async function getProjects(): Promise<Project[]> {
  return projects.sort((a, b) => a.order - b.order)
}

export async function getFeaturedProjects(): Promise<Project[]> {
  return projects
    .filter((p) => p.featured)
    .sort((a, b) => a.order - b.order)
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  return projects.find((p) => p.slug === slug) ?? null
}

export async function getProjectsByCategory(
  category: ProjectCategory
): Promise<Project[]> {
  return projects
    .filter((p) => p.category === category)
    .sort((a, b) => a.order - b.order)
}

export async function getRelatedProjects(
  currentSlug: string,
  category: ProjectCategory,
  limit = 3
): Promise<Project[]> {
  return projects
    .filter((p) => p.slug !== currentSlug && p.category === category)
    .slice(0, limit)
}
