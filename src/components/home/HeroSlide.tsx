'use client'

import Image from 'next/image'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import type { ProjectImage } from '@/types'

interface Props {
  image: ProjectImage
  isActive: boolean
  index: number
}

export default function HeroSlide({ image, isActive, index }: Props) {
  const reduced = useReducedMotion()

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          key={index}
          className="absolute inset-0 overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
        >
          <motion.div
            className="absolute inset-0 scale-100"
            animate={reduced ? {} : { scale: 1.08 }}
            transition={{ duration: 8, ease: 'linear' }}
          >
            <Image
              src={image.src}
              alt={image.alt.es}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
              placeholder={image.blurDataURL ? 'blur' : 'empty'}
              blurDataURL={image.blurDataURL}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
