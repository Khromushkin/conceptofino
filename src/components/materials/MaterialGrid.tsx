// src/components/materials/MaterialGrid.tsx
import type { Material, Locale } from '@/types'
import MaterialCard from './MaterialCard'
import RevealOnScroll from '@/components/ui/RevealOnScroll'

interface Props {
  materials: Material[]
  locale: Locale
}

export default function MaterialGrid({ materials, locale }: Props) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
      {materials.map((mat, i) => (
        <RevealOnScroll key={mat.id} delay={i * 0.08}>
          <MaterialCard material={mat} locale={locale} />
        </RevealOnScroll>
      ))}
    </div>
  )
}
