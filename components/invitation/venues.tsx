import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { formatDate, getMapsUrl, type InvitationConfig } from '@/lib/invitation-config'
import { Reveal } from './reveal'

export function Venues({ config }: { config: InvitationConfig }) {
  const longDate = formatDate(config.ceremonyStart, config, {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <section id="locatii" aria-labelledby="locatii-titlu" className="paper-grain bg-paper px-6 py-28 sm:px-10 sm:py-36">
      <div className="mx-auto flex max-w-5xl flex-col gap-16 sm:gap-20">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <p className="eyebrow text-muted-foreground">Ziua nunții</p>
          <h2 id="locatii-titlu" className="font-serif text-4xl font-light first-letter:uppercase sm:text-5xl">
            {longDate}
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-2">
          {config.venues.map((venue, i) => (
            <Reveal
              key={venue.label}
              delay={0.12 * i}
              className={`flex flex-col items-center gap-6 py-12 text-center md:px-10 md:py-4 ${
                i > 0 ? 'border-t border-champagne md:border-l md:border-t-0' : ''
              }`}
            >
              <article className="flex w-full flex-col items-center gap-6" aria-labelledby={`venue-${i}`}>
                {venue.photo ? (
                  <div className="relative mb-4 aspect-[4/5] w-full max-w-sm overflow-hidden bg-champagne/30">
                    <Image
                      src={venue.photo.src}
                      alt={venue.photo.alt}
                      fill
                      sizes="(min-width: 768px) 384px, 90vw"
                      className="object-cover transition-transform duration-[1600ms] ease-out hover:scale-[1.03]"
                    />
                  </div>
                ) : null}
                <p className="eyebrow text-muted-foreground">{venue.label}</p>
                <p className="font-serif text-[clamp(4.5rem,18vw,7.5rem)] font-light leading-none tabular-nums tracking-[-0.02em]">
                  <span className="sr-only">Ora </span>
                  {venue.time}
                </p>
                <div className="flex flex-col items-center gap-2">
                  <h3 id={`venue-${i}`} className="font-serif text-2xl italic">
                    {venue.title}
                  </h3>
                  <p className="text-base leading-relaxed">{venue.name}</p>
                  {venue.address ? (
                    <address className="text-sm not-italic leading-relaxed text-muted-foreground">{venue.address}</address>
                  ) : null}
                </div>
                <a
                  href={getMapsUrl(venue)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 border-b border-sage pb-1 text-sm tracking-wide transition-colors hover:border-espresso"
                >
                  Indicații de orientare
                  <ArrowUpRight
                    className="size-4 transition-transform duration-500 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                  <span className="sr-only">{`către ${venue.name} (se deschide într-o filă nouă)`}</span>
                </a>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
