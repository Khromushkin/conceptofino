'use client'

import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import type { Project, Locale } from '@/types'
import { getLocalizedField } from '@/lib/utils'

interface Props {
  project: Project
  locale: Locale
  variant?: 'wide' | 'narrow'
}

export default function ProjectCard({ project, locale, variant = 'narrow' }: Props) {
  const title = getLocalizedField(project.title, locale)
  const categoryMap: Record<string, string> = {
    cocinas: 'Cocina',
    vestidores: 'Vestidor',
    muebles: 'Mueble a medida',
    integrales: 'Proyecto Integral',
  }

  return (
    <Link
      href={`/${locale}/proyectos/${project.slug}`}
      className="group block relative overflow-hidden"
      aria-label={`Ver proyecto: ${title}`}
    >
      <div
        className={`relative overflow-hidden ${variant === 'wide' ? 'h-[420px] lg:h-[500px]' : 'h-[260px] lg:h-[320px]'}`}
      >
        <motion.div
          className="absolute inset-0"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <Image
            src={project.mainImage.src}
            alt={getLocalizedField(project.mainImage.alt, locale)}
            fill
            sizes={variant === 'wide' ? '(max-width: 768px) 100vw, 70vw' : '(max-width: 768px) 100vw, 35vw'}
            className="object-cover"
            placeholder={project.mainImage.blurDataURL ? 'blur' : 'empty'}
            blurDataURL={project.mainImage.blurDataURL}
          />
        </motion.div>

        <div className="absolute inset-0 bg-gradient-to-t from-brand-black/70 via-transparent to-transparent" />
        <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/20 transition-colors duration-500" />

        <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
          <p className="font-sans text-[10px] tracking-[0.2em] uppercase text-brand-accent mb-1.5">
            {categoryMap[project.category]} · {project.year}
          </p>
          <h3 className="font-serif text-lg lg:text-xl text-brand-cream leading-snug">
            {title}
          </h3>
          <p className="font-sans text-xs text-brand-cream/50 mt-1">{project.location}</p>
        </div>

        <motion.div
          className="absolute top-4 right-4 w-9 h-9 bg-brand-accent flex items-center justify-center"
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          <ArrowUpRight size={16} className="text-white" />
        </motion.div>
      </div>
    </Link>
  )
}
