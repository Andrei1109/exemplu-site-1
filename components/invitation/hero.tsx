'use client'

import Image from 'next/image'
import { motion } from 'motion/react'
import { formatDate, type InvitationConfig } from '@/lib/invitation-config'
import { cn } from '@/lib/utils'
import { Monogram } from './monogram'
import { EASE, LineReveal } from './reveal'

function toRoman(value: number) {
  const map: [number, string][] = [
    [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
    [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
  ]
  let rest = value
  return map.reduce((out, [n, s]) => {
    while (rest >= n) {
      out += s
      rest -= n
    }
    return out
  }, '')
}

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
  const year = Number(formatDate(ceremonyStart, config, { year: 'numeric' }))

  const fade = (delay: number) => ({
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 1.4, ease: EASE, delay },
  })

  return (
    <header className="paper-grain relative flex min-h-svh flex-col lg:flex-row">
      <div className="flex min-h-svh flex-1 flex-col px-6 pb-8 pt-6 sm:px-10 sm:pt-8">
        <motion.div className="flex items-center justify-between gap-4 text-muted-foreground" {...fade(0.2)}>
          {guestName ? <p className="eyebrow">{`Pentru ${guestName}`}</p> : <span aria-hidden="true" />}
          <a
            href="#confirmare"
            className="eyebrow shrink-0 border-b border-transparent pb-0.5 transition-colors hover:border-espresso hover:text-espresso lg:hidden"
          >
            Confirmare
          </a>
        </motion.div>

        <div className="flex flex-1 flex-col items-center justify-center gap-10 py-14 text-center sm:gap-12">
          <ArchPhoto
            photo={heroPhoto}
            sizes="(min-width: 1024px) 1px, 12rem"
            delay={0.3}
            className="aspect-[3/4] w-40 sm:w-48 lg:hidden"
          />
          <Monogram
            initials={couple.initials}
            animated
            className="hidden w-32 text-[1.35rem] sm:w-40 sm:text-[1.7rem] lg:block"
          />

          <h1 className="font-serif font-light leading-[0.92] tracking-[-0.01em]">
            <LineReveal immediate delay={0.7} className="text-[clamp(3.4rem,15vw,8.5rem)] lg:text-[clamp(5rem,8vw,8.5rem)]">
              {couple.first}
            </LineReveal>
            <LineReveal immediate delay={0.9} className="my-2 text-[clamp(2.4rem,8vw,3.6rem)] italic text-sage sm:my-3">
              <span className="sr-only"> și </span>
              <span aria-hidden="true">&amp;</span>
            </LineReveal>
            <LineReveal immediate delay={1.05} className="text-[clamp(3.4rem,15vw,8.5rem)] lg:text-[clamp(5rem,8vw,8.5rem)]">
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

        <motion.div className="flex items-end justify-between text-muted-foreground" {...fade(1.6)}>
          <span className="eyebrow">{toRoman(year)}</span>
          <a href="#invitatia" className="group flex flex-col items-center gap-3" aria-label="Continuați spre invitație">
            <span className="eyebrow">Derulați</span>
            <span className="relative block h-10 w-px overflow-hidden bg-champagne" aria-hidden="true">
              <span className="absolute inset-x-0 top-0 h-1/2 bg-espresso motion-safe:animate-[scroll-cue_2.4s_ease-in-out_infinite]" />
            </span>
          </a>
          <span className="eyebrow">{config.platform.name}</span>
        </motion.div>
      </div>

      <div className="hidden lg:flex lg:h-svh lg:w-[44%] lg:flex-col lg:gap-6 lg:py-8 lg:pr-10 lg:sticky lg:top-0">
        <motion.div className="flex justify-end text-muted-foreground" {...fade(0.2)}>
          <a
            href="#confirmare"
            className="eyebrow border-b border-transparent pb-0.5 transition-colors hover:border-espresso hover:text-espresso"
          >
            Confirmare
          </a>
        </motion.div>
        <ArchPhoto photo={heroPhoto} priority sizes="44vw" delay={0.4} className="min-h-0 flex-1" />
        <motion.p className="eyebrow text-center text-muted-foreground" {...fade(1.8)}>
          {`${couple.first} & ${couple.second}`}
        </motion.p>
      </div>
    </header>
  )
}
