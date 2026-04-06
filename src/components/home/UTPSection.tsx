'use client'

import { useEffect, useRef, useState } from 'react'
import { useTranslations } from 'next-intl'
import { motion, useInView } from 'framer-motion'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import SectionHeading from '@/components/ui/SectionHeading'

interface StatProps {
  value: string
  label: string
  delay: number
}

function AnimatedStat({ value, label, delay }: StatProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const [displayed, setDisplayed] = useState('0')

  useEffect(() => {
    if (!isInView) return

    const match = value.match(/^([+]?)(\d+)(%?)$/)
    if (!match) {
      setDisplayed(value)
      return
    }
    const prefix = match[1]
    const target = parseInt(match[2], 10)
    const suffix = match[3]

    const duration = 1800
    const start = performance.now()

    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      const current = Math.round(eased * target)
      setDisplayed(`${prefix}${current}${suffix}`)
      if (progress < 1) requestAnimationFrame(tick)
    }

    const timer = setTimeout(() => requestAnimationFrame(tick), delay * 1000)
    return () => clearTimeout(timer)
  }, [isInView, value, delay])

  return (
    <div ref={ref} className="border-l-2 border-brand-accent pl-5">
      <p className="font-serif text-4xl lg:text-5xl text-brand-black leading-none mb-1">
        {displayed}
      </p>
      <p className="font-sans text-xs tracking-[0.15em] uppercase text-brand-gray">
        {label}
      </p>
    </div>
  )
}

export default function UTPSection() {
  const t = useTranslations('utp')

  const stats: StatProps[] = [
    { value: t('stat1_value'), label: t('stat1_label'), delay: 0 },
    { value: t('stat2_value'), label: t('stat2_label'), delay: 0.15 },
    { value: t('stat3_value'), label: t('stat3_label'), delay: 0.3 },
  ]

  return (
    <section className="py-24 lg:py-32 bg-brand-cream">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div>
            <RevealOnScroll>
              <SectionHeading
                label={t('label')}
                title={t('title')}
                subtitle={t('body')}
              />
            </RevealOnScroll>
          </div>

          <div className="flex flex-col gap-8">
            {stats.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{
                  delay: i * 0.12,
                  duration: 0.6,
                  ease: [0.16, 1, 0.3, 1],
                }}
              >
                <AnimatedStat {...stat} />
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
