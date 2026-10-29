import type { InvitationConfig } from '@/lib/invitation-config'
import { LineReveal, Reveal } from './reveal'

export function Letter({ config, guestName }: { config: InvitationConfig; guestName?: string }) {
  const { invitation, couple } = config
  const salutation = guestName ? `Dragă ${guestName},` : invitation.salutationFallback

  return (
    <section id="invitatia" aria-labelledby="invitatia-titlu" className="px-6 py-28 sm:px-10 sm:py-40">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-12 text-center">
        <Reveal className="flex items-center gap-4 text-muted-foreground">
          <span className="hairline w-10" aria-hidden="true" />
          <h2 id="invitatia-titlu" className="eyebrow">
            {invitation.eyebrow}
          </h2>
          <span className="hairline w-10" aria-hidden="true" />
        </Reveal>

        <p className="font-serif text-3xl font-light italic text-balance sm:text-4xl">
          <LineReveal>{salutation}</LineReveal>
        </p>

        <div className="flex flex-col gap-6">
          {invitation.paragraphs.map((paragraph, index) => (
            <Reveal key={paragraph} delay={0.1 * index} as="p" className="font-serif text-2xl font-light leading-relaxed text-pretty sm:text-[1.75rem]">
              {paragraph}
            </Reveal>
          ))}
        </div>

        <Reveal className="flex flex-col items-center gap-3">
          <span className="font-sans text-sm text-muted-foreground">{invitation.signature}</span>
          <span className="font-serif text-3xl italic">
            {couple.first} <span className="text-sage">&amp;</span> {couple.second}
          </span>
        </Reveal>
      </div>
    </section>
  )
}
