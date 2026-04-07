// src/components/materials/MaterialCard.tsx
'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import type { Material, Locale } from '@/types'
import { getLocalizedField } from '@/lib/utils'

interface Props {
  material: Material
  locale: Locale
}

export default function MaterialCard({ material, locale }: Props) {
  return (
    <Link
      href={`/${locale}/materiales/${material.slug}`}
      className="group block"
      aria-label={getLocalizedField(material.title, locale)}
    >
      <div className="relative overflow-hidden aspect-square mb-4">
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={material.textureImage.src}
            alt={getLocalizedField(material.textureImage.alt, locale)}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/10 transition-colors duration-500" />
      </div>
      <Link
        href={`/${locale}/materiales/${material.category}`}
        onClick={(e) => e.stopPropagation()}
        className="font-sans text-[10px] tracking-[0.2em] uppercase text-brand-accent mb-1 hover:underline inline-block"
      >
        {material.category}
      </Link>
      <h3 className="font-serif text-lg text-brand-black group-hover:text-brand-accent transition-colors duration-200">
        {getLocalizedField(material.title, locale)}
      </h3>
    </Link>
  )
}
