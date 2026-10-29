'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { formatDate, type InvitationConfig } from '@/lib/invitation-config'
import { cn } from '@/lib/utils'
import { Monogram } from './monogram'
import { EASE, LineReveal } from './reveal'

function ArchPhoto({
  photo,
  className,
  sizes,
  priority,
  delay,
}: {
  photo: InvitationConfig['heroPhoto']
  className?: string
  sizes: string
  priority?: boolean
  delay: number
}) {
  return (
    <motion.div
      className={cn('relative overflow-hidden rounded-t-full bg-paper', className)}
      initial={{ clipPath: 'inset(100% 0 0 0)' }}
      animate={{ clipPath: 'inset(0% 0 0 0)' }}
      transition={{ duration: 1.6, ease: EASE, delay }}
    >
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 2.4, ease: EASE, delay }}
      >
        <Image src={photo.src} alt={photo.alt} fill priority={priority} sizes={sizes} className="object-cover" />
      </motion.div>
    </motion.div>
  )
}

export function Hero({ config, guestName }: { config: InvitationConfig; guestName?: string }) {
  const { couple, ceremonyStart, heroPhoto } = config
  const weekday = formatDate(ceremonyStart, config, { weekday: 'long' })
  const numericDate = formatDate(ceremonyStart, config, { day: '2-digit', month: '2-digit', year: 'numeric' })
  const time = formatDate(ceremonyStart, config, { hour: '2-digit', minute: '2-digit' })

  const fade = (delay: number) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 1.4, ease: EASE, delay },
  })

  return (
    <header className="paper-grain relative flex min-h-svh flex-col lg:flex-row">
      <div className="flex min-h-svh flex-1 flex-col px-6 pb-6 pt-5 sm:px-10 sm:pb-8 sm:pt-8">
        {guestName && (
          <motion.p className="eyebrow text-muted-foreground" {...fade(0.2)}>
            {`Pentru ${guestName}`}
          </motion.p>
        )}

        <div className="flex flex-1 flex-col items-center justify-center gap-5 py-4 text-center sm:gap-12 sm:py-14">
          <ArchPhoto
            photo={heroPhoto}
            sizes="(min-width: 1024px) 1px, (min-width: 640px) 20rem, 78vw"
            delay={0.3}
            className="aspect-[3/4] h-[38svh] max-w-[78vw] sm:h-auto sm:w-80 lg:hidden"
          />
          <Monogram
            initials={couple.initials}
            animated
            className="hidden w-32 text-[1.35rem] sm:w-40 sm:text-[1.7rem] lg:block"
          />

          <h1 className="font-serif font-light leading-[0.92] tracking-[-0.01em]">
            <LineReveal immediate delay={0.7} className="text-[clamp(2.75rem,13vw,8.5rem)] lg:text-[clamp(5rem,8vw,8.5rem)]">
              {couple.first}
            </LineReveal>
            <LineReveal immediate delay={0.9} className="my-1 text-[clamp(1.75rem,6vw,3.6rem)] italic text-sage sm:my-3">
              <span className="sr-only"> și </span>
              <span aria-hidden="true">&amp;</span>
            </LineReveal>
            <LineReveal immediate delay={1.05} className="text-[clamp(2.75rem,13vw,8.5rem)] lg:text-[clamp(5rem,8vw,8.5rem)]">
              {couple.second}
            </LineReveal>
          </h1>

          <motion.dl
            className="flex items-stretch justify-center text-espresso"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease: EASE, delay: 1.35 }}
          >
            <div className="flex flex-col items-center gap-2 px-4 sm:px-8">
              <dt className="eyebrow text-muted-foreground">Ziua</dt>
              <dd className="font-serif text-lg capitalize sm:text-xl">{weekday}</dd>
            </div>
            <div className="flex flex-col items-center gap-2 border-x border-champagne px-4 sm:px-8">
              <dt className="eyebrow text-muted-foreground">Data</dt>
              <dd className="font-serif text-lg tabular-nums tracking-[0.12em] sm:text-xl">{numericDate}</dd>
            </div>
            <div className="flex flex-col items-center gap-2 px-4 sm:px-8">
              <dt className="eyebrow text-muted-foreground">Ora</dt>
              <dd className="font-serif text-lg tabular-nums sm:text-xl">{time}</dd>
            </div>
          </motion.dl>
        </div>

      </div>

      <div className="hidden lg:flex lg:h-svh lg:w-[44%] lg:flex-col lg:gap-6 lg:py-8 lg:pr-10 lg:sticky lg:top-0">
        <ArchPhoto photo={heroPhoto} priority sizes="44vw" delay={0.4} className="min-h-0 flex-1" />
        <motion.p className="eyebrow text-center text-muted-foreground" {...fade(1.8)}>
          {`${couple.first} & ${couple.second}`}
        </motion.p>
      </div>
    </header>
  )
}
