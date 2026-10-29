import type { InvitationConfig } from '@/lib/invitation-config'
import { ArtPhoto } from './art-photo'
import { LineReveal, Reveal } from './reveal'

export function Story({ config }: { config: InvitationConfig }) {
  const { story, couple } = config

  return (
    <section aria-labelledby="poveste-titlu" className="px-6 py-28 sm:px-10 sm:py-40">
      <div className="mx-auto grid max-w-6xl gap-14 md:grid-cols-12 md:items-end md:gap-8">
        <Reveal className="md:col-span-5 md:col-start-7 md:row-start-1">
          <figure className="flex flex-col gap-4">
            <ArtPhoto
              photo={story.photo}
              sizes="(min-width: 768px) 40vw, 100vw"
              fallbackMark={`${couple.initials[0]} & ${couple.initials[1]}`}
              className="aspect-[4/5] w-full"
            />
            <figcaption className="eyebrow text-right text-muted-foreground">
              {couple.first} &amp; {couple.second}
            </figcaption>
          </figure>
        </Reveal>

        <div className="flex flex-col gap-10 md:col-span-5 md:col-start-1 md:row-start-1 md:pb-16">
          <Reveal className="flex items-center gap-4 text-muted-foreground">
            <h2 id="poveste-titlu" className="eyebrow">
              {story.title}
            </h2>
            <span className="hairline flex-1" aria-hidden="true" />
          </Reveal>

          <blockquote className="font-serif text-[2rem] font-light italic leading-tight text-balance sm:text-5xl">
            <LineReveal>{`„${story.quote}”`}</LineReveal>
          </blockquote>

          <div className="flex max-w-md flex-col gap-4">
            {story.paragraphs.map((paragraph, i) => (
              <Reveal key={paragraph} as="p" delay={0.08 * i} className="text-base leading-relaxed text-muted-foreground">
                {paragraph}
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
