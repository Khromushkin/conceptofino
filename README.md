# ConceptoFino — Muebles a medida en Valencia

Сайт мебельной мастерской ConceptoFino (Valencia, España).  
**Стек:** Next.js 14 App Router · next-intl (es/en/ru) · Tailwind CSS · Framer Motion · Sanity CMS

---

## Статус проекта

**Сайт:** http://conceptofino.es (HTTP, SSL в процессе)  
**VPS:** 209.38.231.136 (DigitalOcean, Ubuntu 24.04) — SSR, PM2 + Nginx  
**CMS:** https://conceptofino.sanity.studio — Sanity Studio (project `qbetivec`)  
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
- SSR на DigitalOcean VPS (209.38.231.136): Next.js standalone + PM2 + Nginx
- next-intl middleware: роутинг `/es/`, `/en/`, `/ru/`
- Шапка адаптируется: белая на тёмном hero главной, чёрная на светлых страницах
- Контактная форма и форма лида — при недоступности API открывают WhatsApp с заполненным сообщением
- Sitemap, robots.txt, JsonLd (LocalBusiness schema)
- Sanity CMS подключён: схемы, GROQ-запросы, `src/lib/content/*.ts` с fallback на хардкод
- Studio задеплоена на conceptofino.sanity.studio (project `qbetivec`, dataset `production`)
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

### SSL (через DNS-01 challenge)

HTTP-01 challenge не работает: OVH shared hosting перехватывает запросы с тем же доменом.  
Решение — DNS-01 через DigitalOcean API (не зависит от HTTP):

```bash
# 1. Создать токен: cloud.digitalocean.com/account/api/tokens (Write)
ssh -i ~/.ssh/id_ed25519_conceptofino root@209.38.231.136
apt install -y python3-certbot-dns-digitalocean
echo "dns_digitalocean_token = ВАШ_ТОКЕН" > /root/do-credentials.ini
chmod 600 /root/do-credentials.ini
certbot certonly --dns-digitalocean \
  --dns-digitalocean-credentials /root/do-credentials.ini \
  -d conceptofino.es -d www.conceptofino.es \
  --non-interactive --agree-tos --email info@conceptofino.es
# 2. После получения сертификата — обновить nginx для HTTPS
```

---

## Деплой на OVH (устаревший, static export)

Статический деплой больше не используется (API routes не работают, форма открывает WhatsApp).  
Если нужно — смотри git history для `.htaccess` и `output: 'export'` конфига.

---

## Дальнейшие планы

### Приоритет 1 — SSL
- [ ] SSL через DNS-01 (DigitalOcean API токен) — см. раздел выше
- [ ] После SSL: обновить Nginx для HTTPS + redirect HTTP → HTTPS
- [ ] Sitemap: заменить `conceptofino.com` на `conceptofino.es` в `next-sitemap.config.js`

### Приоритет 2 — Контент через Sanity
- [ ] Заполнить проекты, материалы, услуги через conceptofino.sanity.studio
- [ ] Написать 2–3 статьи в блог
- [ ] Заменить заглушки команды в `src/data/team.ts` на реальные фото
- [ ] Настроить Google Maps embed в `src/data/site-settings.ts`

### Приоритет 3 — Функциональность
- [ ] Email: добавить ключ Resend в `.env.local` на VPS (код уже готов в `src/lib/email.ts`)
- [ ] Google Analytics — добавить `NEXT_PUBLIC_GA_ID` в `.env.local` и пересобрать

### Приоритет 4 — SEO
- [ ] Open Graph изображения для соцсетей

---

## Структура проекта

```
src/
  app/[locale]/          # страницы (es/en/ru)
  components/            # UI компоненты
  data/                  # хардкод (fallback пока Sanity пустой)
  lib/content/           # слой контента — читает из Sanity, fallback на data/
  sanity/                # client.ts + queries.ts (GROQ)
  messages/              # переводы (es.json, en.json, ru.json)
  i18n/                  # next-intl конфиг
public/
  images/projects/       # реальные фото (WebP, sm/md/lg)
  images/logo.webp       # логотип с прозрачным фоном
studio/                  # Sanity Studio (отдельный React 19 проект)
sanity/schemas/          # схемы CMS (shared между studio/ и src/)
scripts/
  process-downloads.ts   # конвертация фото → WebP 3 размера
  scraper/               # Instagram scraper (Playwright)
```

---

## Переменные окружения

Скопировать `.env.local.example` → `.env.local` и заполнить:

```
NEXT_PUBLIC_SANITY_PROJECT_ID=qbetivec   # уже заполнено
NEXT_PUBLIC_SANITY_DATASET=production    # уже заполнено
SANITY_API_TOKEN=                        # нужен для draft preview
RESEND_API_KEY=                          # для email отправки
NEXT_PUBLIC_GA_ID=                       # Google Analytics
```

На VPS файл `/var/www/conceptofino/.env.local` уже создан с Sanity project ID.
