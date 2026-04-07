// src/components/contact/ContactForm.tsx
'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslations } from 'next-intl'

const schema = z.object({
  nombre: z.string().min(2),
  email: z.string().email(),
  telefono: z.string().min(9),
  servicio: z.string().min(1),
  mensaje: z.string().min(10),
})

type FormData = z.infer<typeof schema>

export default function ContactForm() {
  const t = useTranslations('contact')
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
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setStatus('success')
      } else {
        throw new Error('API unavailable')
      }
    } catch {
      // Static hosting fallback: open WhatsApp with pre-filled message
      const msg = encodeURIComponent(
        `Hola, soy ${data.nombre}. Me interesa: ${data.servicio}. ${data.mensaje}`
      )
      window.open(`https://wa.me/34657575939?text=${msg}`, '_blank')
      setStatus('success')
    }
  }

  const services = [
    { value: 'diseno', label: t('service_diseno') },
    { value: 'fabricacion', label: t('service_fabricacion') },
    { value: 'montaje', label: t('service_montaje') },
    { value: 'integral', label: t('service_integral') },
    { value: 'other', label: t('service_other') },
  ]

  const inputClass =
    'w-full border-b border-brand-gray/30 bg-transparent py-3 font-sans text-sm text-brand-black placeholder:text-brand-gray/50 focus:outline-none focus:border-brand-accent transition-colors'

  return (
    <AnimatePresence mode="wait">
      {status === 'success' ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-12 text-center"
        >
          <div className="w-12 h-12 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-green-600 text-xl">✓</span>
          </div>
          <p className="font-serif text-xl text-brand-black mb-2">
            {t('form_success')}
          </p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          noValidate
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <input
                {...register('nombre')}
                type="text"
                placeholder={t('form_name')}
                className={inputClass}
                aria-invalid={!!errors.nombre}
              />
              {errors.nombre && (
                <p className="mt-1 font-sans text-xs text-red-500">
                  Campo requerido
                </p>
              )}
            </div>
            <div>
              <input
                {...register('email')}
                type="email"
                placeholder={t('form_email')}
                className={inputClass}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="mt-1 font-sans text-xs text-red-500">
                  Email inválido
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <input
                {...register('telefono')}
                type="tel"
                placeholder={t('form_phone')}
                className={inputClass}
                aria-invalid={!!errors.telefono}
              />
              {errors.telefono && (
                <p className="mt-1 font-sans text-xs text-red-500">
                  Campo requerido
                </p>
              )}
            </div>
            <div>
              <select
                {...register('servicio')}
                className={`${inputClass} cursor-pointer`}
                defaultValue=""
                aria-invalid={!!errors.servicio}
              >
                <option value="" disabled>
                  {t('form_service')}
                </option>
                {services.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <textarea
              {...register('mensaje')}
              placeholder={t('form_message')}
              rows={4}
              className={`${inputClass} resize-none`}
              aria-invalid={!!errors.mensaje}
            />
            {errors.mensaje && (
              <p className="mt-1 font-sans text-xs text-red-500">
                Mínimo 10 caracteres
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={status === 'loading'}
            className="w-full sm:w-auto bg-brand-accent text-white font-sans text-xs tracking-[0.2em] uppercase px-10 py-4 hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
            {status === 'loading' ? '...' : t('form_submit')}
          </button>

          {status === 'error' && (
            <p className="font-sans text-xs text-red-500">{t('form_error')}</p>
          )}
        </motion.form>
      )}
    </AnimatePresence>
  )
}
