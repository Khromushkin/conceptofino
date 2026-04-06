// src/types/index.ts

export type Locale = 'es' | 'en' | 'ru'

export interface LocalizedString {
  es: string
  en: string
  ru: string
}

export interface LocalizedStringArray {
  es: string[]
  en: string[]
  ru: string[]
}

// ─── Project ────────────────────────────────────────────────────

export type ProjectCategory =
  | 'cocinas'
  | 'vestidores'
  | 'muebles'
  | 'integrales'

export interface Project {
  id: string
  slug: string
  category: ProjectCategory
  title: LocalizedString
  description: LocalizedString
  challenge: LocalizedString
  solution: LocalizedString
  location: string
  year: number
  mainImage: ProjectImage
  gallery: ProjectImage[]
  materialIds: string[]
  featured: boolean
  order: number
  seo: SeoFields
}

export interface ProjectImage {
  src: string
  alt: LocalizedString
  blurDataURL?: string
  width: number
  height: number
}

// ─── Material ───────────────────────────────────────────────────

export type MaterialCategory = 'maderas' | 'piedra' | 'metales' | 'textiles'

export interface Material {
  id: string
  slug: string
  category: MaterialCategory
  title: LocalizedString
  description: LocalizedString
  characteristics: LocalizedStringArray
  mainImage: ProjectImage
  textureImage: ProjectImage
  gallery: ProjectImage[]
  projectIds: string[]
}

// ─── Service ────────────────────────────────────────────────────

export type ServiceSlug = 'diseno' | 'fabricacion' | 'montaje'

export interface ServiceStep {
  title: LocalizedString
  description: LocalizedString
  icon: string
  imageUrl: string
}

export interface Service {
  id: string
  slug: ServiceSlug
  title: LocalizedString
  description: LocalizedString
  steps: ServiceStep[]
  mainImage: ProjectImage
}

// ─── Blog ───────────────────────────────────────────────────────

export interface BlogPost {
  id: string
  slug: string
  title: LocalizedString
  excerpt: LocalizedString
  body: LocalizedString
  mainImage: ProjectImage
  categories: string[]
  publishedAt: string
  authorId: string
  seo: SeoFields
}

// ─── Team ───────────────────────────────────────────────────────

export interface TeamMember {
  id: string
  name: string
  role: LocalizedString
  photoUrl: string
  bio: LocalizedString
  order: number
}

// ─── Review ─────────────────────────────────────────────────────

export interface Review {
  id: string
  clientName: string
  clientRole: LocalizedString
  text: LocalizedString
  rating: number
  projectId: string
}

// ─── Site Settings ──────────────────────────────────────────────

export interface SiteSettings {
  companyName: string
  phone: string
  email: string
  address: LocalizedString
  whatsappNumber: string
  instagram: string
  facebook: string
  googleMapsEmbedUrl: string
}

// ─── SEO ────────────────────────────────────────────────────────

export interface SeoFields {
  metaTitle: LocalizedString
  metaDescription: LocalizedString
}

// ─── Navigation ─────────────────────────────────────────────────

export interface NavItem {
  label: string
  href: string
  children?: NavItem[]
}

// ─── Forms ──────────────────────────────────────────────────────

export interface ContactFormData {
  nombre: string
  email: string
  telefono: string
  servicio: string
  mensaje: string
}

export interface LeadFormData {
  nombre: string
  telefono: string
  email: string
  projectSlug: string
}
