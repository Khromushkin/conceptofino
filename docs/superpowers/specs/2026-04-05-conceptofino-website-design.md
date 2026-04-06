# ConceptoFino Website — Design Specification
**Date:** 2026-04-05  
**Status:** Approved  
**Approach:** Visual-first (hardcoded data → Sanity migration later)

---

## 1. Project Overview

**Company:** ConceptoFino — interior design and custom furniture, Valencia, Spain.

**Core UTP:** «За те же деньги, что в IKEA — делаем индивидуально, на заказ, красиво и встроенно в интерьер.»  
→ Сайт должен явно говорить: «Ты уже готов платить столько — заплати столько же, но получи своё».

**Target audience:** Частные владельцы недвижимости в Испании, дизайнеры, инвесторы в премиальное жильё.

**Languages:** ES (default) · EN · RU

**Reference:** corston.eu — уровень визуального качества и анимаций.

---

## 2. Visual Identity

### Style
- «Тихая роскошь» (quiet luxury) с тёплой редакционной подачей. Тон — approachable, не холодно-премиальный.
- Много воздуха, акцент на фотографии, минимализм без аскетизма.

### Color Palette
```
brand-black:  #1a1a1a  — основной текст
brand-dark:   #2d2d2d  — вторичный текст
brand-gray:   #8a8a8a  — подписи
brand-light:  #f5f3f0  — фон секций (тёплый бежевый)
brand-cream:  #faf8f5  — альтернативный фон
brand-white:  #ffffff  — основной фон
brand-accent: #b8a088  — акцент (тёплое золото/бронза)
```

### Typography
- **Заголовки:** Cormorant Garamond (serif) — H1: 56–72px, H2: 40–48px, H3: 28–32px
- **Текст:** Inter (sans-serif) — Body: 16–18px
- Letter-spacing заголовков: 0.02–0.05em
- Подключение: `next/font/google`

---

## 3. Architecture

### 3.1 Data Layer Abstraction
Все компоненты импортируют данные через `@/lib/content` — единую абстракцию:

```
src/
  data/               ← Visual-first фаза: TypeScript объекты с Unsplash фото
    projects.ts
    materials.ts
    services.ts
    team.ts
    reviews.ts
    site-settings.ts
  lib/
    content/
      index.ts        ← экспортирует функции: getProjects(), getProjectBySlug(), etc.
      projects.ts     ← сейчас читает из src/data/, потом из Sanity — без изменений в компонентах
      materials.ts
      ...
  types/
    index.ts          ← TypeScript интерфейсы = будущие Sanity схемы 1:1
```

**Принцип:** компоненты никогда не знают источник данных. Миграция на Sanity = замена реализации в `src/lib/content/`, не рефакторинг компонентов.

### 3.2 Project Structure
```
conceptofino/
├── src/
│   ├── app/
│   │   ├── [locale]/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                    # Главная
│   │   │   ├── proyectos/
│   │   │   │   ├── page.tsx                # Портфолио с фильтрацией
│   │   │   │   ├── [slug]/page.tsx         # Страница проекта
│   │   │   │   ├── cocinas/page.tsx
│   │   │   │   ├── vestidores/page.tsx
│   │   │   │   ├── muebles/page.tsx
│   │   │   │   └── integrales/page.tsx
│   │   │   ├── materiales/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── maderas/page.tsx
│   │   │   │   ├── piedra/page.tsx
│   │   │   │   ├── metales/page.tsx
│   │   │   │   └── textiles/page.tsx
│   │   │   ├── servicios/
│   │   │   │   ├── page.tsx
│   │   │   │   ├── diseno/page.tsx
│   │   │   │   ├── fabricacion/page.tsx
│   │   │   │   └── montaje/page.tsx
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx
│   │   │   ├── nosotros/page.tsx
│   │   │   └── contacto/page.tsx
│   │   ├── api/
│   │   │   ├── contact/route.ts
│   │   │   └── lead/route.ts
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/           # (структура по промпту)
│   ├── data/                 # Visual-first данные
│   ├── lib/
│   │   ├── content/          # Абстракция данных
│   │   ├── utils.ts
│   │   └── constants.ts
│   ├── messages/
│   │   ├── es.json
│   │   ├── en.json
│   │   └── ru.json
│   ├── hooks/
│   └── types/
├── sanity/                   # Подготовленные схемы (для будущей миграции)
├── scripts/scraper/
├── public/
├── next.config.ts
├── tailwind.config.ts
└── .env.example
```

### 3.3 Tech Stack
```
Frontend:     Next.js 14 (App Router) + React 18 + TypeScript (strict)
Styling:      Tailwind CSS 3.4 (только Tailwind, никаких inline styles)
Animations:   Framer Motion + GSAP (dynamic import, no SSR)
Smooth Scroll: Lenis
i18n:         next-intl (routes: /es, /en, /ru + browser detection)
Forms:        React Hook Form + Zod → API Route → Resend SDK
Images:       next/image, WebP, blur placeholder, Unsplash в dev
Icons:        Lucide React
SEO:          next-sitemap
Hosting:      Vercel
```

---

## 4. Pages & Sections

### 4.1 Home Page (`/`)

**Секция 1 — Hero (Cinematic Slider)**
- Fullscreen фото-слайдер (5 фото), Ken Burns эффект на каждом
- Тёмный overlay с градиентом снизу
- GSAP SplitText reveal заголовка при загрузке
- Заголовок: *«Tu hogar, diseñado para ti. No para todos.»*
- Подзаголовок: *«Mueble a medida al precio que ya pagas. Valencia · España»*
- CTA: «Solicitar presupuesto» (primary) + «Ver proyectos ↓» (text)
- Счётчик слайдов: 01 / 05
- Scroll indicator внизу

**Секция 2 — «Por qué no IKEA» (добавлено сверх промпта)**
- Прямое обращение к УТП
- Заголовок: *«El precio de IKEA. La pieza que sólo existe en tu casa.»*
- 3 цифры с counter animation (GSAP при входе в viewport):
  - `100%` — A medida
  - `+200` — Proyectos en Valencia
  - `3` — Semanas de entrega
- Текст: объяснение ценностного предложения

**Секция 3 — Избранные проекты**
- 3–4 проекта, горизонтальные строки (выбор C): 1 широкий + 2 узких рядами
- Hover: zoom фото + dark overlay с названием и категорией
- Stagger reveal при скролле (Framer Motion)
- Ссылка «Ver todos los proyectos →»

**Секция 4 — Философия**
- Заголовок: *«No vendemos muebles. Integramos espacios que duran toda la vida.»*
- GSAP SplitText scrub при скролле
- Атмосферное фото слева, текст справа

**Секция 5 — Услуги (кратко)**
- 3 шага: Diseño (01) → Fabricación (02) → Montaje (03)
- Иконки в круге с акцентным цветом
- Ссылки на `/servicios`

**Секция 6 — CTA финальный**
- Тёмный фон (#1a1a1a) с тёплым тонким overlay
- *«Tu espacio perfecto empieza con una llamada.»*
- Два CTA: «Solicitar presupuesto» + «💬 WhatsApp»

### 4.2 Portfolio (`/proyectos`)
- Фильтры: Todos / Cocinas / Vestidores / Muebles / Integrales
- Анимация фильтрации: Framer Motion `layout` animation
- Сетка: горизонтальные строки — чередование 1 wide + 2 narrow
- Карточка: фото → hover: zoom + overlay с именем и категорией
- Lazy load + blur placeholder

**Страница проекта (`/proyectos/[slug]`)**
- Hero: крупное фото на весь экран
- Описание задачи и решения
- Галерея: lightbox-сетка (dynamic import)
- Использованные материалы со ссылками
- CTA «Quiero un proyecto similar» → мини-форма
- Sidebar: другие проекты той же категории

### 4.3 Materials (`/materiales`)
- Визуальный каталог: крупные текстурные фото
- Категории: Maderas / Piedra / Metales / Textiles
- При клике: страница с характеристиками и фото применения

### 4.4 Services (`/servicios`)
- Таймлайн этапов: Замер → Дизайн → Производство → Монтаж
- Каждый этап: иконка + заголовок + описание + фото
- CTA внизу каждой подстраницы

### 4.5 Blog (`/blog`)
- Сетка: фото + заголовок + дата + категория + превью
- Страница статьи: hero, rich-text, related posts
- SEO: `Article` JSON-LD

### 4.6 About (`/nosotros`)
- История бренда (текст + фото)
- Команда: фото + имя + должность
- Карусель отзывов (Framer Motion)

### 4.7 Contact (`/contacto`)
- Адрес, телефон `<a href="tel:+34657575939">`, email
- Google Maps embed (iframe)
- Форма: Nombre, Email, Teléfono, Servicio (select), Mensaje
- Validation: Zod + React Hook Form
- Submit → API Route → Resend
- Success/Error states с Framer Motion

---

## 5. Layout Components

### Header
- `bg-white/50 backdrop-blur-md` + `fixed top-0`
- Hide on scroll down / show on scroll up (GSAP ScrollTrigger)
- Desktop: лого + nav (с dropdown) + контакты + языковой переключатель
- Dropdown: Framer Motion fade + slide down, закрытие с задержкой
- Mobile: бургер → drawer с аккордеоном (Framer Motion)

### WhatsApp Floating Button
- Фиксированный, правый нижний угол
- Появляется через 3с (Framer Motion delay)
- Скрывается при scroll down, появляется при scroll up
- URL: `https://wa.me/34657575939?text=Hola, me interesa...` (локализованный текст)

### Footer
- 4 колонки: лого + слоган / навигация / услуги / контакты
- Соцсети: Instagram, WhatsApp, Facebook
- Копирайт + Política de Privacidad + Aviso Legal

---

## 6. Animation Strategy

### Framer Motion
- Page transitions: `opacity` + `y: 20` fade-up
- Hover на карточках: scale(1.03) фото + overlay opacity
- Mobile menu: x-axis drawer
- Dropdown menus: y + opacity
- Stagger на сетках: `staggerChildren: 0.08`
- WhatsApp button: delayed appear

### GSAP + ScrollTrigger
- Hero: SplitText char-by-char reveal (stagger 0.03s)
- Ken Burns: scale 1.0 → 1.1 за 8с на каждом слайде
- Counter animation: 0 → target за 2с (секция УТП)
- Philosophy: SplitText scrub при скролле
- CTA background: parallax `yPercent: -20`
- Header: ScrollTrigger для hide/show

### Rules
- `prefers-reduced-motion`: все анимации отключены
- Mobile: убрать тяжёлый параллакс, упростить Ken Burns
- Dynamic import GSAP: `const gsap = await import('gsap')` — не в SSR

---

## 7. i18n

- `next-intl` с роутингом `/[locale]/...`
- Default locale: `es` (без редиректа — `/` = `/es`)
- Автоопределение: middleware читает `Accept-Language`
- `LanguageSwitcher`: сохраняет текущий path, меняет только locale, записывает в cookie
- UI-тексты: `messages/es.json`, `en.json`, `ru.json`
- Контентные данные: объекты `{ es: string, en: string, ru: string }` в `src/data/`
- Функция хелпер: `getLocalizedField(field, locale)` в `src/lib/utils.ts`

---

## 8. Forms & Lead Generation

### API Routes
- `POST /api/contact` — основная форма контактов
- `POST /api/lead` — «Хочу похожий проект»
- Оба: Zod validation → Resend SDK
- Fallback если `RESEND_API_KEY` не задан: `console.log(data)` — dev не блокируется

### Form Fields
**Основная (/contacto):** Nombre · Email · Teléfono · Servicio (select) · Mensaje  
**Лид (проект):** Nombre · Teléfono · Email + скрытое поле `projectSlug`  
**Modal CTA:** те же поля что основная

---

## 9. SEO

- `generateMetadata()` на каждой странице (title, description, OG, Twitter)
- `hreflang` links для ES/EN/RU на каждой странице
- JSON-LD: `Organization` + `LocalBusiness` в root layout; `BreadcrumbList` на внутренних; `Article` в блоге
- Sitemap: `next-sitemap` с поддержкой мультиязычных URL
- `robots.txt`: allow all, sitemap ref
- Canonical URLs через `metadataBase`
- Семантическая разметка: `<header>`, `<main>`, `<nav>`, `<article>`, `<section>`, `<aside>`

---

## 10. Performance Targets

- Lighthouse Performance > 90
- LCP < 2.5s
- All images: `next/image` + WebP + `blur` placeholder
- Hero slider: первый слайд — eager, остальные — lazy
- GSAP: dynamic import (no SSR)
- Галерея/Lightbox: dynamic import
- Шрифты: `next/font/google` (no layout shift)
- Video (если будет): autoplay muted loop, загрузка после first render

---

## 11. Scraper Scripts

`scripts/scraper/`:
- `instagram-scraper.ts` — Playwright, скачивает все фото из @conceptofino в `/output/instagram/`
- `whatsapp-catalog-scraper.ts` — Playwright, каталог WA Business
- `optimize-images.ts` — sharp: WebP конвертация, 3 размера (400/1200/2400px), blur placeholder base64

Логотип: извлечь из Instagram profile picture.

---

## 12. Sanity Schemas (prepared, не активированы)

Схемы в `sanity/schemas/` готовы к подключению:
- `project.ts` · `material.ts` · `service.ts` · `blogPost.ts`
- `teamMember.ts` · `review.ts` · `homePage.ts` · `siteSettings.ts`

Все локализуемые поля: `{ es: string, en: string, ru: string }`.  
Миграция: заменить `src/lib/content/*.ts` на GROQ-запросы к Sanity client.

---

## 13. Environment Variables

```env
# Email (Resend)
RESEND_API_KEY=
CONTACT_EMAIL_TO=info@conceptofino.com

# Site
NEXT_PUBLIC_SITE_URL=https://conceptofino.com
NEXT_PUBLIC_WHATSAPP_NUMBER=34657575939

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=

# Sanity (для будущей миграции)
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=

# Scraper
INSTAGRAM_USERNAME=
INSTAGRAM_PASSWORD=
```

---

## 14. Development Order

1. Init: `create-next-app`, TypeScript strict, Tailwind, структура папок
2. Types: `src/types/index.ts` — все интерфейсы
3. Mock data: `src/data/` — 5–6 проектов, материалы, услуги, команда, отзывы (Unsplash фото)
4. Content abstraction: `src/lib/content/`
5. Constants + i18n messages (ES/EN/RU)
6. UI компоненты: Button, SectionHeading, AnimatedText, RevealOnScroll, ParallaxImage, ImageLightbox, Loader, SmoothScroll
7. Layout: Header (desktop + mobile) + Footer + WhatsApp button
8. Главная страница (все 6 секций со всеми анимациями)
9. Portfolio: список + фильтрация + страница проекта с галереей
10. Materials: каталог + страницы
11. Services: таймлайн
12. Blog: список + статья
13. About: команда + отзывы
14. Contact: форма + карта
15. API Routes: contact + lead
16. SEO: metadata, JSON-LD, sitemap, robots
17. Sanity schemas (подготовить, не подключать)
18. Scraper scripts
19. Финальная оптимизация + Lighthouse audit
