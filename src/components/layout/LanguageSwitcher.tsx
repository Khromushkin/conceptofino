'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useLocale } from 'next-intl'
import type { Locale } from '@/types'
import { cn } from '@/lib/utils'

const LOCALES: { code: Locale; label: string }[] = [
  { code: 'es', label: 'ES' },
  { code: 'en', label: 'EN' },
  { code: 'ru', label: 'RU' },
]

interface Props {
  light?: boolean
}

export default function LanguageSwitcher({ light = false }: Props) {
  const locale = useLocale() as Locale
  const router = useRouter()
  const pathname = usePathname()

  function switchLocale(newLocale: Locale) {
    const segments = pathname.split('/')
    segments[1] = newLocale
    const newPath = segments.join('/')
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000`
    router.push(newPath)
  }

  return (
    <div className="flex items-center gap-1" aria-label="Language switcher">
      {LOCALES.map((loc, i) => (
        <span key={loc.code} className="flex items-center">
          <button
            onClick={() => switchLocale(loc.code)}
            aria-label={`Switch to ${loc.label}`}
            aria-current={locale === loc.code ? 'true' : undefined}
            className={cn(
              'font-sans text-[10px] tracking-[0.12em] uppercase transition-colors duration-200',
              locale === loc.code
                ? 'text-brand-accent'
                : light
                ? 'text-brand-cream/40 hover:text-brand-cream/70'
                : 'text-brand-gray hover:text-brand-black'
            )}
          >
            {loc.label}
          </button>
          {i < LOCALES.length - 1 && (
            <span
              className={cn(
                'mx-1.5 text-[8px]',
                light ? 'text-brand-cream/20' : 'text-brand-gray/40'
              )}
            >
              ·
            </span>
          )}
        </span>
      ))}
    </div>
  )
}
