import { siteSettings } from '@/data/site-settings'
import type { SiteSettings } from '@/types'

export async function getSiteSettings(): Promise<SiteSettings> {
  return siteSettings
}
