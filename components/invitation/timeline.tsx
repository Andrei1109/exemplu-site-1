import type { InvitationConfig } from '@/lib/invitation-config'
import { Reveal } from './reveal'

export function Timeline({ config }: { config: InvitationConfig }) {
  return (
    <section aria-labelledby="program-titlu" className="px-6 py-28 sm:px-10 sm:py-40">
      <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-12 md:gap-8">
        <Reveal className="flex flex-col gap-5 md:col-span-4 md:sticky md:top-24 md:self-start">
          <p className="eyebrow text-muted-foreground">Programul zilei</p>
          <h2 id="program-titlu" className="font-serif text-4xl font-light leading-tight text-balance sm:text-5xl">
            De la <span className="italic">„da”</span> până după miezul nopții
          </h2>
        </Reveal>

        <ol className="md:col-span-7 md:col-start-6">
          {config.timeline.map((item, i) => (
            <Reveal
              as="li"
              key={`${item.time}-${item.title}`}
              delay={0.06 * i}
              className="grid grid-cols-[5.5rem_1fr] items-baseline gap-4 border-t border-champagne py-7 last:border-b sm:grid-cols-[8rem_1fr]"
            >
              <time className="font-serif text-3xl font-light tabular-nums sm:text-4xl">{item.time}</time>
              <div className="flex flex-col gap-1">
                <p className="font-serif text-2xl">{item.title}</p>
                {item.note ? <p className="text-sm leading-relaxed text-muted-foreground">{item.note}</p> : null}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
