'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, ChevronDown } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/constants'
import type { Locale } from '@/types'
import LanguageSwitcher from './LanguageSwitcher'
import MobileMenu from './MobileMenu'
import { cn } from '@/lib/utils'

interface Props {
  locale: Locale
}

type DropdownKey = keyof typeof NAV_ITEMS

export default function Header({ locale }: Props) {
  const t = useTranslations('nav')
  const [isVisible, setIsVisible] = useState(true)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<DropdownKey | null>(null)
  const lastScrollY = useRef(0)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY
      setIsScrolled(currentY > 50)
      setIsVisible(currentY < lastScrollY.current || currentY < 100)
      lastScrollY.current = currentY
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  function openDropdown(key: DropdownKey) {
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    setActiveDropdown(key)
  }

  function scheduleClose() {
    closeTimerRef.current = setTimeout(() => setActiveDropdown(null), 150)
  }

  const navSections: { key: DropdownKey; label: string }[] = [
    { key: 'proyectos', label: t('projects') },
    { key: 'materiales', label: t('materials') },
    { key: 'servicios', label: t('services') },
  ]

  const simpleLinks = [
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}/nosotros`, label: t('about') },
    { href: `/${locale}/contacto`, label: t('contact') },
  ]

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-30 transition-all duration-300',
          isScrolled
            ? 'bg-white/80 backdrop-blur-md border-b border-brand-light/50 shadow-sm'
            : 'bg-transparent'
        )}
        initial={{ y: 0 }}
        animate={{ y: isVisible ? 0 : -100 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="max-w-screen-xl mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link
              href={`/${locale}`}
              className="font-serif text-xl text-brand-black tracking-wide hover:text-brand-accent transition-colors"
            >
              ConceptoFino
            </Link>

            <nav className="hidden lg:flex items-center gap-6">
              {navSections.map((section) => (
                <div
                  key={section.key}
                  className="relative"
                  onMouseEnter={() => openDropdown(section.key)}
                  onMouseLeave={scheduleClose}
                >
                  <button
                    className="flex items-center gap-1 font-sans text-xs tracking-[0.1em] uppercase text-brand-dark hover:text-brand-accent transition-colors duration-200"
                    aria-expanded={activeDropdown === section.key}
                    aria-haspopup="true"
                  >
                    {section.label}
                    <ChevronDown size={12} />
                  </button>

                  <AnimatePresence>
                    {activeDropdown === section.key && (
                      <motion.div
                        className="absolute top-full left-0 mt-2 w-52 bg-white border border-brand-light shadow-lg"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        onMouseEnter={() => openDropdown(section.key)}
                        onMouseLeave={scheduleClose}
                      >
                        <ul className="py-2">
                          {NAV_ITEMS[section.key].map((item) => (
                            <li key={item.href}>
                              <Link
                                href={`/${locale}${item.href}`}
                                className="block px-4 py-2.5 font-sans text-xs tracking-wide text-brand-dark hover:text-brand-accent hover:bg-brand-cream transition-colors duration-150"
                              >
                                {t(item.key as Parameters<typeof t>[0])}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {simpleLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-sans text-xs tracking-[0.1em] uppercase text-brand-dark hover:text-brand-accent transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="hidden lg:flex items-center gap-5">
              <a
                href="tel:+34657575939"
                className="font-sans text-xs text-brand-gray hover:text-brand-black transition-colors tracking-wide"
              >
                +34 657 575 939
              </a>
              <LanguageSwitcher />
            </div>

            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-brand-black"
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileMenu
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        locale={locale}
      />
    </>
  )
}
