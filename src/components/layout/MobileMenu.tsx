'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ChevronDown, X } from 'lucide-react'
import { NAV_ITEMS } from '@/lib/constants'
import type { Locale } from '@/types'
import LanguageSwitcher from './LanguageSwitcher'

interface Props {
  isOpen: boolean
  onClose: () => void
  locale: Locale
}

type AccordionKey = keyof typeof NAV_ITEMS

export default function MobileMenu({ isOpen, onClose, locale }: Props) {
  const t = useTranslations('nav')
  const [openSection, setOpenSection] = useState<AccordionKey | null>(null)

  const sections: { key: AccordionKey; label: string }[] = [
    { key: 'proyectos', label: t('projects') },
    { key: 'materiales', label: t('materials') },
    { key: 'servicios', label: t('services') },
  ]

  const topLinks = [
    { href: `/${locale}/blog`, label: t('blog') },
    { href: `/${locale}/nosotros`, label: t('about') },
    { href: `/${locale}/contacto`, label: t('contact') },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-brand-black/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="fixed inset-y-0 right-0 z-50 w-full max-w-sm bg-brand-cream flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', ease: [0.16, 1, 0.3, 1], duration: 0.4 }}
          >
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-light">
              <img src="/images/logo.webp" alt="ConceptoFino" className="h-8 w-auto brightness-0" />
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="p-2 text-brand-gray hover:text-brand-black transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 overflow-y-auto px-6 py-6 space-y-1">
              {sections.map((section) => (
                <div key={section.key} className="border-b border-brand-light pb-1">
                  <button
                    onClick={() =>
                      setOpenSection(
                        openSection === section.key ? null : section.key
                      )
                    }
                    className="flex w-full items-center justify-between py-3 font-sans text-sm text-brand-black tracking-wide"
                    aria-expanded={openSection === section.key}
                  >
                    {section.label}
                    <motion.span
                      animate={{ rotate: openSection === section.key ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <ChevronDown size={16} className="text-brand-gray" />
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {openSection === section.key && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <ul className="pb-2 space-y-1">
                          {NAV_ITEMS[section.key].map((item) => (
                            <li key={item.href}>
                              <Link
                                href={`/${locale}${item.href}`}
                                onClick={onClose}
                                className="block py-2 pl-3 font-sans text-sm text-brand-gray hover:text-brand-accent transition-colors"
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

              {topLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={onClose}
                  className="block py-3 border-b border-brand-light font-sans text-sm text-brand-black hover:text-brand-accent transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="px-6 py-5 border-t border-brand-light space-y-3">
              <a
                href="tel:+34657575939"
                className="block font-sans text-sm text-brand-black tracking-wide"
              >
                +34 657 575 939
              </a>
              <LanguageSwitcher />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
