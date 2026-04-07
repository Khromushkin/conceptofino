// src/components/projects/SimilarProjectCTA.tsx
'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import type { Locale } from '@/types'

const schema = z.object({
  nombre: z.string().min(2),
  telefono: z.string().min(9),
  email: z.string().email(),
})

type FormData = z.infer<typeof schema>

interface Props {
  projectSlug: string
  locale: Locale
}

export default function SimilarProjectCTA({ projectSlug }: Props) {
  const t = useTranslations('lead_form')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  async function onSubmit(data: FormData) {
    setStatus('loading')
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, projectSlug }),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        throw new Error('API unavailable')
      }
    } catch {
      const msg = encodeURIComponent(
        `Hola, soy ${data.nombre} (${data.telefono}). Me interesa un proyecto similar a: ${projectSlug}`
      )
      window.open(`https://wa.me/34657575939?text=${msg}`, '_blank')
      setStatus('success')
    }
  }

  return (
    <section className="py-16 bg-brand-cream">
      <div className="max-w-lg mx-auto px-6">
        <h3 className="font-serif text-2xl text-brand-black mb-2">{t('title')}</h3>
        <p className="font-sans text-sm text-brand-gray mb-8">{t('subtitle')}</p>

        <AnimatePresence mode="wait">
          {status === 'success' ? (
            <motion.p
              key="success"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="font-sans text-sm text-green-700 bg-green-50 p-4 border border-green-200"
            >
              {t('success')}
            </motion.p>
          ) : (
            <motion.form
              key="form"
              onSubmit={handleSubmit(onSubmit)}
              className="space-y-4"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {(
                [
                  { field: 'nombre' as const, label: t('name'), type: 'text' },
                  { field: 'telefono' as const, label: t('phone'), type: 'tel' },
                  { field: 'email' as const, label: t('email'), type: 'email' },
                ] as const
              ).map(({ field, label, type }) => (
                <div key={field}>
                  <input
                    {...register(field)}
                    type={type}
                    placeholder={label}
                    className="w-full border-b border-brand-gray/30 bg-transparent py-3 font-sans text-sm text-brand-black placeholder:text-brand-gray/50 focus:outline-none focus:border-brand-accent transition-colors"
                    aria-invalid={!!errors[field]}
                  />
                  {errors[field] && (
                    <p className="mt-1 font-sans text-xs text-red-500">
                      {errors[field]?.message}
                    </p>
                  )}
                </div>
              ))}

              <button
                type="submit"
                disabled={status === 'loading'}
                className="w-full bg-brand-accent text-white font-sans text-xs tracking-[0.2em] uppercase py-3.5 hover:bg-brand-dark transition-colors disabled:opacity-50"
              >
                {status === 'loading' ? '...' : t('submit')}
              </button>

              {status === 'error' && (
                <p className="font-sans text-xs text-red-500 text-center">
                  {t('error')}
                </p>
              )}
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
