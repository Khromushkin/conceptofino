import { groq } from 'next-sanity'

// ─── Projects ──────────────────────────────────────────────────────────────

export const projectsQuery = groq`*[_type == "project"] | order(order asc) {
  "id": _id,
  "slug": slug.current,
  category,
  title,
  description,
  challenge,
  solution,
  location,
  year,
  featured,
  order,
  "mainImage": mainImage { "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, alt },
  "gallery": gallery[] { "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, alt },
  materialIds,
  "seo": { "metaTitle": title, "metaDescription": description }
}`

export const projectBySlugQuery = groq`*[_type == "project" && slug.current == $slug][0] {
  "id": _id,
  "slug": slug.current,
  category,
  title,
  description,
  challenge,
  solution,
  location,
  year,
  featured,
  order,
  "mainImage": mainImage { "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, alt },
  "gallery": gallery[] { "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, alt },
  materialIds,
  "seo": { "metaTitle": title, "metaDescription": description }
}`

export const projectsByCategoryQuery = groq`*[_type == "project" && category == $category] | order(order asc) {
  "id": _id,
  "slug": slug.current,
  category,
  title,
  description,
  featured,
  order,
  "mainImage": mainImage { "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, alt }
}`

// ─── Materials ─────────────────────────────────────────────────────────────

export const materialsQuery = groq`*[_type == "material"] | order(order asc) {
  "id": _id,
  "slug": slug.current,
  category,
  title,
  description,
  characteristics,
  "mainImage": mainImage { "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, alt },
  "textureImage": textureImage { "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, alt },
  "gallery": gallery[] { "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, alt },
  featured,
  order
}`

export const materialBySlugQuery = groq`*[_type == "material" && slug.current == $slug][0] {
  "id": _id,
  "slug": slug.current,
  category,
  title,
  description,
  characteristics,
  "mainImage": mainImage { "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, alt },
  "textureImage": textureImage { "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, alt },
  "gallery": gallery[] { "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, alt },
  featured,
  order
}`

// ─── Services ──────────────────────────────────────────────────────────────

export const servicesQuery = groq`*[_type == "service"] | order(order asc) {
  "id": _id,
  "slug": slug.current,
  title,
  description,
  "mainImage": mainImage { "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, alt },
  "steps": steps[] {
    title,
    description,
    icon,
    "imageUrl": image.asset->url
  },
  featured,
  order
}`

export const serviceBySlugQuery = groq`*[_type == "service" && slug.current == $slug][0] {
  "id": _id,
  "slug": slug.current,
  title,
  description,
  "mainImage": mainImage { "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, alt },
  "steps": steps[] {
    title,
    description,
    icon,
    "imageUrl": image.asset->url
  }
}`

// ─── Blog ──────────────────────────────────────────────────────────────────

export const blogPostsQuery = groq`*[_type == "blogPost"] | order(publishedAt desc) {
  "id": _id,
  "slug": slug.current,
  title,
  excerpt,
  "body": body,
  "mainImage": mainImage { "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, alt },
  categories,
  publishedAt,
  "authorId": author._ref
}`

export const blogPostBySlugQuery = groq`*[_type == "blogPost" && slug.current == $slug][0] {
  "id": _id,
  "slug": slug.current,
  title,
  excerpt,
  body,
  "mainImage": mainImage { "src": asset->url, "width": asset->metadata.dimensions.width, "height": asset->metadata.dimensions.height, alt },
  categories,
  publishedAt,
  "authorId": author._ref
}`
