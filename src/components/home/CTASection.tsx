'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { useReducedMotion } from 'framer-motion'
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGES } from '@/lib/constants'
import type { Locale } from '@/types'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

interface Props {
  locale: Locale
}

export default function CTASection({ locale }: Props) {
  const t = useTranslations('cta')
  const reduced = useReducedMotion()
  const bgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (reduced || !bgRef.current) return
    let ctx: { revert: () => void } | null = null

    async function init() {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        gsap.to(bgRef.current!, {
          yPercent: -15,
          ease: 'none',
          scrollTrigger: {
            trigger: bgRef.current!.parentElement,
            start: 'top bottom',
            end: 'bottom top',
            scrub: true,
          },
        })
      })
    }

    init().catch(() => null)
    return () => ctx?.revert()
  }, [reduced])

  const waMessage = encodeURIComponent(WHATSAPP_MESSAGES[locale])

  return (
    <section className="relative overflow-hidden py-32 lg:py-48">
      <div
        ref={bgRef}
        className="absolute inset-[-20%] bg-cover bg-center"
        style={{
          backgroundImage:
            'url(/images/projects/cocinas/1-lg.webp)',
        }}
      />
      <div className="absolute inset-0 bg-brand-black/75" />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-black/50 to-transparent" />

      <div className="relative z-10 max-w-screen-xl mx-auto px-6 lg:px-10 text-center">
        <RevealOnScroll>
          <p className="font-sans text-xs tracking-[0.2em] uppercase text-brand-accent mb-5">
            {t('label')}
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-brand-cream leading-tight max-w-2xl mx-auto mb-4 text-balance">
            {t('title')}
          </h2>
          <p className="font-sans text-sm text-brand-cream/50 mb-10 tracking-wide">
            {t('subtitle')}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              href={`/${locale}/contacto`}
              className="inline-flex items-center bg-brand-accent text-white font-sans text-xs tracking-[0.2em] uppercase px-8 py-4 hover:bg-brand-dark transition-colors duration-300"
            >
              {t('primary')}
            </Link>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${waMessage}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center border border-brand-cream/30 text-brand-cream/70 font-sans text-xs tracking-[0.2em] uppercase px-8 py-4 hover:border-brand-accent hover:text-brand-accent transition-colors duration-300"
            >
              {t('whatsapp')}
            </a>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  )
}
