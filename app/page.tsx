import { invitationConfig as config } from '@/lib/invitation-config'
import { AudioControl } from '@/components/invitation/audio-control'
import { Closing } from '@/components/invitation/closing'
import { Countdown } from '@/components/invitation/countdown'
import { Gallery } from '@/components/invitation/gallery'
import { Hero } from '@/components/invitation/hero'
import { Interlude } from '@/components/invitation/interlude'
import { Letter } from '@/components/invitation/letter'
import { InvitationMotion } from '@/components/invitation/reveal'
import { Rsvp } from '@/components/invitation/rsvp'
import { Story } from '@/components/invitation/story'
import { Timeline } from '@/components/invitation/timeline'
import { Venues } from '@/components/invitation/venues'

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function readGuestName(value: string | string[] | undefined) {
  const raw = Array.isArray(value) ? value[0] : value
  if (!raw) return undefined
  const cleaned = raw.replace(/[<>{}\u0000-\u001f]/g, '').replace(/\s+/g, ' ').trim().slice(0, 60)
  return cleaned.length >= 2 ? cleaned : undefined
}

export default async function InvitationPage({ searchParams }: PageProps) {
  const params = await searchParams
  const guestName = readGuestName(params.invitat ?? params.guest)
  const deadlinePassed = Date.now() > new Date(config.rsvp.deadline).getTime()
  const { features } = config

  return (
    <InvitationMotion>
      <Hero config={config} guestName={guestName} />
      <main>
        <Letter config={config} guestName={guestName} />
        {features.countdown ? <Countdown config={config} /> : null}
        {features.story ? <Story config={config} /> : null}
        {features.gallery && config.gallery.photos.length ? <Gallery config={config} /> : null}
        <Venues config={config} />
        {features.timeline ? <Timeline config={config} /> : null}
        {features.interlude ? <Interlude config={config} /> : null}
        {features.rsvp ? <Rsvp config={config} guestName={guestName} deadlinePassed={deadlinePassed} /> : null}
        <Closing config={config} />
      </main>
      {features.audio && config.audio.src ? <AudioControl src={config.audio.src} title={config.audio.title} /> : null}
    </InvitationMotion>
  )
}
