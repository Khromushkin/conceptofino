import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import type { Locale } from '@/types'
import RevealOnScroll from '@/components/ui/RevealOnScroll'
import SectionHeading from '@/components/ui/SectionHeading'

interface Props {
  locale: Locale
}

export default async function ServicesPreview({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'services' })

  const steps = [
    {
      num: '01',
      title: t('step1'),
      desc: t('step1_desc'),
      href: `/${locale}/servicios/diseno`,
    },
    {
      num: '02',
      title: t('step2'),
      desc: t('step2_desc'),
      href: `/${locale}/servicios/fabricacion`,
    },
    {
      num: '03',
      title: t('step3'),
      desc: t('step3_desc'),
      href: `/${locale}/servicios/montaje`,
    },
  ]

  return (
    <section className="py-24 lg:py-32 bg-brand-white">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
        <RevealOnScroll>
          <SectionHeading
            label=""
            title={t('title')}
            subtitle={t('subtitle')}
            align="center"
            className="mb-16"
          />
        </RevealOnScroll>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
          {steps.map((step, i) => (
            <RevealOnScroll key={step.num} delay={i * 0.12}>
              <Link href={step.href} className="group block">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="w-14 h-14 rounded-full border border-brand-accent/40 group-hover:border-brand-accent flex items-center justify-center transition-colors duration-300">
                    <span className="font-sans text-xs tracking-[0.2em] text-brand-accent">{step.num}</span>
                  </div>
                  <h3 className="font-serif text-xl text-brand-black group-hover:text-brand-accent transition-colors duration-200">
                    {step.title}
                  </h3>
                  <p className="font-sans text-sm text-brand-gray leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              </Link>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  )
}
