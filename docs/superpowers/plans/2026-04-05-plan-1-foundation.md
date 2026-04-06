# ConceptoFino — Plan 1: Foundation

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Bootstrap the Next.js project with all dependencies, TypeScript types, mock data, content abstraction layer, UI primitives, and full layout (Header + Footer + WhatsApp button) — producing a navigable site shell with all pages routing correctly.

**Architecture:** Visual-first approach — all content served from `src/data/` TypeScript files through a `src/lib/content/` abstraction layer. Components never import from `src/data/` directly. Interfaces in `src/types/index.ts` mirror future Sanity schemas 1:1.

**Tech Stack:** Next.js 14 (App Router) · TypeScript strict · Tailwind CSS 3.4 · Framer Motion · GSAP · Lenis · next-intl · Lucide React · Cormorant Garamond + Inter (next/font)

---

## Task 1: Project Initialization

**Files:**
- Create: `package.json`, `next.config.ts`, `tailwind.config.ts`, `tsconfig.json`, `postcss.config.js`, `.env.example`, `.gitignore`

- [ ] **Step 1: Bootstrap Next.js**

```bash
cd /Users/nakhromushkin/workdir/conceptofino
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
```

Answer prompts: Yes to all defaults.

- [ ] **Step 2: Install all project dependencies**

```bash
pnpm add framer-motion gsap @gsap/react lenis next-intl react-hook-form @hookform/resolvers zod resend lucide-react next-sitemap
pnpm add -D @types/gsap playwright sharp
```

- [ ] **Step 3: Replace `next.config.ts`**

```ts
// next.config.ts
import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'plus.unsplash.com' },
      { protocol: 'https', hostname: 'cdn.sanity.io' },
    ],
  },
}

export default withNextIntl(nextConfig)
```

- [ ] **Step 4: Replace `tailwind.config.ts`**

```ts
// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          black:  '#1a1a1a',
          dark:   '#2d2d2d',
          gray:   '#8a8a8a',
          light:  '#f5f3f0',
          cream:  '#faf8f5',
          white:  '#ffffff',
          accent: '#b8a088',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Georgia', 'serif'],
        sans:  ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      transitionTimingFunction: {
        'expo-out': 'cubic-bezier(0.16, 1, 0.3, 1)',
      },
    },
  },
  plugins: [],
}

export default config
```

- [ ] **Step 5: Replace `src/app/globals.css`**

```css
/* src/app/globals.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html {
    scroll-behavior: auto; /* Lenis handles smooth scroll */
  }
  
  body {
    @apply bg-brand-white text-brand-black font-sans antialiased;
  }

  h1, h2, h3, h4 {
    @apply font-serif;
  }

  ::selection {
    @apply bg-brand-accent/20 text-brand-black;
  }

  :focus-visible {
    @apply outline-2 outline-brand-accent outline-offset-2;
  }
}

@layer utilities {
  .text-balance {
    text-wrap: balance;
  }
}
```

- [ ] **Step 6: Create `.env.example`**

```env
# Email (Resend)
RESEND_API_KEY=
CONTACT_EMAIL_TO=info@conceptofino.com

# Site
NEXT_PUBLIC_SITE_URL=https://conceptofino.com
NEXT_PUBLIC_WHATSAPP_NUMBER=34657575939

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=

# Sanity (future migration)
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=

# Scraper
INSTAGRAM_USERNAME=
INSTAGRAM_PASSWORD=
```

- [ ] **Step 7: Copy `.env.example` to `.env.local`**

```bash
cp .env.example .env.local
```

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: init Next.js 14 project with full dependency set"
```

---

## Task 2: TypeScript Types

**Files:**
- Create: `src/types/index.ts`

- [ ] **Step 1: Create types file**

```ts
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
  location: string           // e.g. "Barrio del Carmen, Valencia"
  year: number
  mainImage: ProjectImage
  gallery: ProjectImage[]
  materialIds: string[]      // references to Material.id
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
  projectIds: string[]       // references to Project.id
}

// ─── Service ────────────────────────────────────────────────────

export type ServiceSlug = 'diseno' | 'fabricacion' | 'montaje'

export interface ServiceStep {
  title: LocalizedString
  description: LocalizedString
  icon: string               // Lucide icon name
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
  body: LocalizedString      // HTML string (visual-first phase)
  mainImage: ProjectImage
  categories: string[]
  publishedAt: string        // ISO date string
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
  rating: number             // 1-5
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
```

- [ ] **Step 2: Commit**

```bash
git add src/types/index.ts
git commit -m "feat: add TypeScript interfaces mirroring future Sanity schemas"
```

---

## Task 3: Mock Data

**Files:**
- Create: `src/data/projects.ts`, `src/data/materials.ts`, `src/data/services.ts`, `src/data/team.ts`, `src/data/reviews.ts`, `src/data/site-settings.ts`

- [ ] **Step 1: Create `src/data/projects.ts`**

```ts
// src/data/projects.ts
import type { Project } from '@/types'

export const projects: Project[] = [
  {
    id: 'p1',
    slug: 'cocina-barrio-del-carmen',
    category: 'cocinas',
    featured: true,
    order: 1,
    year: 2024,
    location: 'Barrio del Carmen, Valencia',
    title: {
      es: 'Cocina + Salón Integrado',
      en: 'Integrated Kitchen + Living Room',
      ru: 'Кухня + Интегрированная гостиная',
    },
    description: {
      es: 'Transformación completa de un apartamento histórico en el corazón de Valencia. Cocina de 12m² integrada visualmente con el salón mediante una isla central y armarios a medida hasta el techo.',
      en: 'Complete transformation of a historic apartment in the heart of Valencia. A 12m² kitchen visually integrated with the living room through a central island and custom floor-to-ceiling cabinets.',
      ru: 'Полная трансформация исторической квартиры в сердце Валенсии. Кухня 12м² визуально интегрирована с гостиной через центральный остров и шкафы на заказ от пола до потолка.',
    },
    challenge: {
      es: 'El cliente quería unificar cocina y salón sin perder capacidad de almacenaje, respetando la arquitectura original del siglo XIX.',
      en: 'The client wanted to unify the kitchen and living room without losing storage capacity, respecting the original 19th-century architecture.',
      ru: 'Клиент хотел объединить кухню и гостиную без потери места для хранения, уважая оригинальную архитектуру XIX века.',
    },
    solution: {
      es: 'Isla central multifuncional con encimera de Silestone, armarios con frentes de chapa de roble natural y sistema de iluminación integrada que define zonas sin barreras físicas.',
      en: 'Multifunctional central island with Silestone countertop, cabinets with natural oak veneer fronts, and integrated lighting system that defines zones without physical barriers.',
      ru: 'Многофункциональный центральный остров со столешницей Silestone, шкафы с фасадами из натурального дубового шпона и система интегрированного освещения, которая определяет зоны без физических барьеров.',
    },
    mainImage: {
      src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=80',
      alt: { es: 'Cocina moderna integrada', en: 'Modern integrated kitchen', ru: 'Современная интегрированная кухня' },
      width: 1400,
      height: 933,
    },
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1400&q=80',
        alt: { es: 'Vista general', en: 'General view', ru: 'Общий вид' },
        width: 1400, height: 933,
      },
      {
        src: 'https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=1400&q=80',
        alt: { es: 'Isla central', en: 'Central island', ru: 'Центральный остров' },
        width: 1400, height: 933,
      },
      {
        src: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=1200&q=80',
        alt: { es: 'Detalle armarios', en: 'Cabinet detail', ru: 'Деталь шкафов' },
        width: 1200, height: 800,
      },
    ],
    materialIds: ['m1', 'm3'],
    seo: {
      metaTitle: {
        es: 'Cocina Integrada Barrio del Carmen | ConceptoFino Valencia',
        en: 'Integrated Kitchen Barrio del Carmen | ConceptoFino Valencia',
        ru: 'Интегрированная кухня | ConceptoFino Валенсия',
      },
      metaDescription: {
        es: 'Cocina y salón integrados a medida en apartamento histórico de Valencia. Diseño personalizado al precio que esperas.',
        en: 'Custom integrated kitchen and living room in a historic Valencia apartment. Personalized design at the price you expect.',
        ru: 'Кухня и гостиная на заказ в исторической квартире в Валенсии.',
      },
    },
  },
  {
    id: 'p2',
    slug: 'vestidor-campanar',
    category: 'vestidores',
    featured: true,
    order: 2,
    year: 2024,
    location: 'Campanar, Valencia',
    title: {
      es: 'Vestidor Vestidor Walk-In',
      en: 'Walk-In Wardrobe',
      ru: 'Гардеробная Walk-In',
    },
    description: {
      es: 'Vestidor de 8m² con sistema de iluminación LED integrado, cajones soft-close y espejo de cuerpo entero empotrado. Chapa de nogal con herrajes dorados mate.',
      en: '8m² wardrobe with integrated LED lighting system, soft-close drawers and built-in full-length mirror. Walnut veneer with matte gold hardware.',
      ru: 'Гардеробная 8м² с интегрированной LED-подсветкой, ящиками с доводчиками и встроенным зеркалом в полный рост. Шпон ореха с матовой золотой фурнитурой.',
    },
    challenge: {
      es: 'Habitación irregular de 8m² que el cliente quería convertir en un vestidor funcional y estético.',
      en: 'Irregular 8m² room the client wanted to convert into a functional and aesthetic wardrobe.',
      ru: 'Нестандартная комната 8м², которую клиент хотел превратить в функциональную и эстетичную гардеробную.',
    },
    solution: {
      es: 'Aprovechamiento total de cada rincón con módulos a medida, isla central con cajones y tapizado en terciopelo gris.',
      en: 'Complete use of every corner with custom modules, central island with drawers and grey velvet upholstery.',
      ru: 'Максимальное использование каждого угла с модулями на заказ, центральным островом с ящиками и обивкой из серого бархата.',
    },
    mainImage: {
      src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80',
      alt: { es: 'Vestidor elegante', en: 'Elegant wardrobe', ru: 'Элегантная гардеробная' },
      width: 1400,
      height: 933,
    },
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80',
        alt: { es: 'Vista general vestidor', en: 'Wardrobe general view', ru: 'Гардеробная общий вид' },
        width: 1400, height: 933,
      },
    ],
    materialIds: ['m2', 'm4'],
    seo: {
      metaTitle: {
        es: 'Vestidor a Medida Campanar | ConceptoFino Valencia',
        en: 'Custom Wardrobe Campanar | ConceptoFino Valencia',
        ru: 'Гардеробная на заказ | ConceptoFino Валенсия',
      },
      metaDescription: {
        es: 'Vestidor walk-in a medida en Valencia. Chapa de nogal, herrajes dorados, iluminación LED integrada.',
        en: 'Custom walk-in wardrobe in Valencia. Walnut veneer, gold hardware, integrated LED lighting.',
        ru: 'Гардеробная walk-in на заказ в Валенсии.',
      },
    },
  },
  {
    id: 'p3',
    slug: 'mueble-tv-benimaclet',
    category: 'muebles',
    featured: true,
    order: 3,
    year: 2024,
    location: 'Benimaclet, Valencia',
    title: {
      es: 'Mueble TV + Librería a Medida',
      en: 'Custom TV Unit + Bookcase',
      ru: 'ТВ-тумба + Книжный шкаф на заказ',
    },
    description: {
      es: 'Unidad de 5 metros lineal que integra TV, zona de almacenaje y biblioteca. Lacado en blanco roto con nichos de luz indirecta LED.',
      en: '5 linear metre unit integrating TV, storage zone and library. Off-white lacquer with indirect LED light niches.',
      ru: 'Блок 5 погонных метров, интегрирующий телевизор, зону хранения и библиотеку. Лак цвета слоновой кости с нишами с косвенной LED-подсветкой.',
    },
    challenge: {
      es: 'Pared de 5 metros frente al sofá que el cliente quería aprovechar al máximo sin abrumar el espacio.',
      en: '5-metre wall facing the sofa that the client wanted to maximise without overwhelming the space.',
      ru: 'Стена 5 метров напротив дивана, которую клиент хотел максимально использовать, не перегружая пространство.',
    },
    solution: {
      es: 'Diseño asimétrico con módulos de diferentes alturas, creando dinamismo visual. Iluminación LED indirecta en los nichos abiertos.',
      en: 'Asymmetric design with modules of different heights, creating visual dynamism. Indirect LED lighting in open niches.',
      ru: 'Асимметричный дизайн с модулями разной высоты, создающий визуальный динамизм. Косвенная LED-подсветка в открытых нишах.',
    },
    mainImage: {
      src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=80',
      alt: { es: 'Mueble TV a medida', en: 'Custom TV unit', ru: 'ТВ-тумба на заказ' },
      width: 1400,
      height: 933,
    },
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1400&q=80',
        alt: { es: 'Mueble TV vista general', en: 'TV unit general view', ru: 'ТВ-тумба общий вид' },
        width: 1400, height: 933,
      },
    ],
    materialIds: ['m3'],
    seo: {
      metaTitle: {
        es: 'Mueble TV a Medida Benimaclet | ConceptoFino Valencia',
        en: 'Custom TV Unit Benimaclet | ConceptoFino Valencia',
        ru: 'ТВ-тумба на заказ | ConceptoFino Валенсия',
      },
      metaDescription: {
        es: 'Mueble TV y librería a medida en Valencia. 5 metros lineales de almacenaje personalizado.',
        en: 'Custom TV unit and bookcase in Valencia. 5 linear metres of personalised storage.',
        ru: 'ТВ-тумба и книжный шкаф на заказ в Валенсии.',
      },
    },
  },
  {
    id: 'p4',
    slug: 'proyecto-integral-russafa',
    category: 'integrales',
    featured: true,
    order: 4,
    year: 2023,
    location: 'Ruzafa, Valencia',
    title: {
      es: 'Proyecto Integral Piso Ruzafa',
      en: 'Complete Interior Project Ruzafa',
      ru: 'Полный интерьер квартиры Русафа',
    },
    description: {
      es: 'Reforma integral de 90m² incluyendo cocina, dos baños, dormitorio principal con vestidor y salón. Concepto minimalista con madera natural y piedra caliza.',
      en: 'Complete 90m² renovation including kitchen, two bathrooms, master bedroom with wardrobe and living room. Minimalist concept with natural wood and limestone.',
      ru: 'Полная реновация 90м², включая кухню, две ванные комнаты, главную спальню с гардеробной и гостиную. Минималистичная концепция с натуральным деревом и известняком.',
    },
    challenge: {
      es: 'Piso de los años 70 que necesitaba modernización completa manteniendo el carácter del edificio y un presupuesto ajustado.',
      en: '1970s apartment that needed complete modernisation while maintaining the character of the building and a tight budget.',
      ru: 'Квартира 70-х годов, которой нужна была полная модернизация с сохранением характера здания и ограниченным бюджетом.',
    },
    solution: {
      es: 'Paleta neutra con roble natural, microcemento y mármol Volakas. Mobiliario 100% a medida en todos los espacios.',
      en: 'Neutral palette with natural oak, microcement and Volakas marble. 100% custom furniture in all spaces.',
      ru: 'Нейтральная палитра с натуральным дубом, микроцементом и мрамором Volakas. Мебель 100% на заказ во всех помещениях.',
    },
    mainImage: {
      src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&q=80',
      alt: { es: 'Proyecto integral Ruzafa', en: 'Complete Ruzafa project', ru: 'Полный проект Русафа' },
      width: 1400,
      height: 933,
    },
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1400&q=80',
        alt: { es: 'Salón', en: 'Living room', ru: 'Гостиная' },
        width: 1400, height: 933,
      },
      {
        src: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=1400&q=80',
        alt: { es: 'Dormitorio', en: 'Bedroom', ru: 'Спальня' },
        width: 1400, height: 933,
      },
    ],
    materialIds: ['m1', 'm2'],
    seo: {
      metaTitle: {
        es: 'Reforma Integral Ruzafa Valencia | ConceptoFino',
        en: 'Complete Renovation Ruzafa Valencia | ConceptoFino',
        ru: 'Полная реновация Русафа Валенсия | ConceptoFino',
      },
      metaDescription: {
        es: 'Reforma integral de 90m² en Ruzafa, Valencia. Cocina, baños y mobiliario a medida.',
        en: 'Complete 90m² renovation in Ruzafa, Valencia. Kitchen, bathrooms and custom furniture.',
        ru: 'Полная реновация 90м² в Русафа, Валенсия.',
      },
    },
  },
  {
    id: 'p5',
    slug: 'cocina-eixample',
    category: 'cocinas',
    featured: false,
    order: 5,
    year: 2023,
    location: 'Eixample, Valencia',
    title: {
      es: 'Cocina Industrial Chic',
      en: 'Industrial Chic Kitchen',
      ru: 'Кухня Industrial Chic',
    },
    description: {
      es: 'Cocina de 15m² con estética industrial: acero inoxidable, madera maciza de pino envejecido y baldosas hidráulicas de colores.',
      en: '15m² kitchen with industrial aesthetic: stainless steel, solid aged pine wood and colourful hydraulic tiles.',
      ru: 'Кухня 15м² с индустриальной эстетикой: нержавеющая сталь, массив состаренной сосны и цветная гидравлическая плитка.',
    },
    challenge: {
      es: 'El cliente quería un estilo industrial auténtico adaptado a la vida familiar cotidiana.',
      en: 'The client wanted an authentic industrial style adapted to everyday family life.',
      ru: 'Клиент хотел аутентичный индустриальный стиль, адаптированный к повседневной семейной жизни.',
    },
    solution: {
      es: 'Combinación de materiales nobles (roble macizo, piedra natural) con elementos industriales (tuberías vistas, iluminación de cable).',
      en: 'Combination of noble materials (solid oak, natural stone) with industrial elements (exposed pipes, cable lighting).',
      ru: 'Сочетание благородных материалов (массив дуба, натуральный камень) с индустриальными элементами (открытые трубы, кабельное освещение).',
    },
    mainImage: {
      src: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1400&q=80',
      alt: { es: 'Cocina industrial', en: 'Industrial kitchen', ru: 'Индустриальная кухня' },
      width: 1400,
      height: 933,
    },
    gallery: [
      {
        src: 'https://images.unsplash.com/photo-1556909212-d5b604d0c90d?w=1400&q=80',
        alt: { es: 'Vista general cocina', en: 'Kitchen general view', ru: 'Кухня общий вид' },
        width: 1400, height: 933,
      },
    ],
    materialIds: ['m1', 'm3'],
    seo: {
      metaTitle: {
        es: 'Cocina Industrial Eixample Valencia | ConceptoFino',
        en: 'Industrial Kitchen Eixample Valencia | ConceptoFino',
        ru: 'Индустриальная кухня Эйшампле | ConceptoFino',
      },
      metaDescription: {
        es: 'Cocina industrial a medida en Eixample, Valencia.',
        en: 'Custom industrial kitchen in Eixample, Valencia.',
        ru: 'Индустриальная кухня на заказ в Эйшампле, Валенсия.',
      },
    },
  },
]
```

- [ ] **Step 2: Create `src/data/materials.ts`**

```ts
// src/data/materials.ts
import type { Material } from '@/types'

export const materials: Material[] = [
  {
    id: 'm1',
    slug: 'roble-natural',
    category: 'maderas',
    title: { es: 'Roble Natural', en: 'Natural Oak', ru: 'Натуральный дуб' },
    description: {
      es: 'El roble natural es nuestra madera estrella. Cálido, duradero y con una veta que cuenta su propia historia. Disponible en acabados aceite natural, lacado mate o barniz satinado.',
      en: 'Natural oak is our star wood. Warm, durable and with a grain that tells its own story. Available in natural oil, matte lacquer or satin varnish finishes.',
      ru: 'Натуральный дуб — наше главное дерево. Тёплое, долговечное, с текстурой, которая рассказывает свою историю. Доступно в отделке натуральным маслом, матовым лаком или сатиновым лаком.',
    },
    characteristics: {
      es: ['Alta durabilidad (50+ años)', 'Resistente a la humedad', 'Veta natural única', 'Fácil de reparar', 'Sostenible y certificado FSC'],
      en: ['High durability (50+ years)', 'Moisture resistant', 'Unique natural grain', 'Easy to repair', 'Sustainable and FSC certified'],
      ru: ['Высокая долговечность (50+ лет)', 'Устойчивость к влаге', 'Уникальная натуральная текстура', 'Легко ремонтируется', 'Устойчивое производство, сертификат FSC'],
    },
    mainImage: {
      src: 'https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?w=1200&q=80',
      alt: { es: 'Roble natural', en: 'Natural oak', ru: 'Натуральный дуб' },
      width: 1200, height: 800,
    },
    textureImage: {
      src: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=800&q=80',
      alt: { es: 'Textura de roble', en: 'Oak texture', ru: 'Текстура дуба' },
      width: 800, height: 800,
    },
    gallery: [],
    projectIds: ['p1', 'p4'],
  },
  {
    id: 'm2',
    slug: 'nogal-americano',
    category: 'maderas',
    title: { es: 'Nogal Americano', en: 'American Walnut', ru: 'Американский орех' },
    description: {
      es: 'El nogal americano aporta elegancia oscura y sofisticada. Ideal para vestidores, muebles de representación y elementos de acento.',
      en: 'American walnut brings dark, sophisticated elegance. Ideal for wardrobes, statement furniture and accent elements.',
      ru: 'Американский орех привносит тёмную изысканную элегантность. Идеален для гардеробных, представительской мебели и акцентных элементов.',
    },
    characteristics: {
      es: ['Tono oscuro y cálido', 'Muy alta densidad', 'Acabado natural brillante', 'Premium y exclusivo'],
      en: ['Dark and warm tone', 'Very high density', 'Natural brilliant finish', 'Premium and exclusive'],
      ru: ['Тёмный тёплый тон', 'Очень высокая плотность', 'Натуральный блестящий финиш', 'Премиум и эксклюзив'],
    },
    mainImage: {
      src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&q=80',
      alt: { es: 'Nogal americano', en: 'American walnut', ru: 'Американский орех' },
      width: 1200, height: 800,
    },
    textureImage: {
      src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      alt: { es: 'Textura de nogal', en: 'Walnut texture', ru: 'Текстура ореха' },
      width: 800, height: 800,
    },
    gallery: [],
    projectIds: ['p2', 'p4'],
  },
  {
    id: 'm3',
    slug: 'acero-inoxidable',
    category: 'metales',
    title: { es: 'Acero Inoxidable', en: 'Stainless Steel', ru: 'Нержавеющая сталь' },
    description: {
      es: 'Acero inoxidable de grado 316 con acabado cepillado o espejo. Higiene total y estética industrial que complementa perfectamente la madera.',
      en: 'Grade 316 stainless steel with brushed or mirror finish. Total hygiene and industrial aesthetic that perfectly complements wood.',
      ru: 'Нержавеющая сталь марки 316 с матированной или зеркальной отделкой. Полная гигиеничность и индустриальная эстетика, которая прекрасно дополняет дерево.',
    },
    characteristics: {
      es: ['Higiene alimentaria certificada', 'Resistente a la corrosión', 'Fácil limpieza', 'Durabilidad ilimitada'],
      en: ['Certified food hygiene', 'Corrosion resistant', 'Easy to clean', 'Unlimited durability'],
      ru: ['Сертифицированная пищевая гигиена', 'Устойчивость к коррозии', 'Легко чистить', 'Неограниченная долговечность'],
    },
    mainImage: {
      src: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=1200&q=80',
      alt: { es: 'Acero inoxidable', en: 'Stainless steel', ru: 'Нержавеющая сталь' },
      width: 1200, height: 800,
    },
    textureImage: {
      src: 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=800&q=80',
      alt: { es: 'Textura acero', en: 'Steel texture', ru: 'Текстура стали' },
      width: 800, height: 800,
    },
    gallery: [],
    projectIds: ['p1', 'p3', 'p5'],
  },
  {
    id: 'm4',
    slug: 'terciopelo-gris',
    category: 'textiles',
    title: { es: 'Terciopelo Gris Perla', en: 'Pearl Grey Velvet', ru: 'Бархат жемчужно-серый' },
    description: {
      es: 'Terciopelo de alta resistencia al uso. Suave al tacto, con un brillo sutil que añade lujo discreto a cualquier espacio.',
      en: 'High wear-resistance velvet. Soft to the touch, with a subtle shine that adds discreet luxury to any space.',
      ru: 'Высокопрочный бархат. Мягкий на ощупь, с тонким блеском, который добавляет сдержанную роскошь любому пространству.',
    },
    characteristics: {
      es: ['Alta resistencia al desgaste', 'Fácil limpieza', 'Color estable UV', 'Ignífugo Clase 1'],
      en: ['High wear resistance', 'Easy to clean', 'UV stable colour', 'Class 1 fire retardant'],
      ru: ['Высокая износостойкость', 'Легко чистить', 'Стабильный UV-цвет', 'Огнезащита класс 1'],
    },
    mainImage: {
      src: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&q=80',
      alt: { es: 'Terciopelo gris', en: 'Grey velvet', ru: 'Серый бархат' },
      width: 1200, height: 800,
    },
    textureImage: {
      src: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&q=80',
      alt: { es: 'Textura terciopelo', en: 'Velvet texture', ru: 'Текстура бархата' },
      width: 800, height: 800,
    },
    gallery: [],
    projectIds: ['p2'],
  },
]
```

- [ ] **Step 3: Create `src/data/services.ts`**

```ts
// src/data/services.ts
import type { Service } from '@/types'

export const services: Service[] = [
  {
    id: 's1',
    slug: 'diseno',
    title: { es: 'Diseño de Interiores', en: 'Interior Design', ru: 'Дизайн интерьера' },
    description: {
      es: 'Comenzamos con escucha activa. Visitamos tu espacio, tomamos medidas exactas y elaboramos un proyecto 3D completo con opciones de materiales y acabados.',
      en: 'We start with active listening. We visit your space, take exact measurements and produce a complete 3D project with material and finish options.',
      ru: 'Начинаем с активного слушания. Посещаем ваше пространство, снимаем точные мерки и разрабатываем полный 3D-проект с вариантами материалов и отделки.',
    },
    steps: [
      {
        title: { es: 'Primera visita', en: 'First visit', ru: 'Первый визит' },
        description: {
          es: 'Visita gratuita a tu domicilio. Tomamos medidas, fotografías y entendemos tus necesidades y presupuesto.',
          en: 'Free home visit. We take measurements, photos and understand your needs and budget.',
          ru: 'Бесплатный визит на дом. Снимаем мерки, делаем фотографии, понимаем ваши потребности и бюджет.',
        },
        icon: 'Home',
        imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&q=80',
      },
      {
        title: { es: 'Diseño 3D', en: '3D Design', ru: '3D дизайн' },
        description: {
          es: 'Presentamos un render 3D fotorrealista de tu espacio con todas las opciones de materiales y configuraciones.',
          en: 'We present a photorealistic 3D render of your space with all material and configuration options.',
          ru: 'Представляем фотореалистичный 3D-рендер вашего пространства со всеми вариантами материалов и конфигураций.',
        },
        icon: 'Layers',
        imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
      },
      {
        title: { es: 'Presupuesto detallado', en: 'Detailed quote', ru: 'Детальная смета' },
        description: {
          es: 'Presupuesto sin letra pequeña: materiales, mano de obra, instalación y garantías. Todo incluido.',
          en: 'Quote with no small print: materials, labour, installation and warranties. All inclusive.',
          ru: 'Смета без мелкого шрифта: материалы, труд, монтаж и гарантии. Всё включено.',
        },
        icon: 'FileText',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
      },
    ],
    mainImage: {
      src: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1400&q=80',
      alt: { es: 'Diseño de interiores', en: 'Interior design', ru: 'Дизайн интерьера' },
      width: 1400, height: 933,
    },
  },
  {
    id: 's2',
    slug: 'fabricacion',
    title: { es: 'Fabricación Propia', en: 'Own Manufacturing', ru: 'Собственное производство' },
    description: {
      es: 'Nuestro taller en Valencia fabrica cada pieza a medida. Sin intermediarios, sin catálogos: tus muebles nacen en nuestras manos.',
      en: 'Our Valencia workshop manufactures each piece to measure. No middlemen, no catalogues: your furniture is born in our hands.',
      ru: 'Наша мастерская в Валенсии изготавливает каждую деталь на заказ. Без посредников, без каталогов: ваша мебель рождается в наших руках.',
    },
    steps: [
      {
        title: { es: 'Selección de materiales', en: 'Material selection', ru: 'Выбор материалов' },
        description: {
          es: 'Seleccionamos los materiales según el proyecto. Solo trabajamos con proveedores de primer nivel y materiales certificados.',
          en: 'We select materials according to the project. We only work with first-tier suppliers and certified materials.',
          ru: 'Выбираем материалы согласно проекту. Работаем только с поставщиками первого уровня и сертифицированными материалами.',
        },
        icon: 'Package',
        imageUrl: 'https://images.unsplash.com/photo-1530973428-5bf2db2e4d71?w=800&q=80',
      },
      {
        title: { es: 'Fabricación en taller', en: 'Workshop manufacturing', ru: 'Изготовление в мастерской' },
        description: {
          es: 'Cada pieza se fabrica en nuestro taller de Valencia con maquinaria de precisión CNC y acabados manuales.',
          en: 'Each piece is manufactured in our Valencia workshop with CNC precision machinery and manual finishes.',
          ru: 'Каждая деталь изготавливается в нашей мастерской в Валенсии на высокоточном CNC-оборудовании с ручной отделкой.',
        },
        icon: 'Wrench',
        imageUrl: 'https://images.unsplash.com/photo-1609220136736-443140cfeaa8?w=800&q=80',
      },
      {
        title: { es: 'Control de calidad', en: 'Quality control', ru: 'Контроль качества' },
        description: {
          es: 'Revisión exhaustiva antes de la entrega. Cada cajón, bisagra y acabado se prueba en taller.',
          en: 'Thorough review before delivery. Every drawer, hinge and finish is tested in the workshop.',
          ru: 'Тщательная проверка перед доставкой. Каждый ящик, петля и отделка тестируются в мастерской.',
        },
        icon: 'CheckCircle',
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
      },
    ],
    mainImage: {
      src: 'https://images.unsplash.com/photo-1609220136736-443140cfeaa8?w=1400&q=80',
      alt: { es: 'Fabricación propia', en: 'Own manufacturing', ru: 'Собственное производство' },
      width: 1400, height: 933,
    },
  },
  {
    id: 's3',
    slug: 'montaje',
    title: { es: 'Montaje y Logística', en: 'Assembly & Logistics', ru: 'Монтаж и логистика' },
    description: {
      es: 'Nuestro equipo de montadores profesionales instala tu proyecto en 1-3 días. Cero estrés para ti: nos encargamos de todo.',
      en: 'Our team of professional assemblers installs your project in 1-3 days. Zero stress for you: we take care of everything.',
      ru: 'Наша команда профессиональных монтажников устанавливает ваш проект за 1-3 дня. Нулевой стресс для вас: мы обо всём заботимся.',
    },
    steps: [
      {
        title: { es: 'Coordinación', en: 'Coordination', ru: 'Координация' },
        description: {
          es: 'Acordamos fecha y hora de instalación que mejor te convenga. Sin improvisar, sin retrasos.',
          en: 'We agree on the installation date and time that suits you best. No improvisation, no delays.',
          ru: 'Согласовываем дату и время монтажа, которые вам лучше всего подходят. Без импровизации, без задержек.',
        },
        icon: 'Calendar',
        imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&q=80',
      },
      {
        title: { es: 'Instalación profesional', en: 'Professional installation', ru: 'Профессиональная установка' },
        description: {
          es: 'Nuestros instaladores cuidan cada detalle: protegen suelos, limpian al terminar y dejan tu casa perfecta.',
          en: 'Our installers take care of every detail: protect floors, clean up afterwards and leave your home perfect.',
          ru: 'Наши монтажники заботятся о каждой детали: защищают полы, убирают после себя и оставляют ваш дом в идеальном состоянии.',
        },
        icon: 'Tool',
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&q=80',
      },
      {
        title: { es: 'Garantía 5 años', en: '5-year warranty', ru: 'Гарантия 5 лет' },
        description: {
          es: 'Todos nuestros proyectos incluyen 5 años de garantía. Cualquier incidencia, la resolvemos sin coste.',
          en: 'All our projects include a 5-year warranty. Any issue, we resolve it at no cost.',
          ru: 'Все наши проекты включают 5-летнюю гарантию. Любую проблему решаем бесплатно.',
        },
        icon: 'Shield',
        imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=800&q=80',
      },
    ],
    mainImage: {
      src: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1400&q=80',
      alt: { es: 'Montaje profesional', en: 'Professional assembly', ru: 'Профессиональный монтаж' },
      width: 1400, height: 933,
    },
  },
]
```

- [ ] **Step 4: Create `src/data/team.ts`**

```ts
// src/data/team.ts
import type { TeamMember } from '@/types'

export const team: TeamMember[] = [
  {
    id: 't1',
    name: 'Carlos Martínez',
    role: {
      es: 'Fundador & Director de Diseño',
      en: 'Founder & Design Director',
      ru: 'Основатель и арт-директор',
    },
    photoUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&q=80',
    bio: {
      es: '15 años transformando espacios en Valencia. Arquitecto de formación, apasionado por la intersección entre funcionalidad y belleza atemporal.',
      en: '15 years transforming spaces in Valencia. Architect by training, passionate about the intersection of functionality and timeless beauty.',
      ru: '15 лет трансформирует пространства в Валенсии. Архитектор по образованию, увлечённый пересечением функциональности и вневременной красоты.',
    },
    order: 1,
  },
  {
    id: 't2',
    name: 'Ana Gómez',
    role: {
      es: 'Jefa de Taller & Fabricación',
      en: 'Workshop Manager & Manufacturing',
      ru: 'Руководитель мастерской и производства',
    },
    photoUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
    bio: {
      es: 'Maestra artesana con 20 años de experiencia. Supervisa cada pieza que sale de nuestro taller en Valencia.',
      en: 'Master craftsperson with 20 years of experience. Supervises every piece that leaves our Valencia workshop.',
      ru: 'Мастер-ремесленник с 20-летним опытом. Контролирует каждую деталь, выходящую из нашей мастерской в Валенсии.',
    },
    order: 2,
  },
  {
    id: 't3',
    name: 'Miguel Torres',
    role: {
      es: 'Diseñador de Interiores Senior',
      en: 'Senior Interior Designer',
      ru: 'Старший дизайнер интерьеров',
    },
    photoUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80',
    bio: {
      es: 'Especializado en proyectos residenciales de alta gama. Ha colaborado con estudios de interiorismo en Madrid, Barcelona y Valencia.',
      en: 'Specialised in high-end residential projects. Has collaborated with interior design studios in Madrid, Barcelona and Valencia.',
      ru: 'Специализируется на высококлассных жилых проектах. Сотрудничал со студиями дизайна интерьеров в Мадриде, Барселоне и Валенсии.',
    },
    order: 3,
  },
]
```

- [ ] **Step 5: Create `src/data/reviews.ts`**

```ts
// src/data/reviews.ts
import type { Review } from '@/types'

export const reviews: Review[] = [
  {
    id: 'r1',
    clientName: 'Sofía R.',
    clientRole: {
      es: 'Propietaria de villa en Campanar',
      en: 'Villa owner in Campanar',
      ru: 'Владелица виллы в Кампанаре',
    },
    text: {
      es: 'Increíble resultado. Pensaba que tener muebles a medida era solo para gente con mucho dinero, pero ConceptoFino me demostró que con el mismo presupuesto que tenía previsto para IKEA, pude tener exactamente lo que quería. El vestidor es perfecto.',
      en: 'Incredible result. I thought custom furniture was only for people with a lot of money, but ConceptoFino showed me that with the same budget I had planned for IKEA, I could have exactly what I wanted. The wardrobe is perfect.',
      ru: 'Невероятный результат. Я думала, что мебель на заказ — только для состоятельных людей, но ConceptoFino доказал мне, что с тем же бюджетом, который я планировала потратить в IKEA, я могла получить именно то, что хотела. Гардеробная идеальна.',
    },
    rating: 5,
    projectId: 'p2',
  },
  {
    id: 'r2',
    clientName: 'Andrés M.',
    clientRole: {
      es: 'Arquitecto, Valencia',
      en: 'Architect, Valencia',
      ru: 'Архитектор, Валенсия',
    },
    text: {
      es: 'Como arquitecto soy muy exigente con los detalles. ConceptoFino cumplió cada especificación al milímetro. La cocina que diseñaron para mi cliente en Ruzafa es una obra maestra. Repetiré sin duda.',
      en: 'As an architect I am very demanding about details. ConceptoFino met every specification to the millimetre. The kitchen they designed for my client in Ruzafa is a masterpiece. I will definitely repeat.',
      ru: 'Как архитектор я очень требователен к деталям. ConceptoFino выполнил каждую спецификацию с точностью до миллиметра. Кухня, которую они спроектировали для моего клиента в Русафе, — это шедевр. Обязательно повторю.',
    },
    rating: 5,
    projectId: 'p4',
  },
  {
    id: 'r3',
    clientName: 'Elena V.',
    clientRole: {
      es: 'Inversora inmobiliaria',
      en: 'Property investor',
      ru: 'Инвестор в недвижимость',
    },
    text: {
      es: 'Trabajo con ConceptoFino en todos mis proyectos de renovación. Los tiempos son impecables — siempre en 3 semanas — y la calidad-precio es insuperable. Mis inquilinos siempre mencionan los muebles.',
      en: 'I work with ConceptoFino on all my renovation projects. Timelines are impeccable — always 3 weeks — and the value for money is unbeatable. My tenants always mention the furniture.',
      ru: 'Работаю с ConceptoFino во всех своих проектах реновации. Сроки безупречные — всегда 3 недели — и соотношение цена-качество непревзойдённое. Мои арендаторы всегда упоминают мебель.',
    },
    rating: 5,
    projectId: 'p1',
  },
  {
    id: 'r4',
    clientName: 'Pablo C.',
    clientRole: {
      es: 'Propietario de piso en Eixample',
      en: 'Apartment owner in Eixample',
      ru: 'Владелец квартиры в Эйшампле',
    },
    text: {
      es: 'Dudé mucho antes de contactarles porque pensaba que sería carísimo. Me sorprendió el presupuesto — era competitivo con las tiendas grandes — y el resultado es infinitamente mejor. Ojalá lo hubiera hecho antes.',
      en: 'I hesitated a lot before contacting them because I thought it would be very expensive. I was surprised by the quote — it was competitive with the big stores — and the result is infinitely better. I wish I had done it sooner.',
      ru: 'Я долго колебался, прежде чем связаться с ними, потому что думал, что это будет очень дорого. Смета меня удивила — она была конкурентоспособна с крупными магазинами — а результат бесконечно лучше. Жаль, что не сделал это раньше.',
    },
    rating: 5,
    projectId: 'p3',
  },
]
```

- [ ] **Step 6: Create `src/data/site-settings.ts`**

```ts
// src/data/site-settings.ts
import type { SiteSettings } from '@/types'

export const siteSettings: SiteSettings = {
  companyName: 'ConceptoFino',
  phone: '+34 657 575 939',
  email: 'info@conceptofino.com',
  address: {
    es: 'Calle Colón 48, 46004 Valencia, España',
    en: '48 Colón Street, 46004 Valencia, Spain',
    ru: 'Calle Colón 48, 46004 Валенсия, Испания',
  },
  whatsappNumber: '34657575939',
  instagram: 'https://www.instagram.com/conceptofino/',
  facebook: 'https://www.facebook.com/conceptofino',
  googleMapsEmbedUrl: '',
}
```

- [ ] **Step 7: Commit**

```bash
git add src/data/
git commit -m "feat: add mock data for all content types with full ES/EN/RU localizations"
```

---

## Task 4: Content Abstraction Layer

**Files:**
- Create: `src/lib/content/projects.ts`, `src/lib/content/materials.ts`, `src/lib/content/services.ts`, `src/lib/content/blog.ts`, `src/lib/content/team.ts`, `src/lib/content/reviews.ts`, `src/lib/content/site-settings.ts`, `src/lib/content/index.ts`

- [ ] **Step 1: Create `src/lib/content/projects.ts`**

```ts
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
```

- [ ] **Step 2: Create `src/lib/content/materials.ts`**

```ts
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
```

- [ ] **Step 3: Create remaining content files**

```ts
// src/lib/content/services.ts
import { services } from '@/data/services'
import type { Service, ServiceSlug } from '@/types'

export async function getServices(): Promise<Service[]> {
  return services
}

export async function getServiceBySlug(slug: ServiceSlug): Promise<Service | null> {
  return services.find((s) => s.slug === slug) ?? null
}
```

```ts
// src/lib/content/team.ts
import { team } from '@/data/team'
import type { TeamMember } from '@/types'

export async function getTeam(): Promise<TeamMember[]> {
  return team.sort((a, b) => a.order - b.order)
}
```

```ts
// src/lib/content/reviews.ts
import { reviews } from '@/data/reviews'
import type { Review } from '@/types'

export async function getReviews(): Promise<Review[]> {
  return reviews
}
```

```ts
// src/lib/content/blog.ts
import type { BlogPost } from '@/types'

// Visual-first: empty blog, ready for Sanity migration
export async function getBlogPosts(): Promise<BlogPost[]> {
  return []
}

export async function getBlogPostBySlug(_slug: string): Promise<BlogPost | null> {
  return null
}
```

```ts
// src/lib/content/site-settings.ts
import { siteSettings } from '@/data/site-settings'
import type { SiteSettings } from '@/types'

export async function getSiteSettings(): Promise<SiteSettings> {
  return siteSettings
}
```

- [ ] **Step 4: Create `src/lib/content/index.ts`**

```ts
// src/lib/content/index.ts
export * from './projects'
export * from './materials'
export * from './services'
export * from './blog'
export * from './team'
export * from './reviews'
export * from './site-settings'
```

- [ ] **Step 5: Write tests for content layer**

Create `src/lib/content/__tests__/projects.test.ts`:

```ts
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
```

- [ ] **Step 6: Configure Jest**

Add to `package.json`:

```json
{
  "jest": {
    "testEnvironment": "node",
    "transform": {
      "^.+\\.tsx?$": ["ts-jest", {}]
    },
    "moduleNameMapper": {
      "^@/(.*)$": "<rootDir>/src/$1"
    }
  },
  "scripts": {
    "test": "jest"
  }
}
```

Install:

```bash
pnpm add -D jest ts-jest @types/jest
```

- [ ] **Step 7: Run tests**

```bash
pnpm test
```

Expected: 6 tests pass.

- [ ] **Step 8: Commit**

```bash
git add src/lib/content/ src/lib/content/__tests__/ package.json
git commit -m "feat: add content abstraction layer with async API + passing tests"
```

---

## Task 5: Utils, Constants, i18n Setup

**Files:**
- Create: `src/lib/utils.ts`, `src/lib/constants.ts`, `src/i18n/config.ts`, `src/i18n/routing.ts`, `src/i18n/request.ts`, `src/middleware.ts`, `src/messages/es.json`, `src/messages/en.json`, `src/messages/ru.json`

- [ ] **Step 1: Create `src/lib/utils.ts`**

```ts
// src/lib/utils.ts
import type { Locale, LocalizedString } from '@/types'

export function getLocalizedField(
  field: LocalizedString,
  locale: Locale
): string {
  return field[locale] ?? field.es
}

export function formatDate(dateString: string, locale: Locale): string {
  const date = new Date(dateString)
  const localeMap: Record<Locale, string> = {
    es: 'es-ES',
    en: 'en-GB',
    ru: 'ru-RU',
  }
  return date.toLocaleDateString(localeMap[locale], {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}
```

- [ ] **Step 2: Create `src/lib/constants.ts`**

```ts
// src/lib/constants.ts
import type { Locale } from '@/types'

export const LOCALES: Locale[] = ['es', 'en', 'ru']
export const DEFAULT_LOCALE: Locale = 'es'

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://conceptofino.com'

export const WHATSAPP_NUMBER =
  process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '34657575939'

export const WHATSAPP_MESSAGES: Record<Locale, string> = {
  es: 'Hola, me interesa información sobre vuestros muebles a medida.',
  en: 'Hello, I am interested in information about your custom furniture.',
  ru: 'Здравствуйте, меня интересует информация о вашей мебели на заказ.',
}

export const PROJECT_CATEGORIES = [
  'cocinas',
  'vestidores',
  'muebles',
  'integrales',
] as const

export const MATERIAL_CATEGORIES = [
  'maderas',
  'piedra',
  'metales',
  'textiles',
] as const

export const NAV_ITEMS = {
  proyectos: [
    { key: 'cocinas', href: '/proyectos/cocinas' },
    { key: 'vestidores', href: '/proyectos/vestidores' },
    { key: 'muebles', href: '/proyectos/muebles' },
    { key: 'integrales', href: '/proyectos/integrales' },
  ],
  materiales: [
    { key: 'maderas', href: '/materiales/maderas' },
    { key: 'piedra', href: '/materiales/piedra' },
    { key: 'metales', href: '/materiales/metales' },
    { key: 'textiles', href: '/materiales/textiles' },
  ],
  servicios: [
    { key: 'diseno', href: '/servicios/diseno' },
    { key: 'fabricacion', href: '/servicios/fabricacion' },
    { key: 'montaje', href: '/servicios/montaje' },
  ],
}
```

- [ ] **Step 3: Create i18n config**

```ts
// src/i18n/config.ts
import type { Locale } from '@/types'

export const locales: Locale[] = ['es', 'en', 'ru']
export const defaultLocale: Locale = 'es'
```

```ts
// src/i18n/routing.ts
import { defineRouting } from 'next-intl/routing'
import { locales, defaultLocale } from './config'

export const routing = defineRouting({
  locales,
  defaultLocale,
  localeDetection: true,
})
```

```ts
// src/i18n/request.ts
import { getRequestConfig } from 'next-intl/server'
import { routing } from './routing'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale
  if (!locale || !routing.locales.includes(locale as 'es' | 'en' | 'ru')) {
    locale = routing.defaultLocale
  }
  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  }
})
```

- [ ] **Step 4: Create middleware**

```ts
// src/middleware.ts
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

export default createMiddleware(routing)

export const config = {
  matcher: ['/((?!api|_next|_vercel|studio|.*\\..*).*)'],
}
```

- [ ] **Step 5: Create `src/messages/es.json`**

```json
{
  "nav": {
    "home": "Inicio",
    "projects": "Proyectos",
    "cocinas": "Cocinas",
    "vestidores": "Vestidores y Armarios",
    "muebles": "Muebles a medida",
    "integrales": "Proyectos Integrales",
    "materials": "Materiales",
    "maderas": "Maderas y Chapa",
    "piedra": "Piedra y Cerámica",
    "metales": "Metales y Herrajes",
    "textiles": "Textiles",
    "services": "Servicios",
    "diseno": "Diseño de Interiores",
    "fabricacion": "Fabricación Propia",
    "montaje": "Montaje y Logística",
    "blog": "Blog",
    "about": "Nosotros",
    "contact": "Contacto"
  },
  "hero": {
    "title": "Tu hogar, diseñado para ti. No para todos.",
    "subtitle": "Mueble a medida al precio que ya pagas. Valencia · España",
    "cta_primary": "Solicitar presupuesto",
    "cta_secondary": "Ver proyectos"
  },
  "utp": {
    "label": "Por qué elegirnos",
    "title": "El precio de IKEA. La pieza que sólo existe en tu casa.",
    "body": "Fabricamos a medida en Valencia. Sin catálogos, sin compromisos — sólo tu espacio, tus medidas, tu estilo. Por lo mismo que pagarías en cualquier tienda grande.",
    "stat1_value": "100%",
    "stat1_label": "A medida",
    "stat2_value": "+200",
    "stat2_label": "Proyectos en Valencia",
    "stat3_value": "3",
    "stat3_label": "Semanas de entrega"
  },
  "projects": {
    "title": "Proyectos recientes",
    "view_all": "Ver todos los proyectos",
    "filter_all": "Todos",
    "filter_cocinas": "Cocinas",
    "filter_vestidores": "Vestidores",
    "filter_muebles": "Muebles",
    "filter_integrales": "Integrales",
    "similar_cta": "Quiero un proyecto similar",
    "related": "Proyectos relacionados",
    "challenge": "El reto",
    "solution": "La solución",
    "materials_used": "Materiales utilizados"
  },
  "philosophy": {
    "label": "Nuestra filosofía",
    "title": "No vendemos muebles. Integramos espacios que duran toda la vida.",
    "body": "Cada proyecto empieza con escucha activa y termina con un espacio que refleja quién eres — no quién fabrica en serie."
  },
  "services": {
    "title": "Así trabajamos",
    "subtitle": "Del primer boceto a la instalación final",
    "step1": "Diseño",
    "step1_desc": "Visita, medidas, render 3D de tu espacio",
    "step2": "Fabricación",
    "step2_desc": "Taller propio en Valencia, materiales premium",
    "step3": "Montaje",
    "step3_desc": "Instalación en 3 semanas, garantía incluida"
  },
  "cta": {
    "label": "¿Listo para empezar?",
    "title": "Tu espacio perfecto empieza con una llamada.",
    "subtitle": "Consulta gratuita · Presupuesto sin compromiso",
    "primary": "Solicitar presupuesto",
    "whatsapp": "WhatsApp"
  },
  "contact": {
    "title": "Hablemos de tu proyecto",
    "subtitle": "Visítanos en Valencia o escríbenos. Respondemos en menos de 24h.",
    "form_name": "Nombre",
    "form_email": "Email",
    "form_phone": "Teléfono",
    "form_service": "Servicio de interés",
    "form_message": "Cuéntanos tu proyecto",
    "form_submit": "Enviar mensaje",
    "form_success": "¡Mensaje enviado! Te contactaremos pronto.",
    "form_error": "Error al enviar. Inténtalo de nuevo.",
    "service_diseno": "Diseño de Interiores",
    "service_fabricacion": "Fabricación",
    "service_montaje": "Montaje",
    "service_integral": "Proyecto Integral",
    "service_other": "Otro"
  },
  "about": {
    "title": "Quiénes somos",
    "subtitle": "Un equipo apasionado por el diseño y la artesanía valenciana.",
    "history_title": "Nuestra historia",
    "history_body": "ConceptoFino nació en Valencia con una misión clara: demostrar que el diseño a medida no es un lujo reservado a unos pocos. Con más de 15 años de experiencia y 200+ proyectos completados, hemos transformado cientos de hogares valencianos.",
    "reviews_title": "Lo que dicen nuestros clientes"
  },
  "blog": {
    "title": "Inspiración y consejos",
    "subtitle": "Ideas para tu hogar, tendencias de diseño y noticias de nuestro taller.",
    "read_more": "Leer más"
  },
  "materials": {
    "title": "Nuestros materiales",
    "subtitle": "Solo los mejores materiales para espacios que duran toda la vida.",
    "characteristics": "Características",
    "projects_with": "Proyectos con este material"
  },
  "footer": {
    "tagline": "Smart Integration & Timeless Design",
    "nav_title": "Navegación",
    "services_title": "Servicios",
    "contact_title": "Contacto",
    "copyright": "© 2024 ConceptoFino. Todos los derechos reservados.",
    "privacy": "Política de Privacidad",
    "legal": "Aviso Legal"
  },
  "lead_form": {
    "title": "¿Te interesa un proyecto similar?",
    "subtitle": "Cuéntanos y te hacemos un presupuesto en 24h.",
    "name": "Tu nombre",
    "phone": "Teléfono",
    "email": "Email",
    "submit": "Solicitar presupuesto",
    "success": "¡Recibido! Te contactaremos en menos de 24h.",
    "error": "Error al enviar. Prueba por WhatsApp."
  },
  "common": {
    "loading": "Cargando...",
    "close": "Cerrar",
    "open_menu": "Abrir menú",
    "close_menu": "Cerrar menú",
    "language": "Idioma",
    "back": "Volver",
    "see_more": "Ver más",
    "view_project": "Ver proyecto"
  }
}
```

- [ ] **Step 6: Create `src/messages/en.json`**

```json
{
  "nav": {
    "home": "Home",
    "projects": "Projects",
    "cocinas": "Kitchens",
    "vestidores": "Wardrobes",
    "muebles": "Custom Furniture",
    "integrales": "Complete Interiors",
    "materials": "Materials",
    "maderas": "Wood & Veneer",
    "piedra": "Stone & Ceramic",
    "metales": "Metals & Hardware",
    "textiles": "Textiles",
    "services": "Services",
    "diseno": "Interior Design",
    "fabricacion": "Manufacturing",
    "montaje": "Assembly & Logistics",
    "blog": "Blog",
    "about": "About Us",
    "contact": "Contact"
  },
  "hero": {
    "title": "Your home, designed for you. Not for everyone.",
    "subtitle": "Custom furniture at the price you already pay. Valencia · Spain",
    "cta_primary": "Request a quote",
    "cta_secondary": "View projects"
  },
  "utp": {
    "label": "Why choose us",
    "title": "The IKEA price. The piece that only exists in your home.",
    "body": "We manufacture to measure in Valencia. No catalogues, no compromises — just your space, your measurements, your style. For the same price you would pay at any big store.",
    "stat1_value": "100%",
    "stat1_label": "Custom made",
    "stat2_value": "+200",
    "stat2_label": "Projects in Valencia",
    "stat3_value": "3",
    "stat3_label": "Weeks delivery"
  },
  "projects": {
    "title": "Recent projects",
    "view_all": "View all projects",
    "filter_all": "All",
    "filter_cocinas": "Kitchens",
    "filter_vestidores": "Wardrobes",
    "filter_muebles": "Furniture",
    "filter_integrales": "Complete Interiors",
    "similar_cta": "I want a similar project",
    "related": "Related projects",
    "challenge": "The challenge",
    "solution": "The solution",
    "materials_used": "Materials used"
  },
  "philosophy": {
    "label": "Our philosophy",
    "title": "We don't sell furniture. We integrate spaces that last a lifetime.",
    "body": "Each project starts with active listening and ends with a space that reflects who you are — not who manufactures in series."
  },
  "services": {
    "title": "How we work",
    "subtitle": "From the first sketch to the final installation",
    "step1": "Design",
    "step1_desc": "Visit, measurements, 3D render of your space",
    "step2": "Manufacturing",
    "step2_desc": "Own workshop in Valencia, premium materials",
    "step3": "Assembly",
    "step3_desc": "Installation in 3 weeks, warranty included"
  },
  "cta": {
    "label": "Ready to start?",
    "title": "Your perfect space starts with a call.",
    "subtitle": "Free consultation · No-obligation quote",
    "primary": "Request a quote",
    "whatsapp": "WhatsApp"
  },
  "contact": {
    "title": "Let's talk about your project",
    "subtitle": "Visit us in Valencia or write to us. We reply within 24h.",
    "form_name": "Name",
    "form_email": "Email",
    "form_phone": "Phone",
    "form_service": "Service of interest",
    "form_message": "Tell us about your project",
    "form_submit": "Send message",
    "form_success": "Message sent! We will contact you soon.",
    "form_error": "Error sending. Please try again.",
    "service_diseno": "Interior Design",
    "service_fabricacion": "Manufacturing",
    "service_montaje": "Assembly",
    "service_integral": "Complete Project",
    "service_other": "Other"
  },
  "about": {
    "title": "Who we are",
    "subtitle": "A team passionate about design and Valencian craftsmanship.",
    "history_title": "Our story",
    "history_body": "ConceptoFino was born in Valencia with a clear mission: to prove that custom design is not a luxury reserved for a few. With over 15 years of experience and 200+ completed projects, we have transformed hundreds of Valencian homes.",
    "reviews_title": "What our clients say"
  },
  "blog": {
    "title": "Inspiration and advice",
    "subtitle": "Ideas for your home, design trends and news from our workshop.",
    "read_more": "Read more"
  },
  "materials": {
    "title": "Our materials",
    "subtitle": "Only the best materials for spaces that last a lifetime.",
    "characteristics": "Characteristics",
    "projects_with": "Projects using this material"
  },
  "footer": {
    "tagline": "Smart Integration & Timeless Design",
    "nav_title": "Navigation",
    "services_title": "Services",
    "contact_title": "Contact",
    "copyright": "© 2024 ConceptoFino. All rights reserved.",
    "privacy": "Privacy Policy",
    "legal": "Legal Notice"
  },
  "lead_form": {
    "title": "Interested in a similar project?",
    "subtitle": "Tell us and we'll give you a quote within 24h.",
    "name": "Your name",
    "phone": "Phone",
    "email": "Email",
    "submit": "Request a quote",
    "success": "Received! We will contact you within 24h.",
    "error": "Error sending. Try via WhatsApp."
  },
  "common": {
    "loading": "Loading...",
    "close": "Close",
    "open_menu": "Open menu",
    "close_menu": "Close menu",
    "language": "Language",
    "back": "Back",
    "see_more": "See more",
    "view_project": "View project"
  }
}
```

- [ ] **Step 7: Create `src/messages/ru.json`**

```json
{
  "nav": {
    "home": "Главная",
    "projects": "Проекты",
    "cocinas": "Кухни",
    "vestidores": "Гардеробные и шкафы",
    "muebles": "Мебель на заказ",
    "integrales": "Полные интерьеры",
    "materials": "Материалы",
    "maderas": "Дерево и шпон",
    "piedra": "Камень и керамика",
    "metales": "Металл и фурнитура",
    "textiles": "Текстиль",
    "services": "Услуги",
    "diseno": "Дизайн интерьера",
    "fabricacion": "Производство",
    "montaje": "Монтаж и логистика",
    "blog": "Блог",
    "about": "О нас",
    "contact": "Контакты"
  },
  "hero": {
    "title": "Ваш дом, созданный для вас. Не для всех.",
    "subtitle": "Мебель на заказ по цене, которую вы уже готовы платить. Валенсия · Испания",
    "cta_primary": "Запросить смету",
    "cta_secondary": "Смотреть проекты"
  },
  "utp": {
    "label": "Почему мы",
    "title": "Цена IKEA. Мебель, которая есть только в вашем доме.",
    "body": "Производим на заказ в Валенсии. Без каталогов, без компромиссов — только ваше пространство, ваши размеры, ваш стиль. За ту же цену, что вы заплатили бы в любом крупном магазине.",
    "stat1_value": "100%",
    "stat1_label": "На заказ",
    "stat2_value": "+200",
    "stat2_label": "Проектов в Валенсии",
    "stat3_value": "3",
    "stat3_label": "Недели доставки"
  },
  "projects": {
    "title": "Последние проекты",
    "view_all": "Смотреть все проекты",
    "filter_all": "Все",
    "filter_cocinas": "Кухни",
    "filter_vestidores": "Гардеробные",
    "filter_muebles": "Мебель",
    "filter_integrales": "Полные интерьеры",
    "similar_cta": "Хочу похожий проект",
    "related": "Похожие проекты",
    "challenge": "Задача",
    "solution": "Решение",
    "materials_used": "Использованные материалы"
  },
  "philosophy": {
    "label": "Наша философия",
    "title": "Мы не продаём мебель. Мы интегрируем пространства на всю жизнь.",
    "body": "Каждый проект начинается с активного слушания и заканчивается пространством, которое отражает то, кто вы есть — а не то, что производят серийно."
  },
  "services": {
    "title": "Как мы работаем",
    "subtitle": "От первого эскиза до финальной установки",
    "step1": "Дизайн",
    "step1_desc": "Визит, замеры, 3D-рендер вашего пространства",
    "step2": "Производство",
    "step2_desc": "Собственная мастерская в Валенсии, премиальные материалы",
    "step3": "Монтаж",
    "step3_desc": "Установка за 3 недели, гарантия включена"
  },
  "cta": {
    "label": "Готовы начать?",
    "title": "Ваше идеальное пространство начинается с одного звонка.",
    "subtitle": "Бесплатная консультация · Смета без обязательств",
    "primary": "Запросить смету",
    "whatsapp": "WhatsApp"
  },
  "contact": {
    "title": "Расскажите нам о вашем проекте",
    "subtitle": "Посетите нас в Валенсии или напишите нам. Отвечаем в течение 24ч.",
    "form_name": "Имя",
    "form_email": "Email",
    "form_phone": "Телефон",
    "form_service": "Интересующая услуга",
    "form_message": "Расскажите о вашем проекте",
    "form_submit": "Отправить сообщение",
    "form_success": "Сообщение отправлено! Мы свяжемся с вами.",
    "form_error": "Ошибка отправки. Попробуйте ещё раз.",
    "service_diseno": "Дизайн интерьера",
    "service_fabricacion": "Производство",
    "service_montaje": "Монтаж",
    "service_integral": "Полный проект",
    "service_other": "Другое"
  },
  "about": {
    "title": "Кто мы",
    "subtitle": "Команда, влюблённая в дизайн и валенсийское мастерство.",
    "history_title": "Наша история",
    "history_body": "ConceptoFino родился в Валенсии с чёткой миссией: доказать, что дизайн на заказ — не роскошь для немногих. С более чем 15-летним опытом и 200+ завершёнными проектами мы трансформировали сотни валенсийских домов.",
    "reviews_title": "Что говорят наши клиенты"
  },
  "blog": {
    "title": "Вдохновение и советы",
    "subtitle": "Идеи для вашего дома, тренды дизайна и новости из нашей мастерской.",
    "read_more": "Читать далее"
  },
  "materials": {
    "title": "Наши материалы",
    "subtitle": "Только лучшие материалы для пространств, которые живут вечно.",
    "characteristics": "Характеристики",
    "projects_with": "Проекты с этим материалом"
  },
  "footer": {
    "tagline": "Smart Integration & Timeless Design",
    "nav_title": "Навигация",
    "services_title": "Услуги",
    "contact_title": "Контакты",
    "copyright": "© 2024 ConceptoFino. Все права защищены.",
    "privacy": "Политика конфиденциальности",
    "legal": "Правовое уведомление"
  },
  "lead_form": {
    "title": "Интересует похожий проект?",
    "subtitle": "Расскажите нам, и мы сделаем смету за 24ч.",
    "name": "Ваше имя",
    "phone": "Телефон",
    "email": "Email",
    "submit": "Запросить смету",
    "success": "Получено! Свяжемся с вами в течение 24ч.",
    "error": "Ошибка отправки. Напишите в WhatsApp."
  },
  "common": {
    "loading": "Загрузка...",
    "close": "Закрыть",
    "open_menu": "Открыть меню",
    "close_menu": "Закрыть меню",
    "language": "Язык",
    "back": "Назад",
    "see_more": "Подробнее",
    "view_project": "Смотреть проект"
  }
}
```

- [ ] **Step 8: Commit**

```bash
git add src/lib/utils.ts src/lib/constants.ts src/i18n/ src/middleware.ts src/messages/
git commit -m "feat: add utils, constants, next-intl config and all i18n messages"
```

---

## Task 6: Root Layouts & Font Setup

**Files:**
- Modify: `src/app/layout.tsx`
- Create: `src/app/[locale]/layout.tsx`, `src/app/[locale]/page.tsx` (stub)

- [ ] **Step 1: Update root `src/app/layout.tsx`**

```tsx
// src/app/layout.tsx
import type { Metadata } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin', 'cyrillic'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://conceptofino.com'
  ),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html suppressHydrationWarning>
      <body className={`${cormorant.variable} ${inter.variable}`}>
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Create `src/app/[locale]/layout.tsx`**

```tsx
// src/app/[locale]/layout.tsx
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import type { Locale } from '@/types'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import WhatsAppButton from '@/components/layout/WhatsAppButton'
import SmoothScroll from '@/components/ui/SmoothScroll'

interface Props {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!routing.locales.includes(locale as Locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <SmoothScroll>
        <Header locale={locale as Locale} />
        <main>{children}</main>
        <Footer locale={locale as Locale} />
        <WhatsAppButton locale={locale as Locale} />
      </SmoothScroll>
    </NextIntlClientProvider>
  )
}
```

- [ ] **Step 3: Create stub `src/app/[locale]/page.tsx`**

```tsx
// src/app/[locale]/page.tsx
export default function HomePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-cream">
      <p className="font-serif text-2xl text-brand-black">ConceptoFino — coming soon</p>
    </div>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/app/
git commit -m "feat: set up root and locale layouts with font loading"
```

---

## Task 7: UI Primitives

**Files:**
- Create: `src/components/ui/Button.tsx`, `src/components/ui/SectionHeading.tsx`, `src/components/ui/RevealOnScroll.tsx`, `src/components/ui/SmoothScroll.tsx`, `src/components/ui/Loader.tsx`

- [ ] **Step 1: Create `src/components/ui/Button.tsx`**

```tsx
// src/components/ui/Button.tsx
'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
  asChild?: boolean
  href?: string
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-brand-accent text-white hover:bg-brand-dark transition-colors duration-300',
  secondary:
    'bg-brand-black text-brand-cream hover:bg-brand-dark transition-colors duration-300',
  ghost:
    'text-brand-black hover:text-brand-accent transition-colors duration-300',
  outline:
    'border border-brand-black text-brand-black hover:bg-brand-black hover:text-brand-cream transition-colors duration-300',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-4 py-2 text-xs tracking-widest uppercase',
  md: 'px-6 py-3 text-xs tracking-widest uppercase',
  lg: 'px-8 py-4 text-sm tracking-widest uppercase',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-sans font-medium focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
```

- [ ] **Step 2: Create `src/components/ui/SectionHeading.tsx`**

```tsx
// src/components/ui/SectionHeading.tsx
import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  label?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
  light?: boolean
  className?: string
}

export default function SectionHeading({
  label,
  title,
  subtitle,
  align = 'left',
  light = false,
  className,
}: SectionHeadingProps) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align]

  return (
    <div className={cn('space-y-3', alignClass, className)}>
      {label && (
        <p
          className={cn(
            'text-xs font-sans tracking-[0.2em] uppercase',
            light ? 'text-brand-accent' : 'text-brand-accent'
          )}
        >
          {label}
        </p>
      )}
      <h2
        className={cn(
          'font-serif leading-tight',
          'text-3xl sm:text-4xl lg:text-5xl',
          light ? 'text-brand-cream' : 'text-brand-black'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'font-sans text-base leading-relaxed max-w-2xl',
            align === 'center' ? 'mx-auto' : '',
            light ? 'text-brand-cream/60' : 'text-brand-gray'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
```

- [ ] **Step 3: Create `src/components/ui/RevealOnScroll.tsx`**

```tsx
// src/components/ui/RevealOnScroll.tsx
'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

interface RevealOnScrollProps {
  children: ReactNode
  delay?: number
  direction?: 'up' | 'down' | 'left' | 'right' | 'none'
  className?: string
}

export default function RevealOnScroll({
  children,
  delay = 0,
  direction = 'up',
  className,
}: RevealOnScrollProps) {
  const shouldReduceMotion = useReducedMotion()

  const directionOffset = {
    up: { y: 40, x: 0 },
    down: { y: -40, x: 0 },
    left: { x: 40, y: 0 },
    right: { x: -40, y: 0 },
    none: { x: 0, y: 0 },
  }[direction]

  const initial = shouldReduceMotion
    ? { opacity: 0 }
    : { opacity: 0, ...directionOffset }

  const animate = { opacity: 1, x: 0, y: 0 }

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: shouldReduceMotion ? 0.2 : 0.7,
        delay: shouldReduceMotion ? 0 : delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
```

- [ ] **Step 4: Create `src/components/ui/SmoothScroll.tsx`**

```tsx
// src/components/ui/SmoothScroll.tsx
'use client'

import { ReactLenis } from 'lenis/react'
import type { ReactNode } from 'react'

export default function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.2, smoothWheel: true }}>
      {children}
    </ReactLenis>
  )
}
```

- [ ] **Step 5: Create `src/components/ui/Loader.tsx`**

```tsx
// src/components/ui/Loader.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Loader() {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(false), 1800)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-brand-cream"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-center"
          >
            <p className="font-serif text-2xl text-brand-black tracking-[0.15em]">
              ConceptoFino
            </p>
            <motion.div
              className="h-px bg-brand-accent mt-4 mx-auto"
              initial={{ width: 0 }}
              animate={{ width: 80 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 6: Commit**

```bash
git add src/components/ui/
git commit -m "feat: add UI primitives — Button, SectionHeading, RevealOnScroll, SmoothScroll, Loader"
```

---

## Task 8: Header Component

**Files:**
- Create: `src/components/layout/Header.tsx`, `src/components/layout/MobileMenu.tsx`, `src/components/layout/LanguageSwitcher.tsx`

- [ ] **Step 1: Create `src/components/layout/LanguageSwitcher.tsx`**

```tsx
// src/components/layout/LanguageSwitcher.tsx
'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import type { Locale } from '@/types'
import { cn } from '@/lib/utils'

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
]

interface Props {
  light?: boolean
}

export default function LanguageSwitcher({ light = false }: Props) {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(newLocale: Locale) {
    // Replace locale segment in path
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`
    router.push(newPath)
  }

  return (
    <div className="flex items-center gap-1" aria-label="Language switcher">
      {LOCALES.map((loc, i) => (
        <span key={loc.code} className="flex items-center">
          <button
            onClick={() => switchLocale(loc.code)}
            aria-label={`Switch to ${loc.label}`}
            aria-current={locale === loc.code ? 'true' : undefined}
            className={cn(
              'font-sans text-[10px] tracking-[0.12em] uppercase transition-colors duration-200',
              locale === loc.code
                ? light
                  ? 'text-brand-accent'
                  : 'text-brand-accent'
                : light
                ? 'text-brand-cream/40 hover:text-brand-cream/70'
                : 'text-brand-gray hover:text-brand-black'
            )}
          >
            {loc.label}
          </button>
          {i < LOCALES.length - 1 && (
            <span
              className={cn(
                'mx-1.5 text-[8px]',
                light ? 'text-brand-cream/20' : 'text-brand-gray/40'
              )}
            >
              ·
            </span>
          )}
        </span>
      ))}
    </div>
  )
}
```

- [ ] **Step 2: Create `src/components/layout/MobileMenu.tsx`**

```tsx
// src/components/layout/MobileMenu.tsx
'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ChevronDown, X } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/constants'
import type { Locale } from '@/types'
import LanguageSwitcher from './LanguageSwitcher'

interface Props {
  isOpen: boolean
  onClose: () => void
  locale: Locale
}

type AccordionKey = keyof typeof NAV_ITEMS

export default function MobileMenu({ isOpen, onClose, locale }: Props) {
  const t = useTranslations('nav')
  const [openSection, setOpenSection] = useState<AccordionKey | null>(null)

  const sections: { key: AccordionKey; label: string }[] = [
    { key: 'proyectos', label: t('projects') },
    { key: 'materiales', label: t('materials') },
    { key: 'servicios', label: t('services') },
  ]

  const topLinks = [
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}/nosotros`, label: t('about') },
    { href: `/${locale}/contacto`, label: t('contact') },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-brand-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-brand-cream flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-light">
              <span className="font-serif text-lg text-brand-black tracking-wide">
                ConceptoFino
              </span>
              <button
                onClick={onClose}
                aria-label={t('close_menu' as never) ?? 'Close menu'}
                className="p-2 text-brand-gray hover:text-brand-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Nav */}
            <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-1">
              {/* Accordion sections */}
              {sections.map((section) => (
                <div key={section.key} className="border-b border-brand-light pb-1">
                  <button
                    onClick={() =>
                      setOpenSection(
                        openSection === section.key ? null : section.key
                      )
                    }
                    className="flex w-full items-center justify-between py-3 font-sans text-sm text-brand-black tracking-wide"
                    aria-expanded={openSection === section.key}
                  >
                    {section.label}
                    <motion.span
                      animate={{ rotate: openSection === section.key ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={16} className="text-brand-gray" />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {openSection === section.key && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <ul className="pb-2 space-y-1">
                          {NAV_ITEMS[section.key].map((item) => (
                            <li key={item.href}>
                              <Link
                                href={`/${locale}${item.href}`}
                                onClick={onClose}
                                className="block py-2 pl-3 font-sans text-sm text-brand-gray hover:text-brand-accent transition-colors"
                              >
                                {t(item.key as Parameters<typeof t>[0])}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* Top links */}
              {topLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="block py-3 border-b border-brand-light font-sans text-sm text-brand-black hover:text-brand-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Footer */}
            <div className="px-6 py-5 border-t border-brand-light space-y-3">
              <a
                href="tel:+34657575939"
                className="block font-sans text-sm text-brand-black tracking-wide"
              >
                +34 657 575 939
              </a>
              <LanguageSwitcher />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 3: Create `src/components/layout/Header.tsx`**

```tsx
// src/components/layout/Header.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, ChevronDown } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/constants'
import type { Locale } from '@/types'
import LanguageSwitcher from './LanguageSwitcher'
import MobileMenu from './MobileMenu'
import { cn } from '@/lib/utils'

interface Props {
  locale: Locale
}

type DropdownKey = keyof typeof NAV_ITEMS

export default function Header({ locale }: Props) {
  const t = useTranslations('nav')
  const [isVisible, setIsVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey | null>(null)
  const lastScrollY = useRef(0)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY
      setIsScrolled(currentY > 50)
      setIsVisible(currentY < lastScrollY.current || currentY < 100)
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function openDropdown(key: DropdownKey) {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setActiveDropdown(key)
  }

  function scheduleClose() {
    closeTimerRef.current = setTimeout(() => setActiveDropdown(null), 150)
  }

  const navSections: { key: DropdownKey; label: string }[] = [
    { key: 'proyectos', label: t('projects') },
    { key: 'materiales', label: t('materials') },
    { key: 'servicios', label: t('services') },
  ]

  const simpleLinks = [
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}/nosotros`, label: t('about') },
    { href: `/${locale}/contacto`, label: t('contact') },
  ]

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-30 transition-all duration-300',
          isScrolled
            ? 'bg-white/80 backdrop-blur-md border-b border-brand-light/50 shadow-sm'
            : 'bg-transparent'
        )}
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link
              href={`/${locale}`}
              className="font-serif text-xl text-brand-black tracking-wide hover:text-brand-accent transition-colors"
            >
              ConceptoFino
            </Link>

            {/* Desktop nav */}
            <nav className="hidden lg:flex items-center gap-6">
              {navSections.map((section) => (
                <div
                  key={section.key}
                  className="relative"
                  onMouseEnter={() => openDropdown(section.key)}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    className="flex items-center gap-1 font-sans text-xs tracking-[0.1em] uppercase text-brand-dark hover:text-brand-accent transition-colors duration-200"
                    aria-expanded={activeDropdown === section.key}
                    aria-haspopup="true"
                  >
                    {section.label}
                    <ChevronDown size={12} />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === section.key && (
                      <motion.div
                        className="absolute top-full left-0 mt-2 w-52 bg-white border border-brand-light shadow-lg"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        onMouseEnter={() => openDropdown(section.key)}
                        onMouseLeave={scheduleClose}
                      >
                        <ul className="py-2">
                          {NAV_ITEMS[section.key].map((item) => (
                            <li key={item.href}>
                              <Link
                                href={`/${locale}${item.href}`}
                                className="block px-4 py-2.5 font-sans text-xs tracking-wide text-brand-dark hover:text-brand-accent hover:bg-brand-cream transition-colors duration-150"
                              >
                                {t(item.key as Parameters<typeof t>[0])}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {simpleLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans text-xs tracking-[0.1em] uppercase text-brand-dark hover:text-brand-accent transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right side */}
            <div className="hidden lg:flex items-center gap-5">
              <a
                href="tel:+34657575939"
                className="font-sans text-xs text-brand-gray hover:text-brand-black transition-colors tracking-wide"
              >
                +34 657 575 939
              </a>
              <LanguageSwitcher />
            </div>

            {/* Mobile burger */}
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-brand-black"
              aria-label={t('open_menu' as never) ?? 'Open menu'}
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        locale={locale}
      />
    </>
  )
}
```

- [ ] **Step 4: Commit**

```bash
git add src/components/layout/Header.tsx src/components/layout/MobileMenu.tsx src/components/layout/LanguageSwitcher.tsx
git commit -m "feat: add Header with dropdown navigation, mobile drawer and language switcher"
```

---

## Task 9: Footer & WhatsApp Button

**Files:**
- Create: `src/components/layout/Footer.tsx`, `src/components/layout/WhatsAppButton.tsx`

- [ ] **Step 1: Create `src/components/layout/Footer.tsx`**

```tsx
// src/components/layout/Footer.tsx
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Instagram, Facebook, Phone, Mail, MapPin } from 'lucide-react'
import { getSiteSettings } from '@/lib/content'
import { getLocalizedField } from '@/lib/utils'
import type { Locale } from '@/types'

interface Props {
  locale: Locale
}

export default async function Footer({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'footer' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const settings = await getSiteSettings()

  const navLinks = [
    { href: `/${locale}/proyectos`, label: tNav('projects') },
    { href: `/${locale}/materiales`, label: tNav('materials') },
    { href: `/${locale}/blog`, label: tNav('blog') },
    { href: `/${locale}/nosotros`, label: tNav('about') },
    { href: `/${locale}/contacto`, label: tNav('contact') },
  ]

  const serviceLinks = [
    { href: `/${locale}/servicios/diseno`, label: tNav('diseno') },
    { href: `/${locale}/servicios/fabricacion`, label: tNav('fabricacion') },
    { href: `/${locale}/servicios/montaje`, label: tNav('montaje') },
  ]

  return (
    <footer className="bg-brand-black text-brand-cream/70">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          {/* Brand */}
          <div className="lg:col-span-1">
            <p className="font-serif text-xl text-brand-cream tracking-wide mb-2">
              ConceptoFino
            </p>
            <p className="font-sans text-xs tracking-[0.12em] text-brand-accent uppercase mb-5">
              {t('tagline')}
            </p>
            {/* Social */}
            <div className="flex items-center gap-4">
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-brand-cream/40 hover:text-brand-accent transition-colors"
              >
                <Instagram size={18} />
              </a>
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-brand-cream/40 hover:text-brand-accent transition-colors"
              >
                <Phone size={18} />
              </a>
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-brand-cream/40 hover:text-brand-accent transition-colors"
              >
                <Facebook size={18} />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <p className="font-sans text-xs tracking-[0.15em] uppercase text-brand-cream mb-4">
              {t('nav_title')}
            </p>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-brand-cream/60 hover:text-brand-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <p className="font-sans text-xs tracking-[0.15em] uppercase text-brand-cream mb-4">
              {t('services_title')}
            </p>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-brand-cream/60 hover:text-brand-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="font-sans text-xs tracking-[0.15em] uppercase text-brand-cream mb-4">
              {t('contact_title')}
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-brand-accent mt-0.5 flex-shrink-0" />
                <span className="font-sans text-sm text-brand-cream/60 leading-relaxed">
                  {getLocalizedField(settings.address, locale)}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-brand-accent flex-shrink-0" />
                <a
                  href={`tel:${settings.phone.replace(/\s/g, '')}`}
                  className="font-sans text-sm text-brand-cream/60 hover:text-brand-accent transition-colors"
                >
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-brand-accent flex-shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="font-sans text-sm text-brand-cream/60 hover:text-brand-accent transition-colors"
                >
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-brand-dark flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-sans text-xs text-brand-cream/30">
            {t('copyright')}
          </p>
          <div className="flex items-center gap-5">
            <Link
              href={`/${locale}/privacidad`}
              className="font-sans text-xs text-brand-cream/30 hover:text-brand-accent transition-colors"
            >
              {t('privacy')}
            </Link>
            <Link
              href={`/${locale}/aviso-legal`}
              className="font-sans text-xs text-brand-cream/30 hover:text-brand-accent transition-colors"
            >
              {t('legal')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
```

- [ ] **Step 2: Create `src/components/layout/WhatsAppButton.tsx`**

```tsx
// src/components/layout/WhatsAppButton.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGES } from '@/lib/constants'
import type { Locale } from '@/types'

interface Props {
  locale: Locale
}

export default function WhatsAppButton({ locale }: Props) {
  const [isVisible, setIsVisible] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const lastScrollY = useRef(0)

  // Appear after 3s
  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY
      setIsVisible(currentY < lastScrollY.current || currentY < 200)
      lastScrollY.current = currentY
    }
    setIsVisible(true)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const message = encodeURIComponent(WHATSAPP_MESSAGES[locale])
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`

  return (
    <AnimatePresence>
      {showButton && isVisible && (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white shadow-lg hover:bg-[#1ebe5d] transition-colors duration-300 rounded-full"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle size={26} fill="white" />
        </motion.a>
      )}
    </AnimatePresence>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add src/components/layout/Footer.tsx src/components/layout/WhatsAppButton.tsx
git commit -m "feat: add Footer with full navigation and WhatsApp floating button"
```

---

## Task 10: Verify Foundation

- [ ] **Step 1: Start dev server**

```bash
pnpm dev
```

- [ ] **Step 2: Verify routes**

Open browser and check:
- `http://localhost:3000` — redirects to `/es`
- `http://localhost:3000/es` — shows stub page with Header and Footer
- `http://localhost:3000/en` — shows English version
- `http://localhost:3000/ru` — shows Russian version
- Header dropdown works on desktop
- Mobile menu opens and closes
- WhatsApp button appears after 3s
- Language switcher changes locale

Expected: All routes work, no TypeScript errors in console, fonts load correctly.

- [ ] **Step 3: Run tests one final time**

```bash
pnpm test
```

Expected: 6 tests pass.

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: verify foundation — all routes, layout and tests passing"
```

---

**Plan 1 complete.** The project now has:
- Full dependency set installed
- TypeScript interfaces for all content types
- Rich mock data in ES/EN/RU for 5 projects, 4 materials, 3 services, 3 team members, 4 reviews
- Content abstraction layer with async API (Sanity-migration-ready)
- Full i18n setup with all UI strings in 3 languages
- Header (desktop dropdowns + mobile drawer)
- Footer
- WhatsApp floating button
- UI primitives (Button, SectionHeading, RevealOnScroll, SmoothScroll, Loader)

**Proceed to Plan 2 for all page implementations.**
