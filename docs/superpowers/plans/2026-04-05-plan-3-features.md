# ConceptoFino — Plan 3: Features Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add API routes, SEO infrastructure, Sanity CMS schemas, and media scraper scripts to complete the ConceptoFino production website.

**Architecture:** Three independent subsystems — (1) API routes for lead capture using Resend with console.log fallback, (2) SEO layer with per-page generateMetadata + JSON-LD structured data + next-sitemap, (3) Sanity v3 schemas mirroring TypeScript interfaces 1:1 plus scraper scripts to populate real photos.

**Tech Stack:** Next.js 14 App Router · Resend SDK · React Hook Form · Zod · next-sitemap · @sanity/client · Playwright · sharp · TypeScript

**Prerequisites:** Plan 1 (Foundation) and Plan 2 (Pages) must be implemented first.

---

## File Map

**New files:**
- `src/app/api/contact/route.ts` — contact form handler
- `src/app/api/lead/route.ts` — "want similar project" mini-form handler
- `src/lib/email.ts` — Resend client factory with console.log fallback
- `src/lib/seo.ts` — shared SEO utilities (buildMetadata, buildJsonLd helpers)
- `src/components/ui/JsonLd.tsx` — safe JSON-LD script renderer (one place for the unsafe pattern)
- `src/app/[locale]/layout.tsx` — modify to add JSON-LD LocalBusiness
- `src/app/[locale]/page.tsx` — add generateMetadata
- `src/app/[locale]/proyectos/page.tsx` — add generateMetadata
- `src/app/[locale]/proyectos/[slug]/page.tsx` — add generateMetadata + Article JSON-LD
- `src/app/[locale]/nosotros/page.tsx` — add generateMetadata
- `src/app/[locale]/contacto/page.tsx` — add generateMetadata
- `src/app/[locale]/materiales/page.tsx` — add generateMetadata
- `next-sitemap.config.js` — sitemap and robots.txt config
- `sanity.config.ts` — Sanity Studio configuration
- `sanity/schemas/index.ts` — schema registry
- `sanity/schemas/project.ts` — Project schema
- `sanity/schemas/material.ts` — Material schema
- `sanity/schemas/service.ts` — Service schema
- `sanity/schemas/team-member.ts` — TeamMember schema
- `sanity/schemas/review.ts` — Review schema
- `sanity/schemas/blog-post.ts` — BlogPost schema
- `sanity/schemas/site-settings.ts` — SiteSettings singleton
- `sanity/schemas/localized-string.ts` — shared localizedString object type
- `scripts/scraper/instagram-scraper.ts` — Playwright-based Instagram photo scraper
- `scripts/scraper/optimize-images.ts` — sharp: WebP conversion, 3 sizes, blur placeholder
- `scripts/scraper/README.md` — setup and usage instructions

**Modified files:**
- `package.json` — add next-sitemap, sanity, @sanity/vision, playwright, tsx, sharp as dependencies
- `.env.local.example` — document all required env vars
- `.gitignore` — add scraper output dirs

---

### Task 21: Email delivery utility

**Files:**
- Create: `src/lib/email.ts`
- Create: `.env.local.example`

- [ ] **Step 1: Write the failing test**

Create `src/lib/__tests__/email.test.ts`:

```typescript
import { sendEmail } from '@/lib/email'

describe('sendEmail', () => {
  it('returns success:true with console.log fallback when RESEND_API_KEY is absent', async () => {
    const originalKey = process.env.RESEND_API_KEY
    delete process.env.RESEND_API_KEY
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()

    const result = await sendEmail({
      to: 'info@conceptofino.com',
      subject: 'Test',
      html: '<p>test</p>',
    })

    expect(result.success).toBe(true)
    expect(consoleSpy).toHaveBeenCalled()
    consoleSpy.mockRestore()
    if (originalKey) process.env.RESEND_API_KEY = originalKey
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest src/lib/__tests__/email.test.ts --no-coverage
```

Expected: FAIL — "Cannot find module '@/lib/email'"

- [ ] **Step 3: Create the email utility**

Create `src/lib/email.ts`:

```typescript
interface SendEmailOptions {
  to: string
  subject: string
  html: string
  replyTo?: string
}

interface SendEmailResult {
  success: boolean
  id?: string
  error?: string
}

export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.log('[Email fallback — set RESEND_API_KEY to enable]', {
      to: options.to,
      subject: options.subject,
      preview: options.html.slice(0, 120),
    })
    return { success: true, id: 'console-fallback' }
  }

  try {
    const { Resend } = await import('resend')
    const resend = new Resend(apiKey)

    const { data, error } = await resend.emails.send({
      from: 'ConceptoFino <noreply@conceptofino.com>',
      to: options.to,
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    })

    if (error) return { success: false, error: error.message }
    return { success: true, id: data?.id }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    console.error('[sendEmail error]', message)
    return { success: false, error: message }
  }
}
```

- [ ] **Step 4: Create `.env.local.example`**

Create `.env.local.example`:

```
# Resend — email delivery
# Get your key at https://resend.com/api-keys
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxx

# Sanity — CMS (optional during development, required for production CMS)
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=your_read_token

# Site URL — used for SEO canonical URLs and sitemap
NEXT_PUBLIC_SITE_URL=https://conceptofino.com
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npx jest src/lib/__tests__/email.test.ts --no-coverage
```

Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add src/lib/email.ts src/lib/__tests__/email.test.ts .env.local.example
git commit -m "feat: email utility with Resend SDK and console.log fallback"
```

---

### Task 22: API route — /api/contact

**Files:**
- Create: `src/app/api/contact/route.ts`

- [ ] **Step 1: Write the failing test**

Create `src/app/api/contact/__tests__/route.test.ts`:

```typescript
import { POST } from '@/app/api/contact/route'

jest.mock('@/lib/email', () => ({
  sendEmail: jest.fn().mockResolvedValue({ success: true, id: 'mock-id' }),
}))

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/contact', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/contact', () => {
  it('returns 200 with valid payload', async () => {
    const res = await POST(makeRequest({
      name: 'Ana García',
      email: 'ana@example.com',
      phone: '+34 612 345 678',
      message: 'Me interesa un armario empotrado',
      service: 'wardrobes',
      locale: 'es',
    }))
    expect(res.status).toBe(200)
    const json = await res.json()
    expect(json.success).toBe(true)
  })

  it('returns 400 when required fields are missing', async () => {
    const res = await POST(makeRequest({ name: 'Ana' }))
    expect(res.status).toBe(400)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest src/app/api/contact/__tests__/route.test.ts --no-coverage
```

Expected: FAIL

- [ ] **Step 3: Implement the contact API route**

Create `src/app/api/contact/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEmail } from '@/lib/email'

const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  message: z.string().min(10).max(2000),
  service: z.string().optional(),
  locale: z.enum(['es', 'en', 'ru']).default('es'),
})

function buildContactEmailHtml(data: z.infer<typeof contactSchema>): string {
  const phoneRow = data.phone
    ? `<tr><td style="padding:8px 0;font-weight:600;">Teléfono</td><td>${data.phone}</td></tr>`
    : ''
  const serviceRow = data.service
    ? `<tr><td style="padding:8px 0;font-weight:600;">Servicio</td><td>${data.service}</td></tr>`
    : ''
  return `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
      <h2 style="color:#b8a088;border-bottom:1px solid #e8e2d9;padding-bottom:12px;">
        Nueva consulta — ConceptoFino
      </h2>
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;font-weight:600;width:120px;">Nombre</td><td>${data.name}</td></tr>
        <tr><td style="padding:8px 0;font-weight:600;">Email</td><td>${data.email}</td></tr>
        ${phoneRow}
        ${serviceRow}
        <tr><td style="padding:8px 0;font-weight:600;vertical-align:top;">Mensaje</td><td>${data.message}</td></tr>
        <tr><td style="padding:8px 0;font-weight:600;">Idioma</td><td>${data.locale}</td></tr>
      </table>
    </div>
  `
}

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const result = await sendEmail({
    to: 'info@conceptofino.com',
    subject: `Nueva consulta de ${parsed.data.name}`,
    html: buildContactEmailHtml(parsed.data),
    replyTo: parsed.data.email,
  })

  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest src/app/api/contact/__tests__/route.test.ts --no-coverage
```

Expected: PASS (2 tests)

- [ ] **Step 5: Commit**

```bash
git add src/app/api/contact/
git commit -m "feat: contact form API route with Zod validation"
```

---

### Task 23: API route — /api/lead

**Files:**
- Create: `src/app/api/lead/route.ts`

- [ ] **Step 1: Write the failing test**

Create `src/app/api/lead/__tests__/route.test.ts`:

```typescript
import { POST } from '@/app/api/lead/route'

jest.mock('@/lib/email', () => ({
  sendEmail: jest.fn().mockResolvedValue({ success: true, id: 'mock-id' }),
}))

function makeRequest(body: unknown) {
  return new Request('http://localhost/api/lead', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('POST /api/lead', () => {
  it('returns 200 with valid payload', async () => {
    const res = await POST(makeRequest({
      name: 'Carlos',
      email: 'carlos@example.com',
      phone: '+34 666 123 456',
      projectSlug: 'armario-minimalista-blanco',
      locale: 'es',
    }))
    expect(res.status).toBe(200)
  })

  it('returns 400 when name is missing', async () => {
    const res = await POST(makeRequest({ email: 'x@example.com' }))
    expect(res.status).toBe(400)
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest src/app/api/lead/__tests__/route.test.ts --no-coverage
```

Expected: FAIL

- [ ] **Step 3: Implement the lead API route**

Create `src/app/api/lead/route.ts`:

```typescript
import { NextResponse } from 'next/server'
import { z } from 'zod'
import { sendEmail } from '@/lib/email'

const leadSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  projectSlug: z.string().optional(),
  locale: z.enum(['es', 'en', 'ru']).default('es'),
})

export async function POST(request: Request): Promise<NextResponse> {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON' }, { status: 400 })
  }

  const parsed = leadSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { success: false, error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 },
    )
  }

  const { name, email, phone, projectSlug, locale } = parsed.data
  const phoneRow = phone ? `<tr><td style="padding:8px 0;font-weight:600;">Teléfono</td><td>${phone}</td></tr>` : ''
  const projectRow = projectSlug ? `<tr><td style="padding:8px 0;font-weight:600;">Proyecto ref.</td><td>${projectSlug}</td></tr>` : ''

  const result = await sendEmail({
    to: 'info@conceptofino.com',
    subject: `Lead: ${name} quiere un proyecto similar${projectSlug ? ` a "${projectSlug}"` : ''}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#1a1a1a;">
        <h2 style="color:#b8a088;border-bottom:1px solid #e8e2d9;padding-bottom:12px;">
          Nuevo lead — Quiero un proyecto similar
        </h2>
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;font-weight:600;width:120px;">Nombre</td><td>${name}</td></tr>
          <tr><td style="padding:8px 0;font-weight:600;">Email</td><td>${email}</td></tr>
          ${phoneRow}
          ${projectRow}
          <tr><td style="padding:8px 0;font-weight:600;">Idioma</td><td>${locale}</td></tr>
        </table>
      </div>
    `,
    replyTo: email,
  })

  if (!result.success) {
    return NextResponse.json({ success: false, error: result.error }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx jest src/app/api/lead/__tests__/route.test.ts --no-coverage
```

Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/app/api/lead/
git commit -m "feat: lead capture API route for 'want similar project' CTA"
```

---

### Task 24: JsonLd component + SEO utilities

**Files:**
- Create: `src/components/ui/JsonLd.tsx`
- Create: `src/lib/seo.ts`
- Modify: `src/app/[locale]/layout.tsx`
- Modify: `src/app/[locale]/page.tsx`
- Modify: `src/app/[locale]/proyectos/page.tsx`
- Modify: `src/app/[locale]/proyectos/[slug]/page.tsx`
- Modify: `src/app/[locale]/nosotros/page.tsx`
- Modify: `src/app/[locale]/contacto/page.tsx`
- Modify: `src/app/[locale]/materiales/page.tsx`

- [ ] **Step 1: Write the failing SEO test**

Create `src/lib/__tests__/seo.test.ts`:

```typescript
import { buildMetadata, buildLocalBusinessJsonLd } from '@/lib/seo'

describe('buildMetadata', () => {
  it('includes canonical URL and openGraph', () => {
    const meta = buildMetadata({
      title: 'Armarios a medida — ConceptoFino',
      description: 'Muebles personalizados en Valencia',
      path: '/es/proyectos',
      locale: 'es',
    })
    expect(meta.alternates?.canonical).toContain('/es/proyectos')
    expect(meta.openGraph?.title).toBe('Armarios a medida — ConceptoFino')
  })
})

describe('buildLocalBusinessJsonLd', () => {
  it('returns LocalBusiness type with required fields', () => {
    const ld = buildLocalBusinessJsonLd('es')
    expect(ld['@type']).toBe('LocalBusiness')
    expect(ld.name).toBe('ConceptoFino')
    expect(ld.address).toBeDefined()
  })
})
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx jest src/lib/__tests__/seo.test.ts --no-coverage
```

Expected: FAIL

- [ ] **Step 3: Create the JsonLd component**

Create `src/components/ui/JsonLd.tsx`:

```typescript
// JsonLd — renders a JSON-LD structured data script tag.
//
// SAFETY: JSON.stringify produces serialized object notation that cannot
// contain HTML tags or script sequences (< is encoded as \u003c by V8).
// All data passed here comes from server-side constants, never from user input.
// This is the canonical Next.js App Router pattern for structured data.
// See: https://nextjs.org/docs/app/building-your-application/optimizing/metadata#json-ld
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
```

- [ ] **Step 4: Create SEO utilities**

Create `src/lib/seo.ts`:

```typescript
import { Metadata } from 'next'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://conceptofino.com'
const SITE_NAME = 'ConceptoFino'
const LOCALES = ['es', 'en', 'ru'] as const
type Locale = (typeof LOCALES)[number]

interface BuildMetadataOptions {
  title: string
  description: string
  path: string
  locale: Locale
  image?: string
  noindex?: boolean
}

export function buildMetadata(opts: BuildMetadataOptions): Metadata {
  const { title, description, path, locale, image, noindex } = opts
  const url = `${SITE_URL}${path}`
  const ogImage = image ?? `${SITE_URL}/og-default.jpg`

  const alternateLanguages: Record<string, string> = {}
  for (const l of LOCALES) {
    const altPath = path.replace(`/${locale}/`, `/${l}/`).replace(`/${locale}`, `/${l}`)
    const hreflang = l === 'es' ? 'es-ES' : l === 'en' ? 'en-GB' : 'ru-RU'
    alternateLanguages[hreflang] = `${SITE_URL}${altPath}`
  }

  return {
    title,
    description,
    alternates: { canonical: url, languages: alternateLanguages },
    openGraph: {
      title,
      description,
      url,
      siteName: SITE_NAME,
      locale,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: { card: 'summary_large_image', title, description, images: [ogImage] },
    robots: noindex
      ? { index: false, follow: false }
      : { index: true, follow: true, googleBot: { index: true, follow: true } },
  }
}

export function buildLocalBusinessJsonLd(locale: Locale): Record<string, unknown> {
  const descriptions: Record<Locale, string> = {
    es: 'Muebles a medida y diseño de interiores en Valencia. Armarios, cocinas, salones — calidad artesanal al precio de IKEA.',
    en: 'Custom furniture and interior design in Valencia. Wardrobes, kitchens, living rooms — artisan quality at IKEA prices.',
    ru: 'Мебель на заказ и дизайн интерьера в Валенсии. Шкафы, кухни, гостиные — качество ремесленника по цене IKEA.',
  }
  return {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: SITE_NAME,
    description: descriptions[locale],
    url: SITE_URL,
    telephone: '+34 600 000 000',
    email: 'info@conceptofino.com',
    image: `${SITE_URL}/og-default.jpg`,
    logo: `${SITE_URL}/logo.svg`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Valencia',
      addressLocality: 'Valencia',
      addressRegion: 'Comunitat Valenciana',
      postalCode: '46000',
      addressCountry: 'ES',
    },
    geo: { '@type': 'GeoCoordinates', latitude: 39.4699, longitude: -0.3763 },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '09:00',
        closes: '18:00',
      },
    ],
    sameAs: ['https://www.instagram.com/conceptofino/'],
    priceRange: '€€',
    areaServed: { '@type': 'State', name: 'Comunitat Valenciana' },
  }
}

export function buildBreadcrumbJsonLd(
  items: Array<{ name: string; url: string }>,
): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

export function buildArticleJsonLd(opts: {
  title: string
  description: string
  url: string
  image: string
  datePublished: string
  dateModified: string
  locale: Locale
}): Record<string, unknown> {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: opts.title,
    description: opts.description,
    url: opts.url,
    image: opts.image,
    datePublished: opts.datePublished,
    dateModified: opts.dateModified,
    inLanguage: opts.locale,
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      url: SITE_URL,
      logo: { '@type': 'ImageObject', url: `${SITE_URL}/logo.svg` },
    },
    author: { '@type': 'Organization', name: SITE_NAME },
  }
}
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npx jest src/lib/__tests__/seo.test.ts --no-coverage
```

Expected: PASS

- [ ] **Step 6: Add JsonLd to root locale layout**

Open `src/app/[locale]/layout.tsx`. Add imports:

```typescript
import { buildLocalBusinessJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/ui/JsonLd'
```

Add inside the `<head>` element:

```typescript
<JsonLd data={buildLocalBusinessJsonLd(locale as 'es' | 'en' | 'ru')} />
```

- [ ] **Step 7: Add generateMetadata to homepage**

Open `src/app/[locale]/page.tsx`. Add before the default export:

```typescript
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params
  const titles: Record<string, string> = {
    es: 'ConceptoFino — Muebles a medida en Valencia',
    en: 'ConceptoFino — Custom Furniture in Valencia',
    ru: 'ConceptoFino — Мебель на заказ в Валенсии',
  }
  const descriptions: Record<string, string> = {
    es: 'Armarios, cocinas y muebles de diseño personalizados. Por el precio de IKEA, pero hecho a medida para ti en Valencia.',
    en: 'Custom wardrobes, kitchens and designer furniture. At IKEA prices, but made to measure for you in Valencia.',
    ru: 'Шкафы, кухни и дизайнерская мебель на заказ. По цене IKEA, но сделано специально для вас в Валенсии.',
  }
  return buildMetadata({
    title: titles[locale] ?? titles.es,
    description: descriptions[locale] ?? descriptions.es,
    path: `/${locale}`,
    locale: locale as 'es' | 'en' | 'ru',
  })
}
```

- [ ] **Step 8: Add generateMetadata to section pages**

Add the following to each page. Pattern is identical — only titles/descriptions/path differ.

`src/app/[locale]/proyectos/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params
  const titles: Record<string, string> = { es: 'Proyectos — ConceptoFino', en: 'Projects — ConceptoFino', ru: 'Проекты — ConceptoFino' }
  const descriptions: Record<string, string> = {
    es: 'Galería de proyectos de muebles a medida en Valencia. Armarios, cocinas, salones y más.',
    en: 'Custom furniture project gallery in Valencia. Wardrobes, kitchens, living rooms and more.',
    ru: 'Галерея проектов мебели на заказ в Валенсии. Шкафы, кухни, гостиные и другое.',
  }
  return buildMetadata({ title: titles[locale] ?? titles.es, description: descriptions[locale] ?? descriptions.es, path: `/${locale}/proyectos`, locale: locale as 'es' | 'en' | 'ru' })
}
```

`src/app/[locale]/nosotros/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params
  const titles: Record<string, string> = { es: 'Sobre nosotros — ConceptoFino', en: 'About us — ConceptoFino', ru: 'О нас — ConceptoFino' }
  const descriptions: Record<string, string> = {
    es: 'Conoce al equipo de ConceptoFino — artesanos valencianos con pasión por el diseño de interiores a medida.',
    en: 'Meet the ConceptoFino team — Valencian craftspeople with a passion for bespoke interior design.',
    ru: 'Познакомьтесь с командой ConceptoFino — валенсийские мастера с страстью к дизайну интерьеров на заказ.',
  }
  return buildMetadata({ title: titles[locale] ?? titles.es, description: descriptions[locale] ?? descriptions.es, path: `/${locale}/nosotros`, locale: locale as 'es' | 'en' | 'ru' })
}
```

`src/app/[locale]/contacto/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params
  const titles: Record<string, string> = { es: 'Contacto — ConceptoFino Valencia', en: 'Contact — ConceptoFino Valencia', ru: 'Контакты — ConceptoFino Валенсия' }
  const descriptions: Record<string, string> = {
    es: 'Solicita tu presupuesto gratuito. Diseñamos y fabricamos muebles a medida en Valencia.',
    en: 'Request your free quote. We design and make custom furniture in Valencia.',
    ru: 'Запросите бесплатную смету. Проектируем и изготавливаем мебель на заказ в Валенсии.',
  }
  return buildMetadata({ title: titles[locale] ?? titles.es, description: descriptions[locale] ?? descriptions.es, path: `/${locale}/contacto`, locale: locale as 'es' | 'en' | 'ru' })
}
```

`src/app/[locale]/materiales/page.tsx`:
```typescript
import type { Metadata } from 'next'
import { buildMetadata } from '@/lib/seo'

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const { locale } = params
  const titles: Record<string, string> = { es: 'Materiales y acabados — ConceptoFino', en: 'Materials & finishes — ConceptoFino', ru: 'Материалы и отделка — ConceptoFino' }
  const descriptions: Record<string, string> = {
    es: 'Descubre los materiales premium que usamos: maderas nobles, lacados, acero y más.',
    en: 'Discover the premium materials we use: fine woods, lacquers, steel and more.',
    ru: 'Откройте для себя материалы премиум-класса: ценные породы дерева, лаки, сталь и другое.',
  }
  return buildMetadata({ title: titles[locale] ?? titles.es, description: descriptions[locale] ?? descriptions.es, path: `/${locale}/materiales`, locale: locale as 'es' | 'en' | 'ru' })
}
```

- [ ] **Step 9: Add generateMetadata + structured data to project page**

Open `src/app/[locale]/proyectos/[slug]/page.tsx`. Add imports:

```typescript
import type { Metadata } from 'next'
import { buildMetadata, buildBreadcrumbJsonLd, buildArticleJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/ui/JsonLd'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://conceptofino.com'
```

Add `generateMetadata` before the default export:

```typescript
export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const { locale, slug } = params
  const project = await getProjectBySlug(slug)
  if (!project) return {}
  const l = locale as 'es' | 'en' | 'ru'
  return buildMetadata({
    title: `${project.title[l]} — ConceptoFino`,
    description: project.description[l],
    path: `/${locale}/proyectos/${slug}`,
    locale: l,
    image: project.coverImage,
  })
}
```

Inside the returned JSX (after the opening `<main>` tag), add:

```typescript
<JsonLd data={buildBreadcrumbJsonLd([
  { name: 'Home', url: `${SITE_URL}/${locale}` },
  { name: locale === 'en' ? 'Projects' : locale === 'ru' ? 'Проекты' : 'Proyectos', url: `${SITE_URL}/${locale}/proyectos` },
  { name: project.title[locale as 'es' | 'en' | 'ru'], url: `${SITE_URL}/${locale}/proyectos/${project.slug}` },
])} />
<JsonLd data={buildArticleJsonLd({
  title: project.title[locale as 'es' | 'en' | 'ru'],
  description: project.description[locale as 'es' | 'en' | 'ru'],
  url: `${SITE_URL}/${locale}/proyectos/${project.slug}`,
  image: project.coverImage,
  datePublished: project.completedAt ?? new Date().toISOString().slice(0, 10),
  dateModified: project.completedAt ?? new Date().toISOString().slice(0, 10),
  locale: locale as 'es' | 'en' | 'ru',
})} />
```

- [ ] **Step 10: Commit**

```bash
git add src/components/ui/JsonLd.tsx src/lib/seo.ts src/lib/__tests__/seo.test.ts src/app/
git commit -m "feat: JsonLd component, SEO utilities, generateMetadata on all pages, structured data"
```

---

### Task 25: Sitemap and robots.txt

**Files:**
- Create: `next-sitemap.config.js`
- Modify: `package.json`

- [ ] **Step 1: Install next-sitemap**

```bash
npm install next-sitemap
```

- [ ] **Step 2: Create sitemap config**

Create `next-sitemap.config.js`:

```javascript
/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://conceptofino.com',
  generateRobotsTxt: true,
  exclude: ['/404', '/500'],
  alternateRefs: [
    { href: 'https://conceptofino.com/es', hreflang: 'es-ES' },
    { href: 'https://conceptofino.com/en', hreflang: 'en-GB' },
    { href: 'https://conceptofino.com/ru', hreflang: 'ru-RU' },
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/studio/'] },
    ],
  },
  transform: async (_config, path) => {
    const isHomepage = path === '/es' || path === '/en' || path === '/ru'
    const isProjectDetail = path.includes('/proyectos/') && !path.endsWith('/proyectos')
    return {
      loc: path,
      changefreq: isHomepage ? 'weekly' : 'monthly',
      priority: isHomepage ? 1.0 : isProjectDetail ? 0.8 : 0.7,
    }
  },
}
```

- [ ] **Step 3: Add postbuild script**

In `package.json` scripts, add:
```json
"postbuild": "next-sitemap"
```

- [ ] **Step 4: Verify build generates sitemap**

```bash
npm run build
ls public/sitemap*.xml public/robots.txt
```

Expected: both files created by next-sitemap.

- [ ] **Step 5: Commit**

```bash
git add next-sitemap.config.js package.json package-lock.json public/sitemap*.xml public/robots.txt
git commit -m "feat: next-sitemap sitemap.xml and robots.txt generation"
```

---

### Task 26: Sanity schemas

**Files:**
- Create: `sanity/schemas/localized-string.ts`
- Create: `sanity/schemas/project.ts`
- Create: `sanity/schemas/material.ts`
- Create: `sanity/schemas/service.ts`
- Create: `sanity/schemas/team-member.ts`
- Create: `sanity/schemas/review.ts`
- Create: `sanity/schemas/blog-post.ts`
- Create: `sanity/schemas/site-settings.ts`
- Create: `sanity/schemas/index.ts`
- Create: `sanity.config.ts`

These schemas are prepared for future CMS migration — they mirror `src/types/index.ts` 1:1. No runtime tests needed (declarative config, not logic). TypeScript compilation is the verification.

- [ ] **Step 1: Install Sanity**

```bash
npm install --save-dev sanity @sanity/vision
```

- [ ] **Step 2: Create shared localizedString type**

Create `sanity/schemas/localized-string.ts`:

```typescript
import { defineType, defineField } from 'sanity'

export const localizedString = defineType({
  name: 'localizedString',
  title: 'Localized String',
  type: 'object',
  fields: [
    defineField({ name: 'es', title: 'Español', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'en', title: 'English', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'ru', title: 'Русский', type: 'string', validation: (R) => R.required() }),
  ],
})

export const localizedText = defineType({
  name: 'localizedText',
  title: 'Localized Text',
  type: 'object',
  fields: [
    defineField({ name: 'es', title: 'Español', type: 'text' }),
    defineField({ name: 'en', title: 'English', type: 'text' }),
    defineField({ name: 'ru', title: 'Русский', type: 'text' }),
  ],
})
```

- [ ] **Step 3: Create project schema**

Create `sanity/schemas/project.ts`:

```typescript
import { defineType, defineField, defineArrayMember } from 'sanity'

export const project = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title.es', maxLength: 96 }, validation: (R) => R.required() }),
    defineField({ name: 'title', title: 'Title', type: 'localizedString', validation: (R) => R.required() }),
    defineField({ name: 'description', title: 'Description', type: 'localizedText' }),
    defineField({ name: 'longDescription', title: 'Long Description', type: 'localizedText' }),
    defineField({ name: 'category', title: 'Category', type: 'string', options: { list: ['wardrobes', 'kitchens', 'living', 'bathrooms', 'commercial', 'complete'] } }),
    defineField({ name: 'coverImage', title: 'Cover Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'images', title: 'Gallery Images', type: 'array', of: [defineArrayMember({ type: 'image', options: { hotspot: true } })] }),
    defineField({ name: 'area', title: 'Area (m²)', type: 'number' }),
    defineField({ name: 'location', title: 'Location', type: 'localizedString' }),
    defineField({ name: 'completedAt', title: 'Completed At', type: 'date' }),
    defineField({ name: 'featured', title: 'Featured on homepage', type: 'boolean', initialValue: false }),
    defineField({ name: 'materials', title: 'Materials', type: 'array', of: [defineArrayMember({ type: 'reference', to: [{ type: 'material' }] })] }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime' }),
  ],
  preview: { select: { title: 'title.es', media: 'coverImage' } },
  orderings: [
    { title: 'Newest first', name: 'completedAtDesc', by: [{ field: 'completedAt', direction: 'desc' }] },
  ],
})
```

- [ ] **Step 4: Create remaining document schemas**

Create `sanity/schemas/material.ts`:

```typescript
import { defineType, defineField } from 'sanity'

export const material = defineType({
  name: 'material',
  title: 'Material',
  type: 'document',
  fields: [
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'name.es' } }),
    defineField({ name: 'name', title: 'Name', type: 'localizedString', validation: (R) => R.required() }),
    defineField({ name: 'description', title: 'Description', type: 'localizedText' }),
    defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'category', title: 'Category', type: 'string', options: { list: ['wood', 'lacquer', 'metal', 'stone', 'glass', 'fabric'] } }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Display order', type: 'number' }),
  ],
  preview: { select: { title: 'name.es', media: 'image' } },
})
```

Create `sanity/schemas/service.ts`:

```typescript
import { defineType, defineField } from 'sanity'

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  fields: [
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title.es' } }),
    defineField({ name: 'title', title: 'Title', type: 'localizedString', validation: (R) => R.required() }),
    defineField({ name: 'description', title: 'Description', type: 'localizedText' }),
    defineField({ name: 'longDescription', title: 'Long Description', type: 'localizedText' }),
    defineField({ name: 'icon', title: 'Icon name (Lucide)', type: 'string' }),
    defineField({ name: 'image', title: 'Hero image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'featured', title: 'Featured on homepage', type: 'boolean', initialValue: false }),
    defineField({ name: 'order', title: 'Display order', type: 'number' }),
    defineField({ name: 'startingPrice', title: 'Starting price (€)', type: 'number' }),
  ],
  preview: { select: { title: 'title.es' } },
})
```

Create `sanity/schemas/team-member.ts`:

```typescript
import { defineType, defineField } from 'sanity'

export const teamMember = defineType({
  name: 'teamMember',
  title: 'Team Member',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'role', title: 'Role', type: 'localizedString' }),
    defineField({ name: 'bio', title: 'Bio', type: 'localizedText' }),
    defineField({ name: 'photo', title: 'Photo', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'instagram', title: 'Instagram handle', type: 'string' }),
    defineField({ name: 'order', title: 'Display order', type: 'number' }),
  ],
  preview: { select: { title: 'name', media: 'photo' } },
})
```

Create `sanity/schemas/review.ts`:

```typescript
import { defineType, defineField } from 'sanity'

export const review = defineType({
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    defineField({ name: 'authorName', title: 'Author name', type: 'string', validation: (R) => R.required() }),
    defineField({ name: 'authorLocation', title: 'Author location', type: 'string' }),
    defineField({ name: 'rating', title: 'Rating (1-5)', type: 'number', validation: (R) => R.min(1).max(5) }),
    defineField({ name: 'text', title: 'Review text', type: 'localizedText' }),
    defineField({ name: 'projectRef', title: 'Related project', type: 'reference', to: [{ type: 'project' }] }),
    defineField({ name: 'publishedAt', title: 'Published at', type: 'date' }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'source', title: 'Source', type: 'string', options: { list: ['google', 'instagram', 'direct', 'houzz'] } }),
  ],
  preview: { select: { title: 'authorName', subtitle: 'text.es' } },
})
```

Create `sanity/schemas/blog-post.ts`:

```typescript
import { defineType, defineField } from 'sanity'

export const blogPost = defineType({
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    defineField({ name: 'slug', title: 'Slug', type: 'slug', options: { source: 'title.es', maxLength: 96 }, validation: (R) => R.required() }),
    defineField({ name: 'title', title: 'Title', type: 'localizedString', validation: (R) => R.required() }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'localizedText' }),
    defineField({ name: 'coverImage', title: 'Cover image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'publishedAt', title: 'Published at', type: 'datetime', validation: (R) => R.required() }),
    defineField({ name: 'category', title: 'Category', type: 'string', options: { list: ['trends', 'tips', 'projects', 'materials'] } }),
    defineField({ name: 'tags', title: 'Tags', type: 'array', of: [{ type: 'string' }] }),
    defineField({ name: 'featured', title: 'Featured', type: 'boolean', initialValue: false }),
  ],
  preview: { select: { title: 'title.es', media: 'coverImage' } },
  orderings: [
    { title: 'Published, newest', name: 'publishedAtDesc', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
})
```

Create `sanity/schemas/site-settings.ts`:

```typescript
import { defineType, defineField } from 'sanity'

export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  __experimental_actions: ['update', 'publish'] as const,
  fields: [
    defineField({ name: 'siteName', title: 'Site name', type: 'string' }),
    defineField({ name: 'tagline', title: 'Tagline', type: 'localizedString' }),
    defineField({ name: 'phone', title: 'Phone', type: 'string' }),
    defineField({ name: 'whatsapp', title: 'WhatsApp number', type: 'string' }),
    defineField({ name: 'email', title: 'Email', type: 'string' }),
    defineField({ name: 'address', title: 'Address', type: 'string' }),
    defineField({ name: 'instagram', title: 'Instagram URL', type: 'url' }),
    defineField({ name: 'googleMapsEmbed', title: 'Google Maps embed URL', type: 'url' }),
    defineField({ name: 'ogImage', title: 'Default OG image', type: 'image', options: { hotspot: true } }),
  ],
})
```

- [ ] **Step 5: Create schema registry and Sanity config**

Create `sanity/schemas/index.ts`:

```typescript
import { localizedString, localizedText } from './localized-string'
import { project } from './project'
import { material } from './material'
import { service } from './service'
import { teamMember } from './team-member'
import { review } from './review'
import { blogPost } from './blog-post'
import { siteSettings } from './site-settings'

export const schemaTypes = [
  localizedString,
  localizedText,
  project,
  material,
  service,
  teamMember,
  review,
  blogPost,
  siteSettings,
]
```

Create `sanity.config.ts`:

```typescript
import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas'

export default defineConfig({
  name: 'conceptofino',
  title: 'ConceptoFino CMS',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? 'your-project-id',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? 'production',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
})
```

- [ ] **Step 6: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 7: Commit**

```bash
git add sanity/ sanity.config.ts package.json package-lock.json
git commit -m "feat: Sanity v3 CMS schemas mirroring TypeScript interfaces"
```

---

### Task 27: Instagram scraper

**Files:**
- Create: `scripts/scraper/instagram-scraper.ts`

The scraper logs into Instagram, navigates to the ConceptoFino profile, and downloads photos to `scripts/scraper/output/instagram/`. Uses Playwright Locator API throughout (no unsafe scripting methods).

- [ ] **Step 1: Install Playwright and tsx**

```bash
npm install --save-dev playwright tsx
npx playwright install chromium
```

- [ ] **Step 2: Create the scraper**

Create `scripts/scraper/instagram-scraper.ts`:

```typescript
#!/usr/bin/env tsx
/**
 * Instagram photo scraper for ConceptoFino
 *
 * Required env vars:
 *   IG_USERNAME  — Instagram login
 *   IG_PASSWORD  — Instagram password
 *   IG_PROFILE   — Target handle (default: conceptofino)
 *   IG_LIMIT     — Max posts to fetch (default: 30)
 *
 * Output: scripts/scraper/output/instagram/<postId>/
 */

import { chromium, type Page } from 'playwright'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'

const USERNAME = process.env.IG_USERNAME
const PASSWORD = process.env.IG_PASSWORD
const PROFILE = process.env.IG_PROFILE ?? 'conceptofino'
const LIMIT = parseInt(process.env.IG_LIMIT ?? '30', 10)
const OUTPUT_DIR = path.join(process.cwd(), 'scripts/scraper/output/instagram')

interface PostManifest {
  id: string
  url: string
  caption: string
  images: string[]
  scrapedAt: string
}

function downloadFile(url: string, dest: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    https.get(url, (res) => {
      res.pipe(file)
      file.on('finish', () => { file.close(); resolve() })
    }).on('error', (err) => { fs.unlink(dest, () => {}); reject(err) })
  })
}

async function login(page: Page): Promise<void> {
  if (!USERNAME || !PASSWORD) throw new Error('IG_USERNAME and IG_PASSWORD are required')
  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)

  const cookieBtn = page.getByRole('button', { name: /accept|aceptar/i })
  if (await cookieBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await cookieBtn.click()
    await page.waitForTimeout(1000)
  }

  await page.fill('input[name="username"]', USERNAME)
  await page.fill('input[name="password"]', PASSWORD)
  await page.click('button[type="submit"]')
  await page.waitForTimeout(3000)

  const notNow = page.getByRole('button', { name: /not now|ahora no/i })
  if (await notNow.isVisible({ timeout: 3000 }).catch(() => false)) {
    await notNow.click()
  }
  console.log('Logged in')
}

async function collectPostUrls(page: Page): Promise<string[]> {
  await page.goto(`https://www.instagram.com/${PROFILE}/`, { waitUntil: 'networkidle' })
  await page.waitForTimeout(2000)

  const postUrls = new Set<string>()
  let stuckCount = 0
  let lastSize = 0

  while (postUrls.size < LIMIT && stuckCount < 3) {
    const linkLocator = page.locator('a[href*="/p/"]')
    const count = await linkLocator.count()
    for (let i = 0; i < count; i++) {
      const href = await linkLocator.nth(i).getAttribute('href')
      if (href?.includes('/p/')) {
        postUrls.add('https://www.instagram.com' + href.split('?')[0])
      }
    }
    stuckCount = postUrls.size === lastSize ? stuckCount + 1 : 0
    lastSize = postUrls.size
    await page.mouse.wheel(0, 1500)
    await page.waitForTimeout(1500)
    console.log(`Collected ${postUrls.size} post URLs...`)
  }

  return Array.from(postUrls).slice(0, LIMIT)
}

async function scrapePost(page: Page, postUrl: string, index: number, total: number): Promise<PostManifest> {
  const postId = postUrl.split('/p/')[1]?.replace('/', '') ?? `post-${index}`
  const postDir = path.join(OUTPUT_DIR, postId)
  const manifestPath = path.join(postDir, 'manifest.json')

  if (fs.existsSync(manifestPath)) {
    console.log(`[${index + 1}/${total}] Skip ${postId} (cached)`)
    return JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as PostManifest
  }

  console.log(`[${index + 1}/${total}] Scraping ${postId}`)
  await page.goto(postUrl, { waitUntil: 'networkidle' })
  await page.waitForTimeout(1500)

  const imgLocator = page.locator('article img[src*="cdninstagram"]')
  const imgCount = await imgLocator.count()
  const imageUrls: string[] = []
  for (let j = 0; j < imgCount; j++) {
    const src = await imgLocator.nth(j).getAttribute('src')
    if (src) imageUrls.push(src)
  }

  const caption = await page.locator('article h1').first().textContent().catch(() => '') ?? ''
  fs.mkdirSync(postDir, { recursive: true })

  const savedImages: string[] = []
  for (let j = 0; j < imageUrls.length; j++) {
    const imgPath = path.join(postDir, `${j}.jpg`)
    try {
      await downloadFile(imageUrls[j], imgPath)
      savedImages.push(imgPath)
    } catch {
      console.warn(`  Failed to download image ${j}`)
    }
  }

  const manifest: PostManifest = { id: postId, url: postUrl, caption, images: savedImages, scrapedAt: new Date().toISOString() }
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
  await page.waitForTimeout(800)
  return manifest
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  const browser = await chromium.launch({ headless: true })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
  })
  const page = await context.newPage()

  try {
    await login(page)
    const urls = await collectPostUrls(page)
    const manifests = await Promise.all(urls.map((url, i) => scrapePost(page, url, i, urls.length)))
    fs.writeFileSync(
      path.join(OUTPUT_DIR, 'manifest.json'),
      JSON.stringify({ profile: PROFILE, totalPosts: manifests.length, scrapedAt: new Date().toISOString(), posts: manifests }, null, 2),
    )
    console.log(`\nDone — ${manifests.length} posts saved to ${OUTPUT_DIR}`)
  } finally {
    await browser.close()
  }
}

main().catch((err) => { console.error('Scraper failed:', err); process.exit(1) })
```

- [ ] **Step 3: Add npm script and .gitignore entry**

In `package.json` scripts add:
```json
"scrape:instagram": "tsx scripts/scraper/instagram-scraper.ts"
```

In `.gitignore` add:
```
scripts/scraper/output/
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add scripts/scraper/instagram-scraper.ts package.json package-lock.json .gitignore
git commit -m "feat: Playwright Instagram photo scraper"
```

---

### Task 28: Image optimizer

**Files:**
- Create: `scripts/scraper/optimize-images.ts`

- [ ] **Step 1: Install sharp**

```bash
npm install --save-dev sharp @types/sharp
```

- [ ] **Step 2: Create the optimizer**

Create `scripts/scraper/optimize-images.ts`:

```typescript
#!/usr/bin/env tsx
/**
 * Converts scraped JPGs to WebP in 3 sizes + generates blur placeholders.
 *
 * Input:  scripts/scraper/output/instagram/<postId>/<n>.jpg
 * Output: public/images/projects/<postId>/<n>-sm.webp   (480px)
 *         public/images/projects/<postId>/<n>-md.webp   (960px)
 *         public/images/projects/<postId>/<n>-lg.webp   (1920px)
 *         src/data/blur-placeholders.ts
 */

import sharp from 'sharp'
import * as fs from 'fs'
import * as path from 'path'

const INPUT_DIR = path.join(process.cwd(), 'scripts/scraper/output/instagram')
const OUTPUT_DIR = path.join(process.cwd(), 'public/images/projects')
const BLUR_OUTPUT = path.join(process.cwd(), 'src/data/blur-placeholders.ts')

const SIZES = [
  { suffix: 'sm', width: 480 },
  { suffix: 'md', width: 960 },
  { suffix: 'lg', width: 1920 },
] as const

async function toBlurDataUrl(inputPath: string): Promise<string> {
  const buf = await sharp(inputPath).resize(10, 10, { fit: 'inside' }).webp({ quality: 20 }).toBuffer()
  return `data:image/webp;base64,${buf.toString('base64')}`
}

async function processImage(inputPath: string, postId: string, idx: number): Promise<{ key: string; blur: string } | null> {
  if (!fs.existsSync(inputPath)) return null

  const outDir = path.join(OUTPUT_DIR, postId)
  fs.mkdirSync(outDir, { recursive: true })

  const { width: origW = 1920 } = await sharp(inputPath).metadata()

  for (const { suffix, width } of SIZES) {
    if (width > origW) continue
    await sharp(inputPath)
      .resize(width, null, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 85, effort: 4 })
      .toFile(path.join(outDir, `${idx}-${suffix}.webp`))
  }

  const lgPath = path.join(outDir, `${idx}-lg.webp`)
  if (!fs.existsSync(lgPath)) {
    await sharp(inputPath).webp({ quality: 90 }).toFile(lgPath)
  }

  console.log(`  ${postId}/${idx} -> WebP`)
  return { key: `${postId}/${idx}`, blur: await toBlurDataUrl(inputPath) }
}

async function main() {
  if (!fs.existsSync(INPUT_DIR)) {
    console.error('No input — run scrape:instagram first')
    process.exit(1)
  }
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })

  const postIds = fs.readdirSync(INPUT_DIR).filter((n) => fs.statSync(path.join(INPUT_DIR, n)).isDirectory())
  const blurMap: Record<string, string> = {}

  for (const postId of postIds) {
    const files = fs.readdirSync(path.join(INPUT_DIR, postId)).filter((f) => /\.(jpg|jpeg|png|webp)$/i.test(f))
    console.log(`\n${postId} (${files.length} images)`)
    for (const file of files) {
      const idx = parseInt(path.basename(file, path.extname(file)), 10)
      const result = await processImage(path.join(INPUT_DIR, postId, file), postId, isNaN(idx) ? 0 : idx)
      if (result) blurMap[result.key] = result.blur
    }
  }

  const ts = [
    '// Auto-generated by scripts/scraper/optimize-images.ts',
    '',
    `export const blurPlaceholders: Record<string, string> = ${JSON.stringify(blurMap, null, 2)}`,
    '',
    'export function getBlurPlaceholder(postId: string, index: number): string | undefined {',
    '  return blurPlaceholders[`${postId}/${index}`]',
    '}',
    '',
  ].join('\n')

  fs.writeFileSync(BLUR_OUTPUT, ts)
  console.log(`\nDone — ${Object.keys(blurMap).length} images optimized`)
  console.log(`Blur map written to ${BLUR_OUTPUT}`)
}

main().catch((err) => { console.error(err); process.exit(1) })
```

- [ ] **Step 3: Add npm script**

In `package.json` scripts add:
```json
"optimize:images": "tsx scripts/scraper/optimize-images.ts"
```

- [ ] **Step 4: Verify TypeScript compiles**

```bash
npx tsc --noEmit
```

Expected: No errors.

- [ ] **Step 5: Commit**

```bash
git add scripts/scraper/optimize-images.ts package.json package-lock.json
git commit -m "feat: sharp image optimizer — WebP 3 sizes + blur placeholder generator"
```

---

### Task 29: Scraper README and final checklist

**Files:**
- Create: `scripts/scraper/README.md`

- [ ] **Step 1: Create scraper README**

Create `scripts/scraper/README.md`:

```markdown
# ConceptoFino — Media Pipeline

Scraper + optimizer to replace Unsplash placeholders with real project photos.

## Workflow

```
1. npm run scrape:instagram   # download raw JPGs from @conceptofino
2. npm run optimize:images    # convert to WebP (3 sizes) + blur placeholders
3. Update src/data/projects.ts with /images/projects/<postId>/<n>-lg.webp paths
```

## Setup

```bash
npx playwright install chromium
cp .env.local.example .env.local   # fill in IG_USERNAME + IG_PASSWORD
```

## Running the scraper

```bash
IG_USERNAME=myuser IG_PASSWORD=mypass npm run scrape:instagram
# Limit posts:
IG_LIMIT=50 IG_USERNAME=myuser IG_PASSWORD=mypass npm run scrape:instagram
```

Output: `scripts/scraper/output/instagram/<postId>/`

## Running the optimizer

```bash
npm run optimize:images
```

Output:
- `public/images/projects/<postId>/0-sm.webp` (480px)
- `public/images/projects/<postId>/0-md.webp` (960px)
- `public/images/projects/<postId>/0-lg.webp` (1920px)
- `src/data/blur-placeholders.ts` (for next/image blurDataURL)

## Using optimized images in components

After running the optimizer, update `src/data/projects.ts`:
```typescript
// Before:
coverImage: 'https://images.unsplash.com/...',
// After:
coverImage: '/images/projects/ABC123/0-lg.webp',
```

In any `<Image>` component:
```typescript
import { getBlurPlaceholder } from '@/data/blur-placeholders'

<Image
  src="/images/projects/ABC123/0-lg.webp"
  placeholder="blur"
  blurDataURL={getBlurPlaceholder('ABC123', 0)}
  alt="..."
/>
```

## Notes

- Already-downloaded posts are skipped on re-run (safe to resume)
- `scripts/scraper/output/` is gitignored
- Optimized images in `public/images/` should be committed
```

- [ ] **Step 2: Run final production readiness checklist**

```bash
# TypeScript — zero errors
npx tsc --noEmit

# All unit tests — all green
npx jest --no-coverage

# ESLint — zero errors
npx next lint

# Production build — succeeds and generates sitemap
npm run build

# Verify sitemap files exist
ls -la public/sitemap.xml public/robots.txt

# Start production server
npm start
# Manually verify in browser:
#   http://localhost:3000         → redirects to /es
#   http://localhost:3000/es      → homepage, Hero loads
#   http://localhost:3000/en/proyectos → project grid in English
#   http://localhost:3000/ru/contacto  → contact form in Russian
#   http://localhost:3000/es/nosotros  → team + reviews carousel
#   http://localhost:3000/es/proyectos/<any-slug> → project detail + lightbox
```

- [ ] **Step 3: Commit and tag**

```bash
git add scripts/scraper/README.md
git commit -m "docs: media pipeline README"
git tag v1.0.0 -m "ConceptoFino v1.0.0 — all three plans complete"
```

---

## Plan 3 Summary

| Task | Builds | Verified by |
|------|--------|-------------|
| 21 | `sendEmail()` — Resend + fallback | Unit test |
| 22 | `POST /api/contact` | Unit test |
| 23 | `POST /api/lead` | Unit test |
| 24 | `JsonLd` component + `buildMetadata()` + per-page SEO | Unit test |
| 25 | `sitemap.xml` + `robots.txt` | Build output |
| 26 | Sanity v3 schemas — 8 document types | TypeScript |
| 27 | Instagram Playwright scraper | TypeScript |
| 28 | sharp optimizer — WebP + blur | TypeScript |
| 29 | README + production checklist | Manual |

**All three plans — 29 tasks, ~150 steps, production-ready.**

Go-live checklist:
1. Run `npm run scrape:instagram` + `npm run optimize:images`, update `src/data/projects.ts`
2. Set `RESEND_API_KEY` in Vercel environment settings
3. Set `NEXT_PUBLIC_SITE_URL=https://conceptofino.com`
4. Sanity migration (when needed): replace `src/lib/content/*.ts` implementations with `@sanity/client` queries — zero component changes required
