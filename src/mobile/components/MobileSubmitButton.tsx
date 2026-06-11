import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  onClick: () => void
  disabled?: boolean
  variant?: 'primary' | 'secondary'
}

export default function MobileSubmitButton({ children, onClick, disabled, variant = 'primary' }: Props) {
  return (
    <motion.button
      type="button"
      whileTap={disabled ? undefined : { scale: 0.97 }}
      onClick={onClick}
      disabled={disabled}
      className={`mobile-quiz__submit-btn w-full font-black transition-all
        ${variant === 'primary'
          ? 'mobile-quiz__submit-btn--primary'
          : 'mobile-quiz__submit-btn--secondary'}
        disabled:opacity-40`}
    >
      {children}
    </motion.button>
  )
}
