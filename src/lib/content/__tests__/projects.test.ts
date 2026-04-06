// src/lib/content/__tests__/projects.test.ts
import { getProjects, getProjectBySlug, getProjectsByCategory, getFeaturedProjects, getRelatedProjects } from '../projects'

describe('content/projects', () => {
  it('getProjects returns all projects sorted by order', async () => {
    const result = await getProjects()
    expect(result.length).toBeGreaterThan(0)
    for (let i = 1; i < result.length; i++) {
      expect(result[i].order).toBeGreaterThanOrEqual(result[i - 1].order)
    }
  })

  it('getFeaturedProjects returns only featured', async () => {
    const result = await getFeaturedProjects()
    expect(result.every((p) => p.featured)).toBe(true)
  })

  it('getProjectBySlug returns correct project', async () => {
    const result = await getProjectBySlug('cocina-barrio-del-carmen')
    expect(result?.id).toBe('p1')
  })

  it('getProjectBySlug returns null for unknown slug', async () => {
    const result = await getProjectBySlug('no-existe')
    expect(result).toBeNull()
  })

  it('getProjectsByCategory filters correctly', async () => {
    const result = await getProjectsByCategory('cocinas')
    expect(result.every((p) => p.category === 'cocinas')).toBe(true)
  })

  it('getRelatedProjects excludes current project', async () => {
    const result = await getRelatedProjects('cocina-barrio-del-carmen', 'cocinas')
    expect(result.some((p) => p.slug === 'cocina-barrio-del-carmen')).toBe(false)
  })
})
