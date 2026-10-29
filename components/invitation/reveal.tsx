'use client'

import { motion, MotionConfig } from 'motion/react'
import type { ReactNode } from 'react'

export const EASE = [0.22, 1, 0.36, 1] as const

export function InvitationMotion({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>
}

export function Reveal({
  children,
  delay = 0,
  className,
  as = 'div',
}: {
  children: ReactNode
  delay?: number
  className?: string
  as?: 'div' | 'li' | 'p'
}) {
  const Component = motion[as]
  return (
    <Component
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -10% 0px' }}
      transition={{ duration: 1.1, ease: EASE, delay }}
    >
      {children}
    </Component>
  )
}

/** Typography rising from behind a baseline mask. */
export function LineReveal({
  children,
  delay = 0,
  className,
  immediate = false,
}: {
  children: ReactNode
  delay?: number
  className?: string
  immediate?: boolean
}) {
  const variants = {
    hidden: { y: '105%', opacity: 0 },
    shown: { y: '0%', opacity: 1, transition: { duration: 1.2, ease: EASE, delay } },
  }
  // The observer sits on the unclipped mask; the clipped inner line would never report as visible.
  return (
    <motion.span
      className={`block overflow-hidden pb-[0.12em] ${className ?? ''}`}
      initial="hidden"
      {...(immediate
        ? { animate: 'shown' }
        : { whileInView: 'shown', viewport: { once: true, margin: '0px 0px -10% 0px' } })}
    >
      <motion.span className="block" variants={variants}>
        {children}
      </motion.span>
    </motion.span>
  )
}
