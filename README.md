# ConceptoFino — Muebles a medida en Valencia

Сайт мебельной мастерской ConceptoFino (Valencia, España).  
**Стек:** Next.js 14 App Router · next-intl (es/en/ru) · Tailwind CSS · Framer Motion · Sanity CMS

---

## Статус проекта

**Сайт живой:** [conceptofino.es](http://conceptofino.es) (DNS может быть ещё в процессе)  
**Хостинг:** OVH shared hosting (static export), `ftp.cluster129.hosting.ovh.net`, user `conceyr`  
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

## Деплой на OVH (static)

```bash
# Временно убрать API routes (несовместимы со static export)
mv src/app/api /tmp/api_backup
mv "src/app/[locale]/blog/[slug]" /tmp/blog_slug_backup

npm run build       # генерирует out/

# Загрузить на хостинг
lftp -e "set ftp:ssl-allow no; open -u conceyr,ПАРОЛЬ ftp.cluster129.hosting.ovh.net; mirror -R --parallel=5 out/ www/; bye"

# Восстановить
cp -r /tmp/api_backup src/app/api
cp -r /tmp/blog_slug_backup "src/app/[locale]/blog/[slug]"
```

> **Важно:** перед деплоем восстановить middleware в `src/middleware.ts` обратно на next-intl при переезде на VPS.

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
