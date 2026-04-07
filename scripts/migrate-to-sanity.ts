/**
 * Sanity migration script
 * Uploads local images to Sanity CDN and creates project/material/service documents.
 *
 * Usage:
 *   SANITY_TOKEN=sk... npx tsx scripts/migrate-to-sanity.ts
 *
 * Or set SANITY_TOKEN in .env.local and run:
 *   npx tsx scripts/migrate-to-sanity.ts
 */

import { createClient } from '@sanity/client'
import * as fs from 'fs'
import * as path from 'path'
import * as dotenv from 'dotenv'

dotenv.config({ path: path.join(process.cwd(), '.env.local') })

const TOKEN = process.env.SANITY_TOKEN || process.env.SANITY_WRITE_TOKEN
if (!TOKEN) {
  console.error('Missing SANITY_TOKEN in environment. Set it in .env.local or pass as env var.')
  process.exit(1)
}

const client = createClient({
  projectId: 'qbetivec',
  dataset: 'production',
  apiVersion: '2024-01-01',
  token: TOKEN,
  useCdn: false,
})

const PUBLIC_DIR = path.join(process.cwd(), 'public')

// Cache: local path (relative to /public) → Sanity asset _id
const uploadedAssets = new Map<string, string>()

async function uploadImage(localPath: string): Promise<string> {
  if (uploadedAssets.has(localPath)) {
    return uploadedAssets.get(localPath)!
  }
  const absolutePath = path.join(PUBLIC_DIR, localPath)
  if (!fs.existsSync(absolutePath)) {
    console.warn(`  ⚠ Image not found, skipping: ${absolutePath}`)
    return ''
  }
  const filename = path.basename(absolutePath)
  const stream = fs.createReadStream(absolutePath)
  console.log(`  ↑ Uploading ${localPath}`)
  const asset = await client.assets.upload('image', stream, {
    filename,
    contentType: 'image/webp',
  })
  uploadedAssets.set(localPath, asset._id)
  return asset._id
}

function imageRef(assetId: string, alt?: { es: string; en: string; ru: string }) {
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: assetId },
    alt: alt ?? { es: '', en: '', ru: '' },
  }
}

// ─── Projects ───────────────────────────────────────────────────────────────

async function migrateProjects() {
  console.log('\n📦 Migrating projects…')

  const { projects } = await import('../src/data/projects')

  for (const p of projects) {
    console.log(`\n  Project: ${p.slug}`)

    const mainAssetId = await uploadImage(p.mainImage.src)
    const galleryItems = await Promise.all(
      p.gallery.map(async (img, i) => {
        const assetId = await uploadImage(img.src)
        return assetId
          ? { ...imageRef(assetId, img.alt), _key: `gallery-${i}` }
          : null
      })
    )

    const doc = {
      _type: 'project',
      _id: p.id,
      slug: { _type: 'slug', current: p.slug },
      category: p.category,
      featured: p.featured,
      order: p.order,
      year: p.year,
      location: p.location,
      title: p.title,
      description: p.description,
      challenge: p.challenge,
      solution: p.solution,
      mainImage: mainAssetId ? imageRef(mainAssetId, p.mainImage.alt) : undefined,
      gallery: galleryItems.filter(Boolean),
    }

    await client.createOrReplace(doc)
    console.log(`  ✓ ${p.slug}`)
  }
}

// ─── Materials ──────────────────────────────────────────────────────────────

async function migrateMaterials() {
  console.log('\n🪵 Migrating materials…')

  const { materials } = await import('../src/data/materials')

  for (const m of materials) {
    console.log(`\n  Material: ${m.slug}`)

    const mainAssetId = await uploadImage(m.mainImage.src)
    const textureAssetId = m.textureImage ? await uploadImage(m.textureImage.src) : ''
    const galleryItems = await Promise.all(
      (m.gallery ?? []).map(async (img, i) => {
        const assetId = await uploadImage(img.src)
        return assetId
          ? { ...imageRef(assetId, img.alt), _key: `gallery-${i}` }
          : null
      })
    )

    const doc = {
      _type: 'material',
      _id: m.id,
      slug: { _type: 'slug', current: m.slug },
      category: m.category,
      title: m.title,
      description: m.description,
      characteristics: m.characteristics,
      mainImage: mainAssetId ? imageRef(mainAssetId, m.mainImage.alt) : undefined,
      textureImage: textureAssetId ? imageRef(textureAssetId, m.textureImage?.alt) : undefined,
      gallery: galleryItems.filter(Boolean),
    }

    await client.createOrReplace(doc)
    console.log(`  ✓ ${m.slug}`)
  }
}

// ─── Services ───────────────────────────────────────────────────────────────

async function migrateServices() {
  console.log('\n🔧 Migrating services…')

  const { services } = await import('../src/data/services')

  for (const s of services) {
    console.log(`\n  Service: ${s.slug}`)

    const mainAssetId = await uploadImage(s.mainImage.src)
    const steps = await Promise.all(
      (s.steps ?? []).map(async (step, i) => {
        const stepAssetId = step.imageUrl ? await uploadImage(step.imageUrl) : ''
        return {
          _key: `step-${i}`,
          title: step.title,
          description: step.description,
          icon: step.icon,
          image: stepAssetId ? imageRef(stepAssetId) : undefined,
        }
      })
    )

    const doc = {
      _type: 'service',
      _id: s.id,
      slug: { _type: 'slug', current: s.slug },
      title: s.title,
      description: s.description,
      mainImage: mainAssetId ? imageRef(mainAssetId, s.mainImage.alt) : undefined,
      steps,
    }

    await client.createOrReplace(doc)
    console.log(`  ✓ ${s.slug}`)
  }
}

// ─── Main ────────────────────────────────────────────────────────────────────

async function main() {
  console.log('🚀 ConceptoFino → Sanity migration')
  console.log(`   Project: qbetivec / dataset: production`)

  await migrateProjects()
  await migrateMaterials()
  await migrateServices()

  console.log(`\n✅ Done! Uploaded ${uploadedAssets.size} unique images.`)
  console.log('   Open https://conceptofino.sanity.studio to review the content.')
}

main().catch((err) => {
  console.error('\n❌ Migration failed:', err)
  process.exit(1)
})
