export type Attendance = 'yes' | 'no'

export type RSVPInput = {
  name: string
  attendance: Attendance | ''
  companions: number
  dietary: string
  message: string
}

export type RSVPPayload = Omit<RSVPInput, 'attendance'> & {
  eventId: string
  attendance: Attendance
}

export type RSVPErrors = Partial<Record<keyof RSVPInput, string>>

export type RSVPResult =
  | { status: 'saved' }
  | { status: 'demo' }
  | { status: 'error'; message: string }

export const RSVP_LIMITS = { name: 80, dietary: 200, message: 500 } as const

export function validateRSVP(input: RSVPInput, maxCompanions: number): RSVPErrors {
  const errors: RSVPErrors = {}
  const name = input.name.trim()

  if (name.length < 2) errors.name = 'Vă rugăm să ne spuneți numele dumneavoastră.'
  else if (name.length > RSVP_LIMITS.name) errors.name = `Numele poate avea cel mult ${RSVP_LIMITS.name} de caractere.`

  if (input.attendance !== 'yes' && input.attendance !== 'no') {
    errors.attendance = 'Vă rugăm să alegeți dacă veți fi prezent.'
  }

  if (input.attendance === 'yes') {
    if (!Number.isInteger(input.companions) || input.companions < 0 || input.companions > maxCompanions) {
      errors.companions = `Puteți fi însoțit de cel mult ${maxCompanions} persoane.`
    }
  }

  if (input.dietary.trim().length > RSVP_LIMITS.dietary) {
    errors.dietary = `Vă rugăm să folosiți cel mult ${RSVP_LIMITS.dietary} de caractere.`
  }

  if (input.message.trim().length > RSVP_LIMITS.message) {
    errors.message = `Mesajul poate avea cel mult ${RSVP_LIMITS.message} de caractere.`
  }

  return errors
}

type GuestMatch = { id: string; fullName: string }

const normalize = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim().toLowerCase()

/** Looks up an existing guest by name so a repeated answer updates it instead of creating a new one. */
async function findGuestId(endpoint: string, name: string): Promise<string | undefined> {
  try {
    const response = await fetch(`${endpoint}/search?q=${encodeURIComponent(name)}`)
    if (!response.ok) return undefined
    const data: { results?: GuestMatch[] } = await response.json()
    return data.results?.find((guest) => normalize(guest.fullName) === normalize(name))?.id
  } catch {
    return undefined
  }
}

/**
 * Integration point for Palfi Events. When no endpoint is configured the
 * invitation runs in demo mode and nothing leaves the browser.
 */
export async function submitRSVP(payload: RSVPPayload, endpoint?: string): Promise<RSVPResult> {
  if (!endpoint) {
    await new Promise((resolve) => setTimeout(resolve, 900))
    return { status: 'demo' }
  }

  const base = endpoint.replace(/\/+$/, '')
  const attending = payload.attendance === 'yes'

  try {
    const guestId = await findGuestId(base, payload.name)
    const response = await fetch(`${base}/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guestId,
        fullName: payload.name,
        status: attending ? 'CONFIRMED' : 'DECLINED',
        attendingCount: attending ? 1 + payload.companions : 0,
        kidsCount: 0,
        dietaryRestrictions: payload.dietary,
        songRequests: [],
        messageToCuple: payload.message,
      }),
    })
    const data: { success?: boolean } | null = await response.json().catch(() => null)
    if (!response.ok || !data?.success) {
      return { status: 'error', message: 'Răspunsul nu a putut fi trimis. Vă rugăm să încercați din nou.' }
    }
    return { status: 'saved' }
  } catch {
    return {
      status: 'error',
      message: 'Nu ne-am putut conecta. Verificați conexiunea la internet și încercați din nou.',
    }
  }
}
