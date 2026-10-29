'use client'

import { useEffect, useState } from 'react'
import { formatDate, type InvitationConfig } from '@/lib/invitation-config'
import { Reveal } from './reveal'

const MINUTE = 60_000

function plural(value: number, one: string, many: string) {
  return value === 1 ? one : many
}

export function Countdown({ config }: { config: InvitationConfig }) {
  const [now, setNow] = useState<number | null>(null)

  useEffect(() => {
    setNow(Date.now())
    const id = window.setInterval(() => setNow(Date.now()), 15_000)
    return () => window.clearInterval(id)
  }, [])

  const start = new Date(config.ceremonyStart).getTime()
  const end = new Date(config.celebrationEnd).getTime()
  const dateLabel = formatDate(config.ceremonyStart, config, { day: 'numeric', month: 'long', year: 'numeric' })

  let content: React.ReactNode
  if (now === null) {
    content = <div className="h-24" aria-hidden="true" />
  } else if (now >= end) {
    content = (
      <p className="max-w-xl font-serif text-2xl font-light italic leading-relaxed text-balance sm:text-3xl">
        {`Pe ${dateLabel} ne-am spus „da”. Vă mulțumim că ați fost parte din ziua noastră.`}
      </p>
    )
  } else if (now >= start) {
    content = <p className="font-serif text-3xl font-light italic sm:text-4xl">Astăzi este ziua cea mare.</p>
  } else {
    const remaining = Math.max(0, start - now)
    const days = Math.floor(remaining / (1440 * MINUTE))
    const hours = Math.floor((remaining % (1440 * MINUTE)) / (60 * MINUTE))
    const minutes = Math.floor((remaining % (60 * MINUTE)) / MINUTE)
    const units = [
      { value: days, label: plural(days, 'zi', 'zile') },
      { value: hours, label: plural(hours, 'oră', 'ore') },
      { value: minutes, label: plural(minutes, 'minut', 'minute') },
    ]
    content = (
      <>
        <p className="sr-only">{`Mai sunt ${days} ${units[0].label}, ${hours} ${units[1].label} și ${minutes} ${units[2].label}.`}</p>
        <ol className="flex items-start justify-center" aria-hidden="true">
          {units.map((unit, i) => (
            <li
              key={unit.label}
              className={`flex min-w-24 flex-col items-center gap-3 px-4 sm:min-w-36 sm:px-8 ${i > 0 ? 'border-l border-ivory/25' : ''}`}
            >
              <span className="font-serif text-5xl font-light tabular-nums leading-none sm:text-7xl">
                {String(unit.value).padStart(2, '0')}
              </span>
              <span className="eyebrow text-champagne">{unit.label}</span>
            </li>
          ))}
        </ol>
      </>
    )
  }

  return (
    <section aria-label="Timp rămas până la nuntă" className="paper-grain bg-sage px-6 py-20 text-ivory sm:py-24">
      <Reveal className="mx-auto flex max-w-3xl flex-col items-center gap-8 text-center">
        <p className="eyebrow text-champagne">Până la ziua noastră</p>
        <div aria-live="off">{content}</div>
      </Reveal>
    </section>
  )
}
