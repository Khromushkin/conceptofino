'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { useReducedMotion } from 'framer-motion'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

export default function PhilosophySection() {
  const t = useTranslations('philosophy')
  const reduced = useReducedMotion()
  const titleRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    if (reduced || !titleRef.current) return
    let ctx: { revert: () => void } | null = null

    async function init() {
      const gsap = (await import('gsap')).default
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      gsap.registerPlugin(ScrollTrigger)

      ctx = gsap.context(() => {
        gsap.from(titleRef.current!, {
          opacity: 0,
          y: 40,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 80%',
            once: true,
          },
        })
      })
    }

    init().catch(() => null)
    return () => ctx?.revert()
  }, [reduced])

  return (
    <section className="py-24 lg:py-32 bg-brand-light">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <RevealOnScroll direction="left">
            <div className="relative h-[420px] lg:h-[560px] overflow-hidden">
              <Image
                src="/images/projects/paneles_de_pared_y_techo_de_madera/1-lg.webp"
                alt="ConceptoFino workshop"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 border border-brand-accent/20" />
            </div>
          </RevealOnScroll>

          <div className="space-y-6">
            <p className="font-sans text-xs tracking-[0.2em] uppercase text-brand-accent">
              {t('label')}
            </p>
            <h2
              ref={titleRef}
              className="font-serif text-3xl lg:text-4xl xl:text-5xl text-brand-black leading-tight"
            >
              {t('title')}
            </h2>
            <div className="w-10 h-px bg-brand-accent" />
            <p className="font-sans text-base text-brand-gray leading-relaxed">
              {t('body')}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
