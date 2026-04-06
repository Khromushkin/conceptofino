# CLAUDE CODE PROMPT — ConceptoFino Website

## РОЛЬ

Ты — Senior Full-Stack разработчик, специализирующийся на Next.js, React, Tailwind CSS и премиальных интерьерных сайтах. Ты создаёшь production-ready код с нуля, без компромиссов по качеству. Твоя задача — построить полноценный сайт для компании ConceptoFino (дизайн интерьера, мебель на заказ, Валенсия, Испания).

---

## 1. О ПРОЕКТЕ

- **Компания:** ConceptoFino
- **Сфера:** Дизайн интерьера, производство мебели на заказ, комплексные интерьерные решения
- **УТП:** «Мы предлагаем не просто мебель, а грамотную интеграцию предметов в пространство для долгосрочного комфорта и актуальности» (Smart Integration & Timeless Design)
- **Целевая аудитория:** Частные владельцы недвижимости в Испании (Валенсия и др.), дизайнеры, инвесторы в премиальное жильё
- **Языки:** Испанский (основной), Английский, Русский
- **Референс:** https://www.corston.eu/es-es — изучи этот сайт, возьми за основу уровень визуального качества, анимаций, подачи контента

---

## 2. ТЕХНИЧЕСКИЙ СТЕК

```
Frontend:        Next.js 14+ (App Router) + React 18+ + TypeScript
Стилизация:      Tailwind CSS 3.4+
Анимации:        Framer Motion + GSAP (ScrollTrigger, SplitText-эффекты)
CMS:             Sanity v3 (бесплатный план, удобная Sanity Studio)
i18n:            next-intl (маршруты /es, /en, /ru + автоопределение языка браузера)
Формы:           React Hook Form + Zod валидация → отправка через API Route (email через Resend или Nodemailer)
Карта:           Google Maps Embed (iframe) на странице контактов
Хостинг:         Vercel
Изображения:     next/image + формат WebP + Lazy Load + blur placeholder
Иконки:          Lucide React
```

---

## 3. СТРУКТУРА ПРОЕКТА

```
conceptofino/
├── src/
│   ├── app/
│   │   ├── [locale]/                    # next-intl locale routing
│   │   │   ├── layout.tsx               # Root layout с Header/Footer
│   │   │   ├── page.tsx                 # Главная (Home)
│   │   │   ├── proyectos/
│   │   │   │   ├── page.tsx             # Портфолио — сетка с фильтрацией
│   │   │   │   ├── [slug]/
│   │   │   │   │   └── page.tsx         # Страница отдельного проекта
│   │   │   │   ├── cocinas/page.tsx     # Кухни
│   │   │   │   ├── vestidores/page.tsx  # Гардеробные и шкафы
│   │   │   │   ├── muebles/page.tsx     # Индивидуальная мебель
│   │   │   │   └── integrales/page.tsx  # Полные интерьеры
│   │   │   ├── materiales/
│   │   │   │   ├── page.tsx             # Визуальный каталог материалов
│   │   │   │   ├── maderas/page.tsx     # Дерево и шпон
│   │   │   │   ├── piedra/page.tsx      # Камень и керамогранит
│   │   │   │   ├── metales/page.tsx     # Металл и фурнитура
│   │   │   │   └── textiles/page.tsx    # Текстиль
│   │   │   ├── servicios/
│   │   │   │   ├── page.tsx             # Услуги (общая)
│   │   │   │   ├── diseno/page.tsx      # Дизайн-проектирование
│   │   │   │   ├── fabricacion/page.tsx # Собственное производство
│   │   │   │   └── montaje/page.tsx     # Монтаж и логистика
│   │   │   ├── blog/
│   │   │   │   ├── page.tsx             # Список статей
│   │   │   │   └── [slug]/page.tsx      # Статья
│   │   │   ├── nosotros/page.tsx        # О нас + Отзывы
│   │   │   └── contacto/page.tsx        # Контакты
│   │   ├── api/
│   │   │   ├── contact/route.ts         # Обработка формы обратной связи
│   │   │   └── lead/route.ts            # Обработка «Хочу похожий проект»
│   │   ├── globals.css
│   │   └── layout.tsx
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx               # Шапка: лого, меню, контакты
│   │   │   ├── MobileMenu.tsx           # Бургер-меню с аккордеоном
│   │   │   ├── Footer.tsx               # Подвал
│   │   │   ├── LanguageSwitcher.tsx      # Переключатель ES/EN/RU
│   │   │   └── WhatsAppButton.tsx       # Фиксированная кнопка WhatsApp
│   │   ├── home/
│   │   │   ├── HeroSection.tsx          # Видео/слайдер + заголовок
│   │   │   ├── PhilosophySection.tsx    # Блок «Философия»
│   │   │   ├── FeaturedProjects.tsx     # 3-4 лучших проекта (превью)
│   │   │   ├── ServicesPreview.tsx      # Услуги кратко
│   │   │   └── CTASection.tsx           # «Запросить консультацию»
│   │   ├── projects/
│   │   │   ├── ProjectGrid.tsx          # Сетка проектов + фильтрация
│   │   │   ├── ProjectCard.tsx          # Карточка проекта
│   │   │   ├── ProjectGallery.tsx       # Галерея на странице проекта
│   │   │   └── SimilarProjectCTA.tsx    # «Хочу похожий проект»
│   │   ├── materials/
│   │   │   ├── MaterialGrid.tsx         # Визуальный каталог текстур
│   │   │   └── MaterialCard.tsx         # Карточка материала
│   │   ├── services/
│   │   │   └── ProcessSteps.tsx         # Этапы работы (от замера до установки)
│   │   ├── blog/
│   │   │   ├── BlogGrid.tsx             # Сетка статей
│   │   │   └── BlogCard.tsx             # Карточка статьи
│   │   ├── about/
│   │   │   ├── TeamSection.tsx          # Команда
│   │   │   └── ReviewsSection.tsx       # Отзывы клиентов
│   │   ├── contact/
│   │   │   ├── ContactForm.tsx          # Форма обратной связи
│   │   │   └── GoogleMap.tsx            # Google Maps Embed
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── SectionHeading.tsx
│   │       ├── AnimatedText.tsx         # GSAP SplitText эффект
│   │       ├── RevealOnScroll.tsx       # Framer Motion scroll-reveal
│   │       ├── ParallaxImage.tsx        # Параллакс-эффект для изображений
│   │       ├── ImageLightbox.tsx        # Лайтбокс для галерей
│   │       ├── Loader.tsx              # Прелоадер сайта
│   │       └── SmoothScroll.tsx         # Lenis smooth scroll wrapper
│   ├── lib/
│   │   ├── sanity/
│   │   │   ├── client.ts               # Sanity client
│   │   │   ├── queries.ts              # GROQ-запросы
│   │   │   └── schemas/                # Sanity-схемы (ниже)
│   │   ├── utils.ts
│   │   └── constants.ts                # Контактные данные, соцсети
│   ├── messages/
│   │   ├── es.json                     # Испанский UI
│   │   ├── en.json                     # Английский UI
│   │   └── ru.json                     # Русский UI
│   ├── hooks/
│   │   ├── useScrollAnimation.ts       # GSAP ScrollTrigger хук
│   │   └── useMediaQuery.ts
│   └── types/
│       └── index.ts                    # TypeScript типы
├── sanity/                              # Sanity Studio (embedded)
│   ├── schemas/
│   │   ├── project.ts                  # Проект портфолио
│   │   ├── material.ts                 # Материал
│   │   ├── service.ts                  # Услуга
│   │   ├── blogPost.ts                 # Статья блога
│   │   ├── teamMember.ts              # Член команды
│   │   ├── review.ts                   # Отзыв
│   │   ├── homePage.ts                 # Контент главной
│   │   └── siteSettings.ts            # Общие настройки (контакты и т.д.)
│   └── sanity.config.ts
├── scripts/
│   └── scraper/                        # Скрапер для фото (см. секцию 9)
│       ├── instagram-scraper.ts        # Playwright скрипт
│       └── README.md
├── public/
│   ├── fonts/                          # Локальные шрифты
│   ├── images/                         # Статичные изображения, placeholder'ы
│   └── videos/                         # Hero-видео
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── .env.example                        # Переменные окружения
```

---

## 4. ДИЗАЙН И СТИЛИСТИКА

### 4.1 Общий стиль
- Минимализм, «тихая роскошь» (quiet luxury)
- Много «воздуха» (белого пространства)
- Акцент на высококачественных фотографиях
- Никаких кричащих элементов, всё утончённо и сдержанно

### 4.2 Цветовая палитра
```css
/* tailwind.config.ts — extend colors */
colors: {
  brand: {
    black:    '#1a1a1a',    /* Основной текст */
    dark:     '#2d2d2d',    /* Вторичный текст */
    gray:     '#8a8a8a',    /* Подписи, мелкий текст */
    light:    '#f5f3f0',    /* Фон секций (тёплый бежевый) */
    cream:    '#faf8f5',    /* Альтернативный фон */
    white:    '#ffffff',    /* Основной фон */
    accent:   '#b8a088',    /* Акцентный — тёплое золото/бронза */
  }
}
```

### 4.3 Типографика
- **Заголовки:** Антиква / Serif — `Cormorant Garamond` или `Playfair Display` (элегантность)
- **Основной текст:** Гротеск / Sans-serif — `Inter` или `DM Sans` (читаемость)
- Подключить через `next/font/google` для оптимальной загрузки
- Размеры: H1 — 56-72px, H2 — 40-48px, H3 — 28-32px, Body — 16-18px
- Letter-spacing для заголовков: 0.02-0.05em (лёгкий разрядка)

### 4.4 Анимации (подробно)

**Framer Motion — для компонентных анимаций:**
- Fade-in + slide-up при появлении секций в viewport
- Плавные переходы страниц (page transitions)
- Hover-эффекты на карточках проектов (масштаб фото, появление overlay)
- Анимация меню (mobile drawer, dropdown)
- Stagger-анимации для сетки проектов и материалов

**GSAP + ScrollTrigger — для продвинутых эффектов:**
- Параллакс-скролл фоновых изображений
- Горизонтальный скролл секций (если уместно, как у corston.eu)
- Текстовый reveal (побуквенное/пословное появление заголовков)
- Pinning секций при скролле
- Плавное увеличение изображений при скролле
- Smooth scroll через Lenis

**Правила:**
- `prefers-reduced-motion: reduce` — отключать все анимации для доступности
- На мобильных устройствах упрощать анимации (убрать тяжёлый параллакс)
- Все анимации должны быть subtle, элегантные — НЕ flashy

---

## 5. HEADER (ШАПКА САЙТА)

```
┌──────────────────────────────────────────────────────────────────┐
│  [LOGO ConceptoFino]     Главная  Проекты▾  Материалы▾         │
│                          Услуги▾  Блог  О нас  Контакты         │
│                                            📞 +34...  ✉ email   │
│                                            [ES|EN|RU]           │
└──────────────────────────────────────────────────────────────────┘
```

- **Фон:** белый, 50% прозрачность (`bg-white/50 backdrop-blur-md`)
- **Поведение:** fixed вверху, при скролле вниз — скрывается, при скролле вверх — появляется (hide-on-scroll-down / show-on-scroll-up)
- **Лого:** кликабельно → ведёт на Home
- **Телефон:** `<a href="tel:+34...">` — кликабельный звонок с мобильного
- **Email:** `<a href="mailto:...">` — открывает почтовый клиент
- **Мобильная версия:** бургер-меню справа, подразделы раскрываются аккордеоном

### Выпадающие подменю (Desktop):
- Открываются плавно при наведении (Framer Motion: fade + slight slide down)
- Закрываются с небольшой задержкой (чтобы не закрылось при переводе мыши)

### Выпадающие подменю — содержание:

**Проекты (Proyectos) ▾**
- Кухни (Cocinas)
- Гардеробные и шкафы (Vestidores y Armarios)
- Индивидуальная мебель (Muebles a medida)
- Полные интерьеры (Proyectos Integrales)

**Материалы (Materiales) ▾**
- Дерево и шпон (Maderas)
- Камень и керамогранит (Piedra y Cerámica)
- Металл и фурнитура (Metales y Herrajes)
- Текстиль (Textiles)

**Услуги (Servicios) ▾**
- Дизайн-проектирование (Diseño de Interiores)
- Собственное производство (Fabricación Propia)
- Монтаж и логистика (Montaje y Logística)

---

## 6. СТРАНИЦЫ — ПОДРОБНОЕ ОПИСАНИЕ

### 6.1 Главная (Home)

**Секция 1 — Hero:**
- Полноэкранное видео (или слайдер из 3-4 фото интерьеров) с overlay
- Поверх: заголовок о философии ConceptoFino, подзаголовок, кнопка CTA
- Видео: autoplay, muted, loop, lazy (загружать после первого рендера)
- Стрелка вниз или индикатор скролла внизу экрана
- GSAP: текст появляется побуквенно, фото — с параллаксом

**Секция 2 — Философия:**
- Крупный текст об интеграции мебели в пространство
- Рядом — атмосферное фото
- Scroll-reveal анимация текста (GSAP SplitText)

**Секция 3 — Портфолио (превью):**
- 3-4 лучших проекта, крупные фото
- При наведении — плавный zoom + overlay с названием и категорией
- Кнопка «Смотреть все проекты»
- Stagger-анимация появления карточек

**Секция 4 — Услуги (кратко):**
- 3 блока: Проектирование, Производство, Монтаж
- Иконки + краткий текст
- Ссылки на подробные страницы

**Секция 5 — CTA:**
- Крупный фоновый образ (параллакс)
- Текст: «Запросить консультацию / Solicitar Presupuesto»
- Кнопка ведёт на форму или открывает модальное окно

### 6.2 Портфолио (Proyectos)

- **Фильтрация:** Все / Кухни / Гардеробные / Мебель / Полные интерьеры
  - Анимированное переключение фильтров (Framer Motion layout animation)
- **Сетка:** masonry-подобная или ровная 2-3 колонки
- **Карточка проекта:** Фото → hover: zoom + overlay с названием
- **Lazy load** для изображений с blur-placeholder

**Страница отдельного проекта (`/proyectos/[slug]`):**
- Крупная hero-фотография
- Описание задачи и решения
- Галерея (слайдер или lightbox-сетка)
- Использованные материалы (ссылки на раздел «Материалы»)
- CTA: «Хочу похожий проект» → форма с предзаполненным названием проекта
- Контекстный sidebar: ссылки на другие проекты той же категории

### 6.3 Материалы (Materiales)

- Визуальный каталог текстур
- Сетка карточек: крупное фото текстуры, название, краткое описание
- Категории: Дерево, Камень, Металл, Текстиль
- При клике — страница с подробным описанием, характеристиками, фото применения в проектах
- Подчёркивает качество и тактильность — большие детальные фото

### 6.4 Услуги (Servicios)

- Описание каждого этапа работы: от замера до установки
- Визуализация процесса (таймлайн или пронумерованные шаги)
- Каждый этап: иконка + заголовок + описание + фото
- CTA внизу каждой страницы услуги

### 6.5 Блог (Blog)

- Сетка статей: фото + заголовок + дата + категория + превью текста
- Страница статьи: hero-фото, rich-text контент из Sanity (Portable Text), related posts
- Важно для SEO: семантическая разметка, мета-теги, OpenGraph

### 6.6 О нас (Nosotros)

- История бренда (текст + фото)
- Команда: фото + имя + должность
- Отзывы клиентов: карусель/слайдер с цитатами

### 6.7 Контакты (Contacto)

- Адрес, телефон (кликабельный), email (кликабельный)
- Google Maps Embed (iframe)
- Форма обратной связи: Имя, Email, Телефон, Сообщение
  - Валидация: React Hook Form + Zod
  - Отправка: API Route → email (Resend SDK)
  - Success/Error состояния с анимацией

---

## 7. КОНТЕКСТНЫЙ SIDEBAR

- Отображается на внутренних страницах (проекты, материалы)
- Содержит ссылки на связанные элементы:
  - На странице проекта «Кухни» → ссылки на другие кухонные проекты и связанные материалы
  - На странице материала → ссылки на проекты, где использован этот материал
- Динамический, контекстуальный, данные из Sanity

---

## 8. SANITY CMS — СХЕМЫ

Создай Sanity Studio (embedded в Next.js проект) со следующими типами контента:

### project (Проект)
```ts
{
  title: string (localized: es, en, ru),
  slug: slug,
  category: 'cocinas' | 'vestidores' | 'muebles' | 'integrales',
  description: blockContent (localized),
  challenge: blockContent (localized),     // Описание задачи
  solution: blockContent (localized),      // Описание решения
  mainImage: image,
  gallery: image[],
  materials: reference[] → material,
  featured: boolean,                        // Показывать на главной
  order: number,
  seo: { metaTitle, metaDescription }
}
```

### material (Материал)
```ts
{
  title: string (localized),
  slug: slug,
  category: 'maderas' | 'piedra' | 'metales' | 'textiles',
  description: blockContent (localized),
  characteristics: string[] (localized),
  mainImage: image,
  textureImage: image,                     // Фото текстуры крупным планом
  gallery: image[],
  projects: reference[] → project          // Где использовался
}
```

### service (Услуга)
```ts
{
  title: string (localized),
  slug: slug,
  description: blockContent (localized),
  steps: [{ title, description, icon, image }] (localized),
  mainImage: image
}
```

### blogPost (Статья блога)
```ts
{
  title: string (localized),
  slug: slug,
  excerpt: text (localized),
  body: blockContent (localized),
  mainImage: image,
  categories: string[],
  publishedAt: datetime,
  author: reference → teamMember,
  seo: { metaTitle, metaDescription }
}
```

### teamMember (Член команды)
```ts
{
  name: string,
  role: string (localized),
  photo: image,
  bio: text (localized),
  order: number
}
```

### review (Отзыв)
```ts
{
  clientName: string,
  clientRole: string (localized),          // «Владелец виллы в Валенсии»
  text: text (localized),
  rating: number (1-5),
  projectRef: reference → project
}
```

### homePage (Контент главной)
```ts
{
  heroVideo: file,
  heroImages: image[],                     // Для слайдера
  heroTitle: string (localized),
  heroSubtitle: string (localized),
  philosophyTitle: string (localized),
  philosophyText: blockContent (localized),
  philosophyImage: image,
  ctaTitle: string (localized),
  ctaButtonText: string (localized),
  ctaBackgroundImage: image
}
```

### siteSettings (Настройки сайта)
```ts
{
  companyName: string,
  phone: string,
  email: string,
  address: string (localized),
  whatsappNumber: string,                  // Для floating button
  socialLinks: { instagram, facebook, ... },
  googleMapsEmbedUrl: string,
  logo: image,
  favicon: image
}
```

**Локализация в Sanity:** используй паттерн `@sanity/document-internationalization` или поле-объект `{ es: string, en: string, ru: string }` для каждого локализуемого поля. Выбери подход, который проще поддерживать.

---

## 9. СКРАПЕР ДЛЯ ФОТО

Создай отдельный скрипт в `scripts/scraper/` на Playwright (TypeScript):

### instagram-scraper.ts
```
Задача: Скачать все фото из Instagram аккаунта https://www.instagram.com/conceptofino/

Требования:
- Использовать Playwright (headless Chromium)
- Авторизация через cookies или логин/пароль (через .env)
- Скроллить страницу профиля для подгрузки всех постов
- Скачивать фото в максимальном разрешении
- Сохранять в /scripts/scraper/output/instagram/
- Именование: {дата_поста}_{порядковый_номер}.jpg
- Логировать прогресс в консоль
- Обрабатывать ошибки (rate limiting, блокировки)
- README.md с инструкцией по запуску
```

### whatsapp-catalog-scraper.ts
```
Задача: Скачать фото из каталога WhatsApp Business https://wa.me/c/34657575939

Требования:
- Использовать Playwright
- Открыть каталог через веб-версию WhatsApp
- Скачать все изображения товаров из каталога
- Сохранять в /scripts/scraper/output/whatsapp/
- README.md с инструкцией
```

### Пост-обработка скачанных фото:
```
- Скрипт optimize-images.ts (использовать sharp):
  - Конвертировать всё в WebP
  - Создать 3 размера: thumbnail (400px), medium (1200px), full (2400px)
  - Генерировать blur-placeholder (base64, 20px width)
  - Сохранять в /public/images/portfolio/
```

---

## 10. МУЛЬТИЯЗЫЧНОСТЬ (next-intl)

### Конфигурация:
- Роутинг: `/es/...`, `/en/...`, `/ru/...`
- Дефолтный язык: `es` (испанский)
- Автоопределение языка браузера (Accept-Language header) при первом визите
- Middleware next-intl для редиректа

### UI-строки (`messages/*.json`):
Все элементы интерфейса (кнопки, навигация, заголовки форм, footer, мета-теги) на 3 языках. Контентные тексты (проекты, блог, материалы) — из Sanity с локализацией.

### LanguageSwitcher:
- Отображает: ES | EN | RU
- При переключении — сохраняет текущую страницу, меняет только язык
- Сохранять выбор в cookie

---

## 11. ФУНКЦИОНАЛЬНЫЕ ТРЕБОВАНИЯ

### WhatsApp Floating Button:
- Фиксированная кнопка в правом нижнем углу
- Иконка WhatsApp, зелёный цвет
- При клике → `https://wa.me/34657575939?text=...` (предзаполненное сообщение на языке сайта)
- Появляется через 3 секунды после загрузки (Framer Motion)
- Скрывается при скролле вниз, показывается при скролле вверх

### Лидогенерация:
- Формы:
  1. Основная форма на странице «Контакты»
  2. «Хочу похожий проект» на страницах проектов (мини-форма: имя, телефон, email)
  3. CTA-модальное окно «Запросить консультацию» (триггер — кнопка на главной и в footer)
- Все формы отправляют данные через API Route → email

### Адаптивность (Mobile First):
- Breakpoints: sm(640) md(768) lg(1024) xl(1280) 2xl(1536)
- Мобильная навигация: бургер-меню с аккордеоном
- Оптимизация touch-targets (минимум 44x44px)
- Все карточки — вертикальный стек на мобильных

### Производительность:
- Все изображения в WebP через `next/image`
- Lazy Load для всех изображений и видео
- Blur placeholder для изображений
- Dynamic import для тяжёлых компонентов (галерея, GSAP)
- Target: Lighthouse Performance >90, LCP <2.5s

---

## 12. SEO

- Семантическая HTML-разметка (header, main, nav, article, section, aside)
- `<title>` и `<meta description>` на каждой странице (локализованные)
- OpenGraph теги (`og:title`, `og:description`, `og:image`, `og:locale`)
- `hreflang` теги для всех языковых версий
- JSON-LD разметка (Organization, LocalBusiness, BreadcrumbList)
- Sitemap.xml (автогенерация через next-sitemap)
- robots.txt
- Canonical URLs

---

## 13. FOOTER

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  [LOGO]  ConceptoFino                                       │
│  Smart Integration & Timeless Design                        │
│                                                             │
│  Навигация        Услуги            Контакты                │
│  ─────────        ──────            ────────                │
│  Проекты          Дизайн            📍 Адрес, Валенсия      │
│  Материалы        Производство      📞 +34...               │
│  Блог             Монтаж            ✉ email@...             │
│  О нас                                                      │
│                                                             │
│  [Instagram] [WhatsApp] [Facebook]                          │
│                                                             │
│  © 2024 ConceptoFino. Todos los derechos reservados.        │
│  Política de Privacidad  |  Aviso Legal                     │
└─────────────────────────────────────────────────────────────┘
```

---

## 14. ФАЙЛ .env.example

```env
# Sanity
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_TOKEN=

# Email (Resend)
RESEND_API_KEY=
CONTACT_EMAIL_TO=

# Site
NEXT_PUBLIC_SITE_URL=https://conceptofino.com
NEXT_PUBLIC_WHATSAPP_NUMBER=34657575939

# Google Maps
NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL=

# Instagram Scraper (для скрипта)
INSTAGRAM_USERNAME=
INSTAGRAM_PASSWORD=
```

---

## 15. ПОРЯДОК РАЗРАБОТКИ

Выполняй работу в следующем порядке:

1. **Инициализация проекта:** `create-next-app`, конфигурация TS, Tailwind, структура папок
2. **Базовый layout:** Header (с dropdown и бургером), Footer, WhatsApp button
3. **next-intl:** Middleware, routing, JSON-файлы с переводами, LanguageSwitcher
4. **Sanity Studio:** Установка, схемы всех типов контента, встраивание в Next.js
5. **Главная страница:** Hero, Philosophy, Featured Projects, Services Preview, CTA — со всеми анимациями (GSAP + Framer Motion)
6. **Портфолио:** Список с фильтрацией, страница проекта с галереей и sidebar
7. **Материалы:** Каталог, страницы материалов
8. **Услуги:** Описание этапов работы
9. **Блог:** Список и страница статьи
10. **О нас:** Команда + отзывы
11. **Контакты:** Форма + Google Maps
12. **API Routes:** Обработка форм
13. **SEO:** Мета-теги, sitemap, robots, JSON-LD, hreflang
14. **Скрапер:** Instagram + WhatsApp + optimize-images
15. **Финальная оптимизация:** Lighthouse, accessibility, код-ревью

---

## 16. ВАЖНЫЕ ПРАВИЛА

- Весь код на TypeScript со строгой типизацией
- Компоненты — функциональные, с хуками
- Никаких `any` типов — типизируй всё
- CSS — только Tailwind (никаких inline styles и отдельных CSS-файлов, кроме globals.css)
- Все тексты интерфейса — через `next-intl` (useTranslations), НЕ захардкоженные
- Все данные контента — из Sanity CMS, НЕ захардкоженные
- Изображения — только через `next/image`
- Accessibility: alt-текст на изображениях, aria-labels, keyboard navigation, focus states
- Код должен быть чистым, читаемым, с понятными именами переменных
- Каждый коммит — атомарный, с осмысленным сообщением
- Mobile First подход во всех стилях
