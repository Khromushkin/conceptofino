// src/components/projects/ProjectGrid.tsx
'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { Project, Locale, ProjectCategory } from '@/types'
import ProjectCard from './ProjectCard'
import ProjectFilters from './ProjectFilters'

type Filter = 'all' | ProjectCategory

interface Props {
  projects: Project[]
  locale: Locale
}

export default function ProjectGrid({ projects, locale }: Props) {
  const [activeFilter, setActiveFilter] = useState<Filter>('all')

  const filtered =
    activeFilter === 'all'
      ? projects
      : projects.filter((p) => p.category === activeFilter)

  return (
    <div>
      <div className="mb-10">
        <ProjectFilters active={activeFilter} onChange={setActiveFilter} />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Row 1: first project wide */}
          {filtered[0] && (
            <motion.div
              className="mb-3"
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <ProjectCard project={filtered[0]} locale={locale} variant="wide" />
            </motion.div>
          )}

          {/* Remaining in pairs */}
          {Array.from({ length: Math.ceil((filtered.length - 1) / 2) }).map(
            (_, rowIdx) => {
              const start = 1 + rowIdx * 2
              const rowProjects = filtered.slice(start, start + 2)
              return (
                <div
                  key={rowIdx}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3"
                >
                  {rowProjects.map((project, i) => (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.08,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                    >
                      <ProjectCard
                        project={project}
                        locale={locale}
                        variant="narrow"
                      />
                    </motion.div>
                  ))}
                </div>
              )
            }
          )}

          {filtered.length === 0 && (
            <p className="font-sans text-brand-gray text-center py-20">
              No hay proyectos en esta categoría.
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
