// src/app/[locale]/servicios/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getServiceBySlug } from '@/lib/content'
import type { Locale, ServiceSlug } from '@/types'
import { getLocalizedField } from '@/lib/utils'
import ProcessSteps from '@/components/services/ProcessSteps'
import CTASection from '@/components/home/CTASection'

interface Props {
  params: Promise<{ locale: string; slug: string }>
}

export default async function ServicePage({ params }: Props) {
  const { locale, slug } = await params
  const loc = locale as Locale
  const service = await getServiceBySlug(slug as ServiceSlug)
  if (!service) notFound()

  return (
    <>
      <div className="pt-24 lg:pt-32">
        {/* Hero */}
        <div className="relative h-[50vh] min-h-[360px]">
          <Image
            src={service.mainImage.src}
            alt={getLocalizedField(service.mainImage.alt, loc)}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-black/70 to-transparent" />
          <div className="absolute bottom-8 left-0 right-0 max-w-screen-xl mx-auto px-6 lg:px-10">
            <h1 className="font-serif text-4xl lg:text-5xl text-brand-cream">
              {getLocalizedField(service.title, loc)}
            </h1>
          </div>
        </div>

        <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-20">
          <p className="font-sans text-base text-brand-gray leading-relaxed max-w-2xl mb-20">
            {getLocalizedField(service.description, loc)}
          </p>
          <ProcessSteps steps={service.steps} locale={loc} />
        </div>
      </div>

      <CTASection locale={loc} />
    </>
  )
}
