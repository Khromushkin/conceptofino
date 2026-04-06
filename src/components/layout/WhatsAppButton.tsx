'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle } from 'lucide-react'
import { WHATSAPP_NUMBER, WHATSAPP_MESSAGES } from '@/lib/constants'
import type { Locale } from '@/types'

interface Props {
  locale: Locale
}

export default function WhatsAppButton({ locale }: Props) {
  const [isVisible, setIsVisible] = useState(false)
  const [showButton, setShowButton] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const timer = setTimeout(() => setShowButton(true), 3000)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    function handleScroll() {
      const currentY = window.scrollY
      setIsVisible(currentY < lastScrollY.current || currentY < 200)
      lastScrollY.current = currentY
    }
    setIsVisible(true)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const message = encodeURIComponent(WHATSAPP_MESSAGES[locale])
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${message}`

  return (
    <AnimatePresence>
      {showButton && isVisible && (
        <motion.a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Contactar por WhatsApp"
          className="fixed bottom-6 right-6 z-40 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white shadow-lg hover:bg-[#1ebe5d] transition-colors duration-300 rounded-full"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <MessageCircle size={26} fill="white" />
        </motion.a>
      )}
    </AnimatePresence>
  )
}
