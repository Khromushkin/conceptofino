import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import { Globe, Share2, Phone, Mail, MapPin } from 'lucide-react'
import { getSiteSettings } from '@/lib/content'
import { getLocalizedField } from '@/lib/utils'
import type { Locale } from '@/types'

interface Props {
  locale: Locale
}

export default async function Footer({ locale }: Props) {
  const t = await getTranslations({ locale, namespace: 'footer' })
  const tNav = await getTranslations({ locale, namespace: 'nav' })
  const settings = await getSiteSettings()

  const navLinks = [
    { href: `/${locale}/proyectos`, label: tNav('projects') },
    { href: `/${locale}/materiales`, label: tNav('materials') },
    { href: `/${locale}/blog`, label: tNav('blog') },
    { href: `/${locale}/nosotros`, label: tNav('about') },
    { href: `/${locale}/contacto`, label: tNav('contact') },
  ]

  const serviceLinks = [
    { href: `/${locale}/servicios/diseno`, label: tNav('diseno') },
    { href: `/${locale}/servicios/fabricacion`, label: tNav('fabricacion') },
    { href: `/${locale}/servicios/montaje`, label: tNav('montaje') },
  ]

  return (
    <footer className="bg-brand-black text-brand-cream/70">
      <div className="max-w-screen-xl mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-6">
          <div className="lg:col-span-1">
            <p className="font-serif text-xl text-brand-cream tracking-wide mb-2">
              ConceptoFino
            </p>
            <p className="font-sans text-xs tracking-[0.12em] text-brand-accent uppercase mb-5">
              {t('tagline')}
            </p>
            <div className="flex items-center gap-4">
              <a
                href={settings.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-brand-cream/40 hover:text-brand-accent transition-colors"
              >
                <Globe size={18} />
              </a>
              <a
                href={`https://wa.me/${settings.whatsappNumber}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp"
                className="text-brand-cream/40 hover:text-brand-accent transition-colors"
              >
                <Phone size={18} />
              </a>
              <a
                href={settings.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-brand-cream/40 hover:text-brand-accent transition-colors"
              >
                <Share2 size={18} />
              </a>
            </div>
          </div>

          <div>
            <p className="font-sans text-xs tracking-[0.15em] uppercase text-brand-cream mb-4">
              {t('nav_title')}
            </p>
            <ul className="space-y-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-brand-cream/60 hover:text-brand-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-sans text-xs tracking-[0.15em] uppercase text-brand-cream mb-4">
              {t('services_title')}
            </p>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-sans text-sm text-brand-cream/60 hover:text-brand-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-sans text-xs tracking-[0.15em] uppercase text-brand-cream mb-4">
              {t('contact_title')}
            </p>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin size={14} className="text-brand-accent mt-0.5 flex-shrink-0" />
                <span className="font-sans text-sm text-brand-cream/60 leading-relaxed">
                  {getLocalizedField(settings.address, locale)}
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={14} className="text-brand-accent flex-shrink-0" />
                <a
                  href={`tel:${settings.phone.replace(/\s/g, '')}`}
                  className="font-sans text-sm text-brand-cream/60 hover:text-brand-accent transition-colors"
                >
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={14} className="text-brand-accent flex-shrink-0" />
                <a
                  href={`mailto:${settings.email}`}
                  className="font-sans text-sm text-brand-cream/60 hover:text-brand-accent transition-colors"
                >
                  {settings.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-brand-dark flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-sans text-xs text-brand-cream/30">
            {t('copyright')}
          </p>
          <div className="flex items-center gap-5">
            <Link
              href={`/${locale}/privacidad`}
              className="font-sans text-xs text-brand-cream/30 hover:text-brand-accent transition-colors"
            >
              {t('privacy')}
            </Link>
            <Link
              href={`/${locale}/aviso-legal`}
              className="font-sans text-xs text-brand-cream/30 hover:text-brand-accent transition-colors"
            >
              {t('legal')}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
