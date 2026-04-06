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
