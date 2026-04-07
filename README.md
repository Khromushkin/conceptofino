# ConceptoFino — Muebles a medida en Valencia

Сайт мебельной мастерской ConceptoFino (Valencia, España).  
**Стек:** Next.js 14 App Router · next-intl (es/en/ru) · Tailwind CSS · Framer Motion · Sanity CMS

---

## Статус проекта

**VPS:** 209.38.231.136 (DigitalOcean, Ubuntu 24.04) — **SSR работает**  
**Домен:** conceptofino.es (DNS нужно перевести с OVH 188.165.132.144 → DigitalOcean 209.38.231.136)  
**Репозиторий:** github.com/Khromushkin/conceptofino

---

## Что уже сделано

### Сайт
- Все страницы на трёх языках (es/en/ru): главная, проекты, материалы, услуги, о нас, контакты, блог
- 7 проектов с галереями: кухни, гардеробные, встроенные шкафы, интегральный проект, лавабос, панели
- 5 материалов: Roble Natural, Nogal Americano, Acero Inoxidable, Piedra Natural, Terciopelo Gris
- Категорийные страницы материалов: `/materiales/maderas`, `/materiales/piedra`, и т.д.
- Страницы услуг с hero, шагами процесса и CTA

### Контент
- Все фото заменены на реальные (WhatsApp + Instagram → WebP 3 размера: sm/md/lg)
- Логотип с прозрачным фоном, адаптируется под тёмный/светлый хедер
- Copyright 2026, реальные контактные данные

### Технически
- Static export (`output: 'export'`) для OVH shared hosting
- `.htaccess` с редиректом `/` → `/es/`
- Контактная форма и форма лида — при недоступности API открывают WhatsApp с заполненным сообщением
- Sitemap, robots.txt, JsonLd (LocalBusiness schema)
- Sanity схемы готовы (projects, materials, services, blog, team, reviews, site-settings)
- Скрипты: `scripts/process-downloads.ts` (обработка фото) и `scripts/scraper/` (Instagram)

---

## Запуск локально

```bash
nvm use 20          # нужен Node 20+
npm install
npm run dev         # http://localhost:3000
```

---

## Деплой на DigitalOcean VPS (текущий)

**VPS:** 209.38.231.136 · Ubuntu 24.04 · Node 20 · PM2 + Nginx  
**SSH:** `ssh -i ~/.ssh/id_ed25519_conceptofino root@209.38.231.136`

```bash
nvm use 20
npm run build       # standalone режим, генерирует .next/standalone/

# Загрузить на VPS (rsync, ~65MB)
rsync -avz -e "ssh -i ~/.ssh/id_ed25519_conceptofino" .next/standalone/ root@209.38.231.136:/var/www/conceptofino/
rsync -avz -e "ssh -i ~/.ssh/id_ed25519_conceptofino" .next/static/ root@209.38.231.136:/var/www/conceptofino/.next/static/
rsync -avz -e "ssh -i ~/.ssh/id_ed25519_conceptofino" public/ root@209.38.231.136:/var/www/conceptofino/public/

# Перезапустить
ssh -i ~/.ssh/id_ed25519_conceptofino root@209.38.231.136 "pm2 restart conceptofino"
```

> **Особенность:** Next.js middleware генерирует редирект на localhost:3000 при работе за proxy.  
> Редирект `/` → `/es` обрабатывается Nginx напрямую, минуя middleware.

### SSL (после настройки DNS)

```bash
# DNS: conceptofino.es → 209.38.231.136 (DigitalOcean)
apt install -y certbot python3-certbot-nginx
certbot --nginx -d conceptofino.es -d www.conceptofino.es
```

---

## Деплой на OVH (устаревший, static export)

Статический деплой больше не используется (API routes не работают, форма открывает WhatsApp).  
Если нужно — смотри git history для `.htaccess` и `output: 'export'` конфига.

---

## Дальнейшие планы

### Приоритет 1 — Контент (можно делать сейчас)
- [ ] Заполнить реальный контент через Sanity CMS (`npm run dev` → `/studio`)
- [ ] Заменить заглушки команды в `src/data/team.ts` на реальные фото
- [ ] Настроить Google Maps embed в `src/data/site-settings.ts`
- [ ] Написать 2–3 статьи в блог

### Приоритет 2 — Переезд на VPS
- [ ] Установить Node.js 20 + PM2 на VPS (188.165.132.144 или новый)
- [ ] Вернуть `src/middleware.ts` с next-intl роутингом
- [ ] Убрать `output: 'export'` из `next.config.mjs` — сайт снова станет SSR
- [ ] Настроить `.env.local` с реальными ключами (SMTP, Sanity, etc.)
- [ ] Настроить Nginx как reverse proxy → `next start`
- [ ] SSL сертификат (Let's Encrypt / Certbot)

### Приоритет 3 — Функциональность
- [ ] Подключить Sanity — сейчас данные захардкожены в `src/data/*.ts`, нужно переключить `src/lib/content/*.ts` на запросы к Sanity API
- [ ] Настроить email отправку (SMTP в `src/lib/email.ts` — там уже есть код, нужен ключ Resend или SMTP)
- [ ] Форма контакта → реальная отправка письма (сейчас fallback на WhatsApp)
- [ ] Подключить Google Analytics / Plausible

### Приоритет 4 — SEO и оптимизация
- [ ] Настроить `next-sitemap.config.js` с реальным доменом (уже есть conceptofino.es)
- [ ] Добавить Open Graph изображения для соцсетей
- [ ] Проверить Core Web Vitals после переезда на VPS

---

## Структура проекта

```
src/
  app/[locale]/          # страницы (es/en/ru)
  components/            # UI компоненты
  data/                  # моковые данные (временно, до Sanity)
  lib/content/           # слой контента (переключить на Sanity)
  messages/              # переводы (es.json, en.json, ru.json)
  i18n/                  # next-intl конфиг
public/
  images/projects/       # реальные фото (WebP, sm/md/lg)
  images/logo.webp       # логотип с прозрачным фоном
scripts/
  process-downloads.ts   # конвертация фото → WebP 3 размера
  scraper/               # Instagram scraper (Playwright)
sanity/schemas/          # схемы CMS
```

---

## Переменные окружения

Скопировать `.env.local.example` → `.env.local` и заполнить:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=
NEXT_PUBLIC_SANITY_DATASET=
SANITY_API_TOKEN=
RESEND_API_KEY=          # или SMTP_* для email
NEXT_PUBLIC_GA_ID=       # Google Analytics
```
