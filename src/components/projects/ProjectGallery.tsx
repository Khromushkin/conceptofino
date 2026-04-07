// src/components/projects/ProjectGallery.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { ProjectImage, Locale } from '@/types'
import { getLocalizedField } from '@/lib/utils'

interface Props {
  images: ProjectImage[]
  locale: Locale
}

export default function ProjectGallery({ images, locale }: Props) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const touchStartX = useRef<number>(0)

  function prev() {
    setLightboxIndex((i) =>
      i !== null ? (i - 1 + images.length) % images.length : 0
    )
  }

  function next() {
    setLightboxIndex((i) =>
      i !== null ? (i + 1) % images.length : 0
    )
  }

  // Keyboard navigation
  useEffect(() => {
    if (lightboxIndex === null) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
      else if (e.key === 'Escape') setLightboxIndex(null)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [lightboxIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  // Touch swipe handlers
  function onTouchStart(e: React.TouchEvent) {
    touchStartX.current = e.touches[0].clientX
  }

  function onTouchEnd(e: React.TouchEvent) {
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (delta < -50) next()
    else if (delta > 50) prev()
  }

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setLightboxIndex(i)}
            className="relative overflow-hidden group aspect-[4/3]"
            aria-label={`Open image ${i + 1}`}
          >
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src={img.src}
                alt={getLocalizedField(img.alt, locale)}
                fill
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover"
              />
            </motion.div>
            <div className="absolute inset-0 bg-brand-black/0 group-hover:bg-brand-black/20 transition-colors duration-300" />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            className="fixed inset-0 z-50 bg-brand-black/95 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Close */}
            <button
              onClick={() => setLightboxIndex(null)}
              className="absolute top-6 right-6 text-brand-cream/70 hover:text-brand-cream"
              aria-label="Close"
            >
              <X size={24} />
            </button>

            {/* Image */}
            <motion.div
              key={lightboxIndex}
              className="relative w-full max-w-5xl max-h-[80vh] mx-6"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[lightboxIndex].src}
                alt={getLocalizedField(images[lightboxIndex].alt, locale)}
                width={images[lightboxIndex].width}
                height={images[lightboxIndex].height}
                className="w-full h-auto max-h-[80vh] object-contain"
              />
            </motion.div>

            {/* Prev/Next */}
            {images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    prev()
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-brand-cream/70 hover:text-brand-cream border border-brand-cream/20 hover:border-brand-cream/50 transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    next()
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center text-brand-cream/70 hover:text-brand-cream border border-brand-cream/20 hover:border-brand-cream/50 transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight size={20} />
                </button>
              </>
            )}

            {/* Counter */}
            <p className="absolute bottom-6 left-1/2 -translate-x-1/2 font-sans text-xs text-brand-cream/40 tracking-widest">
              {lightboxIndex + 1} / {images.length}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
