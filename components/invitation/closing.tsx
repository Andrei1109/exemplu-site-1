import { formatDate, type InvitationConfig } from '@/lib/invitation-config'
import { Monogram } from './monogram'
import { LineReveal, Reveal } from './reveal'

export function Closing({ config }: { config: InvitationConfig }) {
  const { couple, closing, platform } = config
  const date = formatDate(config.ceremonyStart, config, { day: '2-digit', month: '2-digit', year: 'numeric' })

  return (
    <>
      <section aria-labelledby="final-titlu" className="px-6 py-28 sm:px-10 sm:py-40">
        <div className="mx-auto flex max-w-2xl flex-col items-center gap-10 text-center">
          <Reveal>
            <Monogram initials={couple.initials} className="w-20 text-[0.85rem]" />
          </Reveal>
          <h2 id="final-titlu" className="font-serif text-5xl font-light italic leading-tight text-balance sm:text-7xl">
            <LineReveal>{closing.line}</LineReveal>
          </h2>
          <Reveal as="p" className="max-w-md text-base leading-relaxed text-muted-foreground">
            {closing.note}
          </Reveal>
        </div>
      </section>

      <footer className="px-6 pb-10 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 border-t border-champagne pt-8 text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p className="eyebrow">
            {couple.first} &amp; {couple.second} · <span className="tabular-nums">{date}</span>
          </p>
          <p className="text-sm">
            Invitație digitală de{' '}
            <a
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className="border-b border-sage pb-0.5 text-espresso transition-colors hover:border-espresso"
            >
              {platform.name}
            </a>
          </p>
        </div>
      </footer>
    </>
  )
}
