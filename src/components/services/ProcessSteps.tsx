// src/components/services/ProcessSteps.tsx
import Image from 'next/image'
import type { ServiceStep, Locale } from '@/types'
import { getLocalizedField } from '@/lib/utils'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

interface Props {
  steps: ServiceStep[]
  locale: Locale
}

export default function ProcessSteps({ steps, locale }: Props) {
  return (
    <div className="space-y-24">
      {steps.map((step, i) => (
        <RevealOnScroll key={i} delay={0.1}>
          <div
            className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
              i % 2 === 1 ? 'lg:grid-flow-dense' : ''
            }`}
          >
            {/* Image */}
            <div className={i % 2 === 1 ? 'lg:col-start-2' : ''}>
              <div className="relative h-[360px] overflow-hidden">
                <Image
                  src={step.imageUrl}
                  alt={getLocalizedField(step.title, locale)}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>
            </div>

            {/* Text */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <span className="font-serif text-5xl text-brand-accent/30 leading-none">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="w-8 h-px bg-brand-accent" />
              </div>
              <h3 className="font-serif text-2xl lg:text-3xl text-brand-black">
                {getLocalizedField(step.title, locale)}
              </h3>
              <p className="font-sans text-base text-brand-gray leading-relaxed">
                {getLocalizedField(step.description, locale)}
              </p>
            </div>
          </div>
        </RevealOnScroll>
      ))}
    </div>
  )
}
