import { sanityClient } from '@/sanity/client'
import { servicesQuery, serviceBySlugQuery } from '@/sanity/queries'
import { services as fallback } from '@/data/services'
import type { Service, ServiceSlug } from '@/types'

async function fetchServices(): Promise<Service[]> {
  if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) return []
  try {
    return await sanityClient.fetch<Service[]>(servicesQuery, {}, { next: { revalidate: 60 } })
  } catch {
    return []
  }
}

export async function getServices(): Promise<Service[]> {
  const data = await fetchServices()
  return data.length ? data : fallback
}

export async function getServiceBySlug(slug: ServiceSlug): Promise<Service | null> {
  if (process.env.NEXT_PUBLIC_SANITY_PROJECT_ID) {
    try {
      const data = await sanityClient.fetch<Service | null>(
        serviceBySlugQuery,
        { slug },
        { next: { revalidate: 60 } }
      )
      if (data) return data
    } catch {}
  }
  return fallback.find((s) => s.slug === slug) ?? null
}
