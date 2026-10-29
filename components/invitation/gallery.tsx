import type { InvitationConfig } from '@/lib/invitation-config'
import { ArtPhoto } from './art-photo'
import { Reveal } from './reveal'

export function Gallery({ config }: { config: InvitationConfig }) {
  const { gallery, couple } = config
  const [tall, second, wide] = gallery.photos
  const mark = `${couple.initials[0]}&${couple.initials[1]}`

  return (
    <section aria-labelledby="galerie-titlu" className="px-6 py-28 sm:px-10 sm:py-36">
      <div className="mx-auto flex max-w-6xl flex-col gap-14 sm:gap-20">
        <Reveal className="flex flex-col items-center gap-5 text-center">
          <p className="eyebrow text-sage">{gallery.eyebrow}</p>
          <h2 id="galerie-titlu" className="font-serif text-5xl font-light text-balance sm:text-6xl">
            {gallery.title}
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-12">
          {tall ? (
            <Reveal className="md:col-span-5 md:row-span-2">
              <figure className="flex h-full flex-col gap-3">
                <ArtPhoto
                  photo={tall}
                  sizes="(min-width: 768px) 40vw, 100vw"
                  fallbackMark={mark}
                  className="aspect-[4/5] md:aspect-auto md:flex-1"
                />
                {tall.caption ? <figcaption className="eyebrow text-muted-foreground">{tall.caption}</figcaption> : null}
              </figure>
            </Reveal>
          ) : null}
          {second ? (
            <Reveal delay={0.12} className="md:col-span-7">
              <figure className="flex flex-col gap-3">
                <ArtPhoto photo={second} sizes="(min-width: 768px) 55vw, 100vw" fallbackMark={mark} className="aspect-[4/3]" />
                {second.caption ? <figcaption className="eyebrow text-muted-foreground">{second.caption}</figcaption> : null}
              </figure>
            </Reveal>
          ) : null}
          {wide ? (
            <Reveal delay={0.24} className="md:col-span-7">
              <figure className="flex flex-col gap-3">
                <ArtPhoto photo={wide} sizes="(min-width: 768px) 55vw, 100vw" fallbackMark={mark} className="aspect-[16/9]" />
                {wide.caption ? <figcaption className="eyebrow text-muted-foreground">{wide.caption}</figcaption> : null}
              </figure>
            </Reveal>
          ) : null}
        </div>
      </div>
    </section>
  )
}
