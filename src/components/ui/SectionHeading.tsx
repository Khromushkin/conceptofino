import { cn } from '@/lib/utils'

interface SectionHeadingProps {
  label?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
  light?: boolean
  className?: string
}

export default function SectionHeading({
  label,
  title,
  subtitle,
  align = 'left',
  light = false,
  className,
}: SectionHeadingProps) {
  const alignClass = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  }[align]

  return (
    <div className={cn('space-y-3', alignClass, className)}>
      {label && (
        <p className="text-xs font-sans tracking-[0.2em] uppercase text-brand-accent">
          {label}
        </p>
      )}
      <h2
        className={cn(
          'font-serif leading-tight',
          'text-3xl sm:text-4xl lg:text-5xl',
          light ? 'text-brand-cream' : 'text-brand-black'
        )}
      >
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            'font-sans text-base leading-relaxed max-w-2xl',
            align === 'center' ? 'mx-auto' : '',
            light ? 'text-brand-cream/60' : 'text-brand-gray'
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  )
}
