import { services } from '@/data/services'
import type { Service, ServiceSlug } from '@/types'

export async function getServices(): Promise<Service[]> {
  return services
}

export async function getServiceBySlug(slug: ServiceSlug): Promise<Service | null> {
  return services.find((s) => s.slug === slug) ?? null
}
