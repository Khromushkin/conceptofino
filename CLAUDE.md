# CLAUDE.md — ConceptoFino

## Project

ConceptoFino — custom furniture & interior design studio, Valencia, Spain.

**Core UTP:** «За цену IKEA — кастомная мебель на заказ, встроенная в интерьер».  
**Tone:** Тёплый, approachable — не холодно-премиальный. «Тихая роскошь».  
**Languages:** ES (default) · EN · RU  
**Live site:** http://conceptofino.es  
**Repo:** github.com/Khromushkin/conceptofino

---

## Tech Stack

- **Next.js 14** App Router · TypeScript · React 18
- **Tailwind CSS** — no inline styles, no CSS files except globals.css
- **Framer Motion** (component animations) + **GSAP** (ScrollTrigger, parallax)
- **next-intl** — all UI strings via `useTranslations` / `getTranslations`, never hardcoded
- **Sanity CMS** — all content via `src/lib/content/` abstraction layer
- **next/image** — all images, WebP, with blur placeholder
- **Lucide React** — icons
- **Node 20** (use `nvm use 20` before building)

---

## Design System

### Colors (`tailwind.config.ts`)
```
brand-black:  #1a1a1a   brand-dark:   #2d2d2d
brand-gray:   #8a8a8a   brand-light:  #f5f3f0
brand-cream:  #faf8f5   brand-white:  #ffffff
brand-accent: #b8a088   (warm gold/bronze — the accent)
```

### Typography
- **Serif / headings:** Cormorant Garamond (`font-serif`)
- **Sans / body + UI:** Inter (`font-sans`)
- **Letter-spacing UI:** `tracking-[0.15em]` nav, `tracking-[0.2em]` buttons/labels
- **Text balance:** use `text-balance` on headings to prevent orphans

---

## Code Rules

- Strict TypeScript — no `any`
- Functional components with hooks
- Tailwind only — no inline styles
- All UI text via next-intl
- All content via `src/lib/content/` (never import from `src/data/` directly in components)
- All images via `next/image`
- Accessibility: alt text, aria-labels, keyboard nav, focus states
- `prefers-reduced-motion` — disable all animations

---

## Architecture

```
src/
  app/[locale]/     ← pages (SSR, next-intl routing)
  components/       ← UI components
  lib/
    content/        ← data abstraction (getProjects, getMaterials, etc.)
    constants.ts    ← contacts, WhatsApp number, nav items
    utils.ts        ← cn(), getLocalizedField(), etc.
  data/             ← static TypeScript objects (hardcoded content)
  messages/         ← i18n JSON (es.json, en.json, ru.json)
  types/index.ts    ← TypeScript interfaces
studio/             ← Sanity Studio (separate tsconfig, excluded from root)
```

---

## Git Workflow

After completing any task that changes files:
1. `git add <specific files>`
2. `git commit -m "feat/fix/chore: description"`
3. `git push` — always push immediately, never leave commits unpushed

---

## Deploy (VPS)

**Server:** `root@209.38.231.136` · Ubuntu 24.04 · PM2 + Nginx  
**SSH key:** `~/.ssh/id_ed25519_conceptofino`

```bash
export NVM_DIR="$HOME/.nvm" && source "$NVM_DIR/nvm.sh" && nvm use 20
npm run build

KEY="$HOME/.ssh/id_ed25519_conceptofino"
SERVER="root@209.38.231.136"
rsync -az --delete -e "ssh -i $KEY" .next/standalone/ $SERVER:/var/www/conceptofino/
rsync -az -e "ssh -i $KEY" .next/static/ $SERVER:/var/www/conceptofino/.next/static/
rsync -az -e "ssh -i $KEY" public/ $SERVER:/var/www/conceptofino/public/
ssh -i $KEY $SERVER "pm2 restart conceptofino"
```

> Note: always rsync `public/` separately — `--delete` on standalone would remove it.
