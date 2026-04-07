'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import type { Locale } from '@/types'
import HeroSlide from './HeroSlide'

const HERO_IMAGES = [
  {
    src: '/images/projects/cocinas/0-lg.webp',
    alt: { es: 'Cocina a medida Valencia', en: 'Custom kitchen Valencia', ru: 'Кухня на заказ Валенсия' },
    width: 1080, height: 1080,
  },
  {
    src: '/images/projects/vestidores/0-lg.webp',
    alt: { es: 'Vestidor a medida', en: 'Custom wardrobe', ru: 'Гардеробная на заказ' },
    width: 1080, height: 1080,
  },
  {
    src: '/images/projects/armarios/0-lg.webp',
    alt: { es: 'Armario empotrado Valencia', en: 'Built-in wardrobe Valencia', ru: 'Встроенный шкаф Валенсия' },
    width: 1080, height: 1080,
  },
  {
    src: '/images/projects/paneles_de_pared_y_techo_de_madera/0-lg.webp',
    alt: { es: 'Paneles de madera', en: 'Wood panels', ru: 'Деревянные панели' },
    width: 1080, height: 1080,
  },
  {
    src: '/images/projects/lavabos/0-lg.webp',
    alt: { es: 'Mueble de baño a medida', en: 'Custom bathroom furniture', ru: 'Мебель для ванной на заказ' },
    width: 1080, height: 1080,
  },
]

interface Props {
  locale: Locale
}

export default function HeroSection({ locale }: Props) {
  const t = useTranslations('hero')
  const reduced = useReducedMotion()
  const [activeSlide, setActiveSlide] = useState(0)
  const [gsapReady, setGsapReady] = useState(false)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % HERO_IMAGES.length)
    }, 6000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    if (reduced || !titleRef.current) return
    let ctx: { revert: () => void } | null = null

    async function initGSAP() {
      const gsapModule = await import('gsap')
      const gsap = gsapModule.default
      const { SplitText } = await import('gsap/SplitText')
      gsap.registerPlugin(SplitText)

      const split = new SplitText(titleRef.current!, { type: 'words,chars' })
      ctx = gsap.context(() => {
        gsap.from(split.chars, {
          opacity: 0,
          y: 30,
          stagger: 0.025,
          duration: 0.8,
          ease: 'power3.out',
          delay: 0.3,
        })
      })
      setGsapReady(true)
    }

    initGSAP().catch(() => setGsapReady(true))
    return () => ctx?.revert()
  }, [reduced])

  return (
    <section
      className="relative h-screen min-h-[600px] flex items-end overflow-hidden"
      aria-label="Hero"
    >
      {HERO_IMAGES.map((img, i) => (
        <HeroSlide key={i} image={img} isActive={activeSlide === i} index={i} />
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-brand-black/85 via-brand-black/30 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-brand-black/40 to-transparent" />

      <div className="relative z-10 w-full max-w-screen-xl mx-auto px-6 lg:px-10 pb-20 lg:pb-28">
        <motion.p
          className="font-sans text-xs text-brand-accent tracking-[0.25em] uppercase mb-5"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Smart Integration · Timeless Design
        </motion.p>

        <h1
          ref={titleRef}
          className="font-serif text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-brand-cream leading-[1.05] max-w-3xl mb-6 text-balance"
          style={{ opacity: gsapReady || reduced ? 1 : 0 }}
        >
          {t('title')}
        </h1>

        <motion.p
          className="font-sans text-base text-brand-cream/60 mb-10 tracking-wide"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
        >
          {t('subtitle')}
        </motion.p>

        <motion.div
          className="flex flex-wrap items-center gap-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <Link
            href={`/${locale}/contacto`}
            className="inline-flex items-center bg-brand-accent text-white font-sans text-xs tracking-[0.15em] uppercase px-7 py-3.5 hover:bg-brand-dark transition-colors duration-300"
          >
            {t('cta_primary')}
          </Link>
          <Link
            href={`/${locale}/proyectos`}
            className="inline-flex items-center gap-2 font-sans text-xs tracking-[0.12em] uppercase text-brand-cream/70 hover:text-brand-cream transition-colors duration-200"
          >
            {t('cta_secondary')}
            <ChevronDown size={14} />
          </Link>
        </motion.div>

        <motion.div
          className="absolute bottom-8 right-6 lg:right-10 flex items-center gap-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <div className="flex gap-1.5">
            {HERO_IMAGES.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  setActiveSlide(i)
                  if (intervalRef.current) {
                    clearInterval(intervalRef.current)
                    intervalRef.current = setInterval(
                      () => setActiveSlide((p) => (p + 1) % HERO_IMAGES.length),
                      6000
                    )
                  }
                }}
                aria-label={`Slide ${i + 1}`}
                className="transition-all duration-300"
              >
                <div
                  className={`h-px transition-all duration-300 ${
                    i === activeSlide ? 'w-8 bg-brand-accent' : 'w-3 bg-brand-cream/30'
                  }`}
                />
              </button>
            ))}
          </div>
          <span className="font-sans text-[10px] text-brand-cream/30 tracking-widest">
            {String(activeSlide + 1).padStart(2, '0')} /{' '}
            {String(HERO_IMAGES.length).padStart(2, '0')}
          </span>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-px h-8 bg-brand-cream/30"
          animate={{ scaleY: [1, 0.3, 1] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <div className="w-1 h-1 rounded-full bg-brand-accent" />
      </motion.div>
    </section>
  )
}
