'use client'

import { motion } from 'motion/react'
import { cn } from '@/lib/utils'
import { EASE } from './reveal'

type MonogramProps = {
  initials: [string, string]
  animated?: boolean
  className?: string
  label?: string
}

export function Monogram({ initials, animated = false, className, label }: MonogramProps) {
  const [first, second] = initials
  const draw = animated
    ? { initial: { pathLength: 0, opacity: 0 }, animate: { pathLength: 1, opacity: 1 } }
    : { initial: false as const }
  const letter = (delay: number) =>
    animated
      ? {
          initial: { opacity: 0, y: 8 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 1.2, ease: EASE, delay },
        }
      : { initial: false as const }

  return (
    <div
      role="img"
      aria-label={label ?? `Monograma ${first} și ${second}`}
      className={cn('relative aspect-square text-espresso', className)}
    >
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90 overflow-visible" aria-hidden="true">
        <motion.circle
          cx="50"
          cy="50"
          r="49"
          fill="none"
          stroke="var(--inv-sage)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          {...draw}
          transition={{ duration: 1.8, ease: EASE }}
        />
        <motion.line
          x1="30"
          y1="27"
          x2="70"
          y2="73"
          stroke="var(--inv-champagne)"
          strokeWidth="1"
          vectorEffect="non-scaling-stroke"
          {...draw}
          transition={{ duration: 1.1, ease: EASE, delay: 0.7 }}
        />
      </svg>
      <motion.span
        aria-hidden="true"
        className="absolute left-[22%] top-[14%] font-serif text-[2.6em] font-light italic leading-none"
        {...letter(0.35)}
      >
        {first}
      </motion.span>
      <motion.span
        aria-hidden="true"
        className="absolute bottom-[16%] right-[20%] font-serif text-[2.6em] font-light italic leading-none"
        {...letter(0.55)}
      >
        {second}
      </motion.span>
    </div>
  )
}
