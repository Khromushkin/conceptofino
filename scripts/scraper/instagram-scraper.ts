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

async function dismissDialogs(page: Page): Promise<void> {
  // Cookie / GDPR consent
  for (const text of [/accept all|aceptar todo|allow all|allow essential/i, /only allow essential/i, /decline optional/i]) {
    const btn = page.getByRole('button', { name: text })
    if (await btn.isVisible({ timeout: 2000 }).catch(() => false)) {
      await btn.click()
      await page.waitForTimeout(800)
      break
    }
  }
}

async function login(page: Page): Promise<void> {
  if (!USERNAME || !PASSWORD) throw new Error('IG_USERNAME and IG_PASSWORD are required')

  await page.goto('https://www.instagram.com/accounts/login/', { waitUntil: 'domcontentloaded' })
  await page.waitForTimeout(4000)

  await dismissDialogs(page)
  await page.waitForTimeout(1000)

  // Try multiple selectors for the username field
  const usernameSelectors = [
    'input[name="username"]',
    'input[autocomplete="username"]',
    'input[aria-label*="Phone"]',
    'input[aria-label*="Teléfono"]',
    'input[aria-label*="phone"]',
    'form input[type="text"]',
    'form input:not([type="password"])',
  ]

  let filled = false
  for (const sel of usernameSelectors) {
    try {
      const el = page.locator(sel).first()
      if (await el.isVisible({ timeout: 3000 })) {
        await el.fill(USERNAME)
        filled = true
        console.log(`Filled username using selector: ${sel}`)
        break
      }
    } catch { /* try next */ }
  }

  if (!filled) {
    await page.screenshot({ path: 'scripts/scraper/debug-login.png', fullPage: true })
    throw new Error('Could not find username input — see scripts/scraper/debug-login.png')
  }

  await page.waitForTimeout(500)

  const pwField = page.locator('input[type="password"]').first()
  await pwField.fill(PASSWORD)
  await page.waitForTimeout(500)
  // Press Enter — submit button may disappear as Instagram navigates
  await pwField.press('Enter')
  // Wait for redirect away from login page
  await page.waitForURL((url) => !url.href.includes('/accounts/login'), { timeout: 15000 }).catch(() => {})
  await page.waitForTimeout(3000)

  // Dismiss "Save login info?" and "Turn on notifications?" dialogs
  for (const text of [/not now|ahora no|save info|turn on/i]) {
    const btn = page.getByRole('button', { name: text })
    if (await btn.isVisible({ timeout: 3000 }).catch(() => false)) {
      await btn.click()
      await page.waitForTimeout(1000)
    }
  }

  console.log('Logged in')
}

async function collectPostUrls(page: Page): Promise<string[]> {
  await page.goto(`https://www.instagram.com/${PROFILE}/`, { waitUntil: 'domcontentloaded' })
  // Wait for JS-rendered post links to appear
  await page.waitForSelector('a[href*="/p/"]', { timeout: 20000 }).catch(async () => {
    await page.screenshot({ path: 'scripts/scraper/debug-profile.png', fullPage: true })
    console.warn('No post links found yet — continuing anyway (see debug-profile.png)')
  })
  await page.waitForTimeout(2000)

  const postUrls = new Set<string>()
  let stuckCount = 0
  let lastSize = 0

  while (postUrls.size < LIMIT && stuckCount < 5) {
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
    await page.mouse.wheel(0, 2000)
    await page.waitForTimeout(2000)
    console.log(`Collected ${postUrls.size} post URLs...`)
  }

  return Array.from(postUrls).slice(0, LIMIT)
}

async function scrapePost(context: import('playwright').BrowserContext, postUrl: string, index: number, total: number): Promise<PostManifest> {
  const postId = postUrl.split('/p/')[1]?.replace('/', '') ?? `post-${index}`
  const postDir = path.join(OUTPUT_DIR, postId)
  const manifestPath = path.join(postDir, 'manifest.json')

  if (fs.existsSync(manifestPath)) {
    const cached = JSON.parse(fs.readFileSync(manifestPath, 'utf-8')) as PostManifest
    if (cached.images.length > 0) {
      console.log(`[${index + 1}/${total}] Skip ${postId} (cached)`)
      return cached
    }
  }

  console.log(`[${index + 1}/${total}] Scraping ${postId}`)

  // Fresh page per post — avoids closed-page errors
  const page = await context.newPage()
  const capturedImageUrls = new Set<string>()

  // Intercept image responses from Instagram/Facebook CDN
  page.on('response', (res) => {
    const url = res.url()
    const ct = res.headers()['content-type'] ?? ''
    if (ct.startsWith('image/') && (url.includes('fbcdn.net') || url.includes('cdninstagram.com'))) {
      capturedImageUrls.add(url.split('?')[0])
    }
  })

  try {
    await page.goto(postUrl, { waitUntil: 'domcontentloaded', timeout: 25000 })
    await page.waitForTimeout(3000)

    // Also try DOM selectors as fallback (multiple CDN patterns)
    for (const sel of ['article img[src*="fbcdn.net"]', 'article img[src*="cdninstagram"]', 'article img[src]']) {
      const loc = page.locator(sel)
      const count = await loc.count()
      for (let j = 0; j < count; j++) {
        const src = await loc.nth(j).getAttribute('src').catch(() => null)
        if (src && (src.includes('fbcdn.net') || src.includes('cdninstagram.com'))) {
          capturedImageUrls.add(src.split('?')[0])
        }
      }
      if (capturedImageUrls.size > 0) break
    }

    const caption = await page.locator('article h1').first().textContent().catch(() => '') ?? ''
    fs.mkdirSync(postDir, { recursive: true })

    const imageUrls = Array.from(capturedImageUrls)
    const savedImages: string[] = []
    for (let j = 0; j < imageUrls.length; j++) {
      const imgPath = path.join(postDir, `${j}.jpg`)
      try {
        await downloadFile(imageUrls[j], imgPath)
        savedImages.push(imgPath)
        console.log(`  ${postId}/${j} downloaded`)
      } catch {
        console.warn(`  Failed to download image ${j}`)
      }
    }

    const manifest: PostManifest = { id: postId, url: postUrl, caption, images: savedImages, scrapedAt: new Date().toISOString() }
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
    return manifest
  } finally {
    await page.close().catch(() => {})
  }
}

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true })
  const browser = await chromium.launch({ headless: false })
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
    viewport: { width: 1280, height: 800 },
  })
  const page = await context.newPage()

  try {
    await login(page)
    const urls = await collectPostUrls(page)
    const manifests: PostManifest[] = []
    for (let i = 0; i < urls.length; i++) {
      try {
        manifests.push(await scrapePost(context, urls[i], i, urls.length))
      } catch (err) {
        console.warn(`[${i + 1}/${urls.length}] Skipped (error): ${err}`)
      }
    }
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
