'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

const variantClasses: Record<NonNullable<ButtonProps['variant']>, string> = {
  primary:
    'bg-brand-accent text-white hover:bg-brand-dark transition-colors duration-300',
  secondary:
    'bg-brand-black text-brand-cream hover:bg-brand-dark transition-colors duration-300',
  ghost:
    'text-brand-black hover:text-brand-accent transition-colors duration-300',
  outline:
    'border border-brand-black text-brand-black hover:bg-brand-black hover:text-brand-cream transition-colors duration-300',
}

const sizeClasses: Record<NonNullable<ButtonProps['size']>, string> = {
  sm: 'px-4 py-2 text-xs tracking-[0.2em] uppercase',
  md: 'px-6 py-3 text-xs tracking-[0.2em] uppercase',
  lg: 'px-8 py-4 text-sm tracking-[0.2em] uppercase',
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center font-sans font-medium focus-visible:ring-2 focus-visible:ring-brand-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
