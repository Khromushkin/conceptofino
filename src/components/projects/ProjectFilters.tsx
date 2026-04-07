// src/components/projects/ProjectFilters.tsx
'use client'

import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import type { ProjectCategory } from '@/types'
import { cn } from '@/lib/utils'

type Filter = 'all' | ProjectCategory

interface Props {
  active: Filter
  onChange: (f: Filter) => void
}

export default function ProjectFilters({ active, onChange }: Props) {
  const t = useTranslations('projects')

  const filters: { value: Filter; label: string }[] = [
    { value: 'all', label: t('filter_all') },
    { value: 'cocinas', label: t('filter_cocinas') },
    { value: 'vestidores', label: t('filter_vestidores') },
    { value: 'muebles', label: t('filter_muebles') },
    { value: 'integrales', label: t('filter_integrales') },
  ]

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filter projects">
      {filters.map((f) => (
        <button
          key={f.value}
          onClick={() => onChange(f.value)}
          aria-pressed={active === f.value}
          className={cn(
            'relative font-sans text-xs tracking-[0.2em] uppercase px-4 py-2 transition-colors duration-200',
            active === f.value
              ? 'text-white'
              : 'text-brand-gray hover:text-brand-black'
          )}
        >
          {active === f.value && (
            <motion.span
              layoutId="filter-pill"
              className="absolute inset-0 bg-brand-accent"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-10">{f.label}</span>
        </button>
      ))}
    </div>
  )
}
