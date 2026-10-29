import type { InvitationConfig } from '@/lib/invitation-config'
import { ArtPhoto } from './art-photo'
import { Reveal } from './reveal'

export function Interlude({ config }: { config: InvitationConfig }) {
  const { interlude, couple } = config
  return (
    <section aria-label="Fotografie" className="px-6 pb-28 sm:px-10 sm:pb-40">
      <Reveal className="mx-auto max-w-6xl">
        <figure className="flex flex-col gap-5">
          <ArtPhoto
            photo={interlude.photo}
            sizes="(min-width: 1152px) 1152px, 100vw"
            fallbackMark={`${couple.initials[0]} & ${couple.initials[1]}`}
            className="aspect-[4/3] w-full sm:aspect-[16/8]"
          />
          <figcaption className="self-end font-serif text-xl italic text-muted-foreground sm:max-w-sm sm:text-right">
            {interlude.caption}
          </figcaption>
        </figure>
      </Reveal>
    </section>
  )
}
