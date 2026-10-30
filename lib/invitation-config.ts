export type Venue = {
  label: string
  title: string
  name: string
  /** Leave undefined when no verified address is available. */
  address?: string
  time: string
  /** Free-text query or coordinates ("lat,lng") used to build the Maps link. */
  mapsQuery: string
  /** Optional explicit Maps URL; overrides mapsQuery. */
  mapsUrl?: string
  photo?: { src: string; alt: string }
}

export type TimelineItem = {
  time: string
  title: string
  note?: string
}

export type InvitationPhoto = {
  src: string
  alt: string
  caption?: string
}

export type InvitationConfig = {
  eventId: string
  platform: { name: string; url: string }
  locale: string
  timeZone: string
  couple: {
    first: string
    second: string
    initials: [string, string]
  }
  /** ISO 8601 with explicit offset. */
  ceremonyStart: string
  /** Moment after which the countdown switches to the past-event state. */
  celebrationEnd: string
  heroPhoto: InvitationPhoto
  invitation: {
    eyebrow: string
    salutationFallback: string
    paragraphs: string[]
    signature: string
  }
  story: {
    title: string
    quote: string
    paragraphs: string[]
    photo: InvitationPhoto
  }
  interlude: { photo: InvitationPhoto; caption: string }
  /** First photo is shown tall, the next two stacked beside it. */
  gallery: { eyebrow: string; title: string; photos: InvitationPhoto[] }
  venues: Venue[]
  timeline: TimelineItem[]
  rsvp: {
    deadline: string
    /** Base URL of the Palfi Events public RSVP API. When empty, the form runs in demo mode. */
    endpoint?: string
    maxCompanions: number
  }
  closing: { line: string; note: string }
  audio: { src?: string; title: string }
  features: {
    countdown: boolean
    story: boolean
    gallery: boolean
    interlude: boolean
    timeline: boolean
    rsvp: boolean
    audio: boolean
  }
  theme: {
    ivory: string
    paper: string
    espresso: string
    sage: string
    champagne: string
  }
}

export const invitationConfig: InvitationConfig = {
  eventId: 'palfi-evt-2027-alexandra-matei',
  platform: { name: 'Palfi Events', url: 'https://palfievents.ro' },
  locale: 'ro-RO',
  timeZone: 'Europe/Bucharest',
  couple: {
    first: 'Alexandra',
    second: 'Matei',
    initials: ['A', 'M'],
  },
  ceremonyStart: '2027-06-12T15:00:00+03:00',
  celebrationEnd: '2027-06-13T04:00:00+03:00',
  heroPhoto: {
    src: '/images/hero-couple.png',
    alt: 'Mirii, văzuți din spate, mergând de mână pe o alee de grădină printre măslini și trandafiri albi',
  },
  invitation: {
    eyebrow: 'Invitație',
    salutationFallback: 'Dragi prieteni și familie,',
    paragraphs: [
      'Cu inimile pline de bucurie, vă invităm să fiți alături de noi în ziua în care ne unim destinele.',
      'Ne-ar onora prezența voastră la cununia religioasă și la seara pe care o vom petrece împreună, la masă, printre cei dragi.',
    ],
    signature: 'Cu drag,',
  },
  story: {
    title: 'Povestea noastră',
    quote: 'Ne-am cunoscut într-o după-amiază obișnuită, care avea să devină începutul a tot ce urmează.',
    paragraphs: [
      'Au urmat plimbări lungi, cafele care s-au răcit nebăute și o mulțime de planuri făcute pe marginea unui șervețel.',
      'Anul acesta am ales să rostim cu voce tare ceea ce știm de mult: că vrem să mergem mai departe împreună.',
    ],
    photo: {
      src: '/images/couple-portrait.png',
      alt: 'Alexandra și Matei, văzuți din spate, ținându-se de mână sub o colonadă de piatră',
    },
  },
  interlude: {
    photo: {
      src: '/images/still-life.png',
      alt: 'Două mâini care se ating pe o față de masă din in, lângă un trandafir alb',
    },
    caption: 'Pentru o zi pe care vrem să o păstrăm toată viața.',
  },
  gallery: {
    eyebrow: 'Detalii',
    title: 'Ziua pe care o pregătim',
    photos: [
      {
        src: '/images/gallery-bouquet.png',
        alt: 'Buchet de mireasă cu trandafiri albi, eucalipt și ramuri de măslin, ținut în fața unei rochii de mătase',
        caption: 'Buchetul',
      },
      {
        src: '/images/gallery-garden.png',
        alt: 'Masă lungă în grădină, cu fețe de masă din in, lumânări și trandafiri albi, în lumina apusului',
        caption: 'Cina în grădină',
      },
      {
        src: '/images/gallery-rings.png',
        alt: 'Două verighete din aur pe o invitație din hârtie de bumbac, lângă o rămurică de măslin și o panglică verde',
        caption: 'Verighetele',
      },
    ],
  },
  venues: [
    {
      label: 'Ceremonia',
      title: 'Cununia religioasă',
      name: 'Biserica Sfântul Nicolae',
      time: '15:00',
      mapsQuery: 'Biserica Sfântul Nicolae',
      photo: {
        src: '/images/venue-church.png',
        alt: 'Biserica Sfântul Nicolae, o bisericuță albă din lemn cu turlă, înconjurată de copaci și trandafiri albi',
      },
    },
    {
      label: 'Recepția',
      title: 'Cina și petrecerea',
      name: 'The Garden Estate',
      time: '19:00',
      mapsQuery: 'The Garden Estate',
      photo: {
        src: '/images/venue-reception.png',
        alt: 'The Garden Estate la apus: clădire din piatră cu ferestre arcuite luminate și mese lungi în grădină, cu lumânări și ghirlande de lumini',
      },
    },
  ],
  timeline: [
    { time: '15:00', title: 'Cununia religioasă', note: 'Biserica Sfântul Nicolae' },
    { time: '19:00', title: 'Primirea invitaților', note: 'The Garden Estate' },
    { time: '20:00', title: 'Cina festivă' },
    { time: '22:00', title: 'Primul dans' },
    { time: '00:00', title: 'Tortul miresei' },
  ],
  rsvp: {
    deadline: '2027-05-15T23:59:59+03:00',
    endpoint:
      process.env.NEXT_PUBLIC_RSVP_ENDPOINT || 'http://localhost:3050/api/public/rsvp/1e20536ecd64f54e7932',
    maxCompanions: 3,
  },
  closing: {
    line: 'Vă așteptăm cu drag.',
    note: 'Pentru orice întrebare, ne găsiți oricând la un mesaj distanță.',
  },
  audio: {
    src: undefined,
    title: 'Muzica invitației',
  },
  features: {
    countdown: true,
    story: true,
    gallery: true,
    interlude: true,
    timeline: true,
    rsvp: true,
    audio: true,
  },
  theme: {
    ivory: '#F5F1EA',
    paper: '#EEE8DE',
    espresso: '#382F2B',
    sage: '#5E6B4E',
    champagne: '#D7C9B3',
  },
}

export function getMapsUrl(venue: Venue) {
  if (venue.mapsUrl) return venue.mapsUrl
  const query = venue.address ? `${venue.name}, ${venue.address}` : venue.mapsQuery
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`
}

export function formatDate(iso: string, config: InvitationConfig, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat(config.locale, { timeZone: config.timeZone, ...options }).format(new Date(iso))
}
