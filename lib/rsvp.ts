export type Attendance = 'yes' | 'no'

export type MenuChoice = 'Standard' | 'Vegetarian' | 'Copil'

export const GUEST_MENUS: MenuChoice[] = ['Standard', 'Vegetarian']
export const COMPANION_MENUS: MenuChoice[] = ['Standard', 'Vegetarian', 'Copil']

export type Companion = { name: string; menu: MenuChoice }

export type RSVPInput = {
  name: string
  attendance: Attendance | ''
  menu: MenuChoice
  companions: Companion[]
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

export function isValidCompanionName(name: string) {
  const trimmed = name.trim()
  return trimmed.length >= 2 && trimmed.length <= RSVP_LIMITS.name
}

export function validateRSVP(input: RSVPInput, maxCompanions: number): RSVPErrors {
  const errors: RSVPErrors = {}
  const name = input.name.trim()

  if (name.length < 2) errors.name = 'Vă rugăm să ne spuneți numele dumneavoastră.'
  else if (name.length > RSVP_LIMITS.name) errors.name = `Numele poate avea cel mult ${RSVP_LIMITS.name} de caractere.`

  if (input.attendance !== 'yes' && input.attendance !== 'no') {
    errors.attendance = 'Vă rugăm să alegeți dacă veți fi prezent.'
  }

  if (input.attendance === 'yes') {
    if (input.companions.length > maxCompanions) {
      errors.companions = `Puteți fi însoțit de cel mult ${maxCompanions} persoane.`
    } else if (input.companions.some((companion) => !isValidCompanionName(companion.name))) {
      errors.companions = 'Vă rugăm să completați numele fiecărui însoțitor.'
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
  const companions = attending ? payload.companions : []

  try {
    const guestId = await findGuestId(base, payload.name)
    const response = await fetch(`${base}/rsvp`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        guestId,
        fullName: payload.name,
        status: attending ? 'CONFIRMED' : 'DECLINED',
        attendingCount: attending ? 1 + companions.length : 1,
        mealChoice: attending ? payload.menu : undefined,
        companions: companions.map((companion) => ({
          name: companion.name.trim(),
          // The API has no kids' menu: children get the standard menu and are counted in kidsCount.
          mealChoice: companion.menu === 'Copil' ? 'Standard' : companion.menu,
        })),
        kidsCount: companions.filter((companion) => companion.menu === 'Copil').length,
        dietaryRestrictions: payload.dietary,
        songRequests: [],
        messageToCuple: payload.message,
      }),
    })
    const data: { success?: boolean; error?: string } | null = await response.json().catch(() => null)
    if (!response.ok || !data?.success) {
      return {
        status: 'error',
        message: data?.error ?? 'Răspunsul nu a putut fi trimis. Vă rugăm să încercați din nou.',
      }
    }
    return { status: 'saved' }
  } catch {
    return {
      status: 'error',
      message: 'Nu ne-am putut conecta. Verificați conexiunea la internet și încercați din nou.',
    }
  }
}
