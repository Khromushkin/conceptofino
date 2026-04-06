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

Each post gets:
- `manifest.json` — metadata (URL, caption, image paths, timestamp)
- `0.jpg`, `1.jpg`, … — downloaded images

## Running the optimizer

```bash
npm run optimize:images
```

Output:
- `public/images/projects/<postId>/<n>-sm.webp` (480px)
- `public/images/projects/<postId>/<n>-md.webp` (960px)
- `public/images/projects/<postId>/<n>-lg.webp` (1920px)
- `src/data/blur-placeholders.ts` — base64 blur data URLs for `next/image`

## Environment variables

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `IG_USERNAME` | Yes | — | Instagram login |
| `IG_PASSWORD` | Yes | — | Instagram password |
| `IG_PROFILE` | No | `conceptofino` | Target Instagram handle |
| `IG_LIMIT` | No | `30` | Max posts to fetch |

## Notes

- The scraper caches by `postId` — re-running skips already-downloaded posts.
- Instagram rate-limits scraping. Run during off-peak hours.
- Scraped output (`scripts/scraper/output/`) is gitignored.
