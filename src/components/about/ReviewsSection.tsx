// src/components/about/ReviewsSection.tsx
'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import type { Review, Locale } from '@/types'
import { getLocalizedField } from '@/lib/utils'

interface Props {
  reviews: Review[]
  locale: Locale
  title: string
}

export default function ReviewsSection({ reviews, locale, title }: Props) {
  const [current, setCurrent] = useState(0)

  if (reviews.length === 0) return null

  function prev() {
    setCurrent((c) => (c - 1 + reviews.length) % reviews.length)
  }
  function next() {
    setCurrent((c) => (c + 1) % reviews.length)
  }

  const review = reviews[current]

  return (
    <section className="py-20 bg-brand-light">
      <div className="max-w-3xl mx-auto px-6 text-center">
        <h2 className="font-serif text-3xl text-brand-black mb-12">{title}</h2>

        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-6"
          >
            {/* Stars */}
            <div className="flex justify-center gap-1">
              {Array.from({ length: review.rating }).map((_, i) => (
                <Star key={i} size={16} className="text-brand-accent fill-brand-accent" />
              ))}
            </div>

            {/* Quote */}
            <blockquote className="font-serif text-xl lg:text-2xl text-brand-black leading-relaxed">
              «{getLocalizedField(review.text, locale)}»
            </blockquote>

            {/* Author */}
            <div>
              <p className="font-sans text-sm font-medium text-brand-black">
                {review.clientName}
              </p>
              <p className="font-sans text-xs text-brand-gray tracking-wide">
                {getLocalizedField(review.clientRole, locale)}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        {reviews.length > 1 && (
          <div className="flex items-center justify-center gap-6 mt-10">
            <button
              onClick={prev}
              aria-label="Previous review"
              className="w-10 h-10 flex items-center justify-center border border-brand-gray/30 hover:border-brand-accent text-brand-gray hover:text-brand-accent transition-colors"
            >
              <ChevronLeft size={18} />
            </button>
            <span className="font-sans text-xs text-brand-gray tracking-widest">
              {String(current + 1).padStart(2, '0')} /{' '}
              {String(reviews.length).padStart(2, '0')}
            </span>
            <button
              onClick={next}
              aria-label="Next review"
              className="w-10 h-10 flex items-center justify-center border border-brand-gray/30 hover:border-brand-accent text-brand-gray hover:text-brand-accent transition-colors"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
