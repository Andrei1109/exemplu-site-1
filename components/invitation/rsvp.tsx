'use client'

import { Minus, Plus } from 'lucide-react'
import { useId, useRef, useState, type FormEvent } from 'react'
import { formatDate, type InvitationConfig } from '@/lib/invitation-config'
import {
  RSVP_LIMITS,
  submitRSVP,
  validateRSVP,
  type RSVPErrors,
  type RSVPInput,
  type RSVPResult,
} from '@/lib/rsvp'
import { cn } from '@/lib/utils'
import { Reveal } from './reveal'

type RsvpProps = {
  config: InvitationConfig
  guestName?: string
  deadlinePassed: boolean
}

const FIELD_ORDER: (keyof RSVPInput)[] = ['name', 'attendance', 'companions', 'dietary', 'message']

export function Rsvp({ config, guestName, deadlinePassed }: RsvpProps) {
  const deadline = formatDate(config.rsvp.deadline, config, { day: 'numeric', month: 'long', year: 'numeric' })
  const isDemo = !config.rsvp.endpoint

  return (
    <section id="confirmare" aria-labelledby="rsvp-titlu" className="paper-grain bg-paper px-4 py-24 sm:px-10 sm:py-36">
      <Reveal className="mx-auto max-w-2xl">
        <div className="border border-champagne bg-ivory p-2 sm:p-3">
          <div className="border border-champagne px-5 py-12 sm:px-14 sm:py-16">
            <header className="flex flex-col items-center gap-5 text-center">
              <p className="eyebrow text-muted-foreground">Confirmare</p>
              <h2 id="rsvp-titlu" className="font-serif text-4xl font-light leading-tight text-balance sm:text-5xl">
                Vă rugăm să ne răspundeți
              </h2>
              <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
                {deadlinePassed ? (
                  `Confirmările s-au încheiat pe ${deadline}.`
                ) : (
                  <>
                    {'Până la '}
                    <span className="text-espresso">{deadline}</span>
                    {', ca să putem pregăti totul cu grijă.'}
                  </>
                )}
              </p>
            </header>

            {isDemo && !deadlinePassed ? (
              <p className="mt-10 border-y border-dashed border-sage py-3 text-center text-sm leading-relaxed text-muted-foreground">
                <span className="eyebrow mr-2 text-espresso">Mod demonstrativ</span>
                Formularul poate fi testat, dar răspunsurile nu sunt trimise și nu sunt salvate.
              </p>
            ) : null}

            {deadlinePassed ? (
              <p className="mt-10 text-center font-serif text-xl italic leading-relaxed">
                Dacă nu ați apucat să ne răspundeți, vă rugăm să ne scrieți direct.
              </p>
            ) : (
              <RsvpForm config={config} guestName={guestName} />
            )}
          </div>
        </div>
      </Reveal>
    </section>
  )
}

function RsvpForm({ config, guestName }: { config: InvitationConfig; guestName?: string }) {
  const id = useId()
  const formRef = useRef<HTMLFormElement>(null)
  const maxCompanions = config.rsvp.maxCompanions
  const [values, setValues] = useState<RSVPInput>({
    name: guestName ?? '',
    attendance: '',
    companions: 0,
    dietary: '',
    message: '',
  })
  const [errors, setErrors] = useState<RSVPErrors>({})
  const [pending, setPending] = useState(false)
  const [result, setResult] = useState<RSVPResult | null>(null)
  const resultRef = useRef<HTMLDivElement>(null)

  const fieldId = (key: string) => `${id}-${key}`
  const errorId = (key: keyof RSVPInput) => `${id}-${key}-error`

  function update<K extends keyof RSVPInput>(key: K, value: RSVPInput[K]) {
    setValues((prev) => ({ ...prev, [key]: value }))
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }))
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (pending) return

    const nextErrors = validateRSVP(values, maxCompanions)
    setErrors(nextErrors)
    const firstInvalid = FIELD_ORDER.find((key) => nextErrors[key])
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[data-field="${firstInvalid}"]`)?.focus()
      return
    }

    setPending(true)
    setResult(null)
    const attendance = values.attendance as 'yes' | 'no'
    const outcome = await submitRSVP(
      {
        eventId: config.eventId,
        name: values.name.trim(),
        attendance,
        companions: attendance === 'yes' ? values.companions : 0,
        dietary: attendance === 'yes' ? values.dietary.trim() : '',
        message: values.message.trim(),
      },
      config.rsvp.endpoint,
    )
    setPending(false)
    setResult(outcome)
    requestAnimationFrame(() => resultRef.current?.focus())
  }

  if (result && result.status !== 'error') {
    const firstName = values.name.trim().split(/\s+/)[0]
    const attending = values.attendance === 'yes'
    return (
      <div
        ref={resultRef}
        tabIndex={-1}
        role="status"
        className="mt-12 flex flex-col items-center gap-6 text-center outline-none"
      >
        <span className="hairline w-12" aria-hidden="true" />
        <p className="font-serif text-3xl font-light italic sm:text-4xl">
          {attending ? `Mulțumim, ${firstName}.` : `Vă mulțumim, ${firstName}.`}
        </p>
        <p className="max-w-sm text-base leading-relaxed text-muted-foreground">
          {result.status === 'demo'
            ? 'Răspuns de probă: datele au fost verificate, dar în modul demonstrativ nimic nu a fost trimis sau salvat.'
            : attending
              ? 'Răspunsul dumneavoastră a fost înregistrat. Abia așteptăm să sărbătorim împreună.'
              : 'Răspunsul dumneavoastră a fost înregistrat. Ne va fi dor de dumneavoastră.'}
        </p>
        <button
          type="button"
          onClick={() => setResult(null)}
          className="border-b border-sage pb-1 text-sm tracking-wide transition-colors hover:border-espresso"
        >
          Modificați răspunsul
        </button>
      </div>
    )
  }

  const attending = values.attendance === 'yes'
  const errorCount = Object.values(errors).filter(Boolean).length

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate aria-busy={pending} className="mt-12 flex flex-col gap-10">
      {errorCount > 0 ? (
        <p role="alert" className="border-l border-destructive pl-4 text-sm leading-relaxed text-destructive">
          {errorCount === 1
            ? 'Un câmp necesită atenția dumneavoastră.'
            : `${errorCount} câmpuri necesită atenția dumneavoastră.`}
        </p>
      ) : null}

      <Field label="Nume și prenume" htmlFor={fieldId('name')} error={errors.name} errorId={errorId('name')} required>
        <input
          id={fieldId('name')}
          data-field="name"
          type="text"
          autoComplete="name"
          maxLength={RSVP_LIMITS.name}
          value={values.name}
          onChange={(e) => update('name', e.target.value)}
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? errorId('name') : undefined}
          className={inputClass(Boolean(errors.name))}
        />
      </Field>

      <fieldset
        className="flex flex-col gap-4"
        aria-describedby={errors.attendance ? errorId('attendance') : undefined}
      >
        <legend className="mb-4 flex items-baseline gap-2">
          <span className="eyebrow text-espresso">Participare</span>
          <span className="text-xs text-muted-foreground">(obligatoriu)</span>
        </legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {(
            [
              { value: 'yes', title: 'Particip cu bucurie', note: 'Vă voi fi alături' },
              { value: 'no', title: 'Nu pot participa', note: 'Vă trimit gânduri bune' },
            ] as const
          ).map((option, i) => {
            const checked = values.attendance === option.value
            return (
              <label
                key={option.value}
                className={cn(
                  'flex cursor-pointer items-start gap-4 border px-4 py-4 transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-1 has-[:focus-visible]:outline-offset-4 has-[:focus-visible]:outline-espresso',
                  checked ? 'border-espresso bg-paper' : 'border-champagne hover:border-sage',
                  errors.attendance && !checked && 'border-destructive/60',
                )}
              >
                <input
                  type="radio"
                  name="attendance"
                  value={option.value}
                  data-field={i === 0 ? 'attendance' : undefined}
                  checked={checked}
                  onChange={() => update('attendance', option.value)}
                  className="peer sr-only"
                />
                <span
                  aria-hidden="true"
                  className={cn(
                    'mt-1.5 flex size-3.5 shrink-0 items-center justify-center border',
                    checked ? 'border-espresso' : 'border-sage',
                  )}
                >
                  <span className={cn('size-1.5 bg-espresso transition-opacity', checked ? 'opacity-100' : 'opacity-0')} />
                </span>
                <span className="flex flex-col gap-1">
                  <span className="font-serif text-xl leading-snug">{option.title}</span>
                  <span className="text-sm text-muted-foreground">{option.note}</span>
                </span>
              </label>
            )
          })}
        </div>
        <ErrorText id={errorId('attendance')} message={errors.attendance} />
      </fieldset>

      {attending ? (
        <>
          <fieldset className="flex flex-col gap-4" aria-describedby={`${fieldId('companions')}-hint`}>
            <legend className="mb-4 flex items-baseline gap-2">
              <span className="eyebrow text-espresso">Însoțitori</span>
            </legend>
            <div className="flex items-center justify-between gap-6 border-b border-sage pb-3">
              <p id={`${fieldId('companions')}-hint`} className="text-sm leading-relaxed text-muted-foreground">
                {`Pe lângă dumneavoastră, cel mult ${maxCompanions}.`}
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  data-field="companions"
                  onClick={() => update('companions', Math.max(0, values.companions - 1))}
                  disabled={values.companions <= 0}
                  aria-label="Mai puțini însoțitori"
                  className="flex size-11 items-center justify-center text-espresso transition-opacity disabled:opacity-30"
                >
                  <Minus className="size-4" aria-hidden="true" />
                </button>
                <output
                  aria-live="polite"
                  aria-label="Număr de însoțitori"
                  className="w-10 text-center font-serif text-3xl tabular-nums"
                >
                  {values.companions}
                </output>
                <button
                  type="button"
                  onClick={() => update('companions', Math.min(maxCompanions, values.companions + 1))}
                  disabled={values.companions >= maxCompanions}
                  aria-label="Mai mulți însoțitori"
                  className="flex size-11 items-center justify-center text-espresso transition-opacity disabled:opacity-30"
                >
                  <Plus className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>
            <ErrorText id={errorId('companions')} message={errors.companions} />
          </fieldset>

          <Field
            label="Preferințe alimentare"
            htmlFor={fieldId('dietary')}
            error={errors.dietary}
            errorId={errorId('dietary')}
            hint="Opțional — de exemplu vegetarian, fără gluten sau alergii."
          >
            <input
              id={fieldId('dietary')}
              data-field="dietary"
              type="text"
              maxLength={RSVP_LIMITS.dietary}
              value={values.dietary}
              onChange={(e) => update('dietary', e.target.value)}
              aria-invalid={Boolean(errors.dietary)}
              aria-describedby={`${fieldId('dietary')}-hint${errors.dietary ? ` ${errorId('dietary')}` : ''}`}
              className={inputClass(Boolean(errors.dietary))}
            />
          </Field>
        </>
      ) : null}

      <Field
        label="Un gând pentru noi"
        htmlFor={fieldId('message')}
        error={errors.message}
        errorId={errorId('message')}
        hint={`Opțional · ${values.message.length}/${RSVP_LIMITS.message}`}
      >
        <textarea
          id={fieldId('message')}
          data-field="message"
          rows={3}
          maxLength={RSVP_LIMITS.message}
          value={values.message}
          onChange={(e) => update('message', e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={`${fieldId('message')}-hint${errors.message ? ` ${errorId('message')}` : ''}`}
          className={cn(inputClass(Boolean(errors.message)), 'resize-none font-serif text-xl leading-relaxed')}
        />
      </Field>

      {result?.status === 'error' ? (
        <div ref={resultRef} tabIndex={-1} role="alert" className="border-l border-destructive pl-4 text-sm leading-relaxed text-destructive outline-none">
          {result.message}
        </div>
      ) : null}

      <div className="flex flex-col items-center gap-4 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="flex h-14 w-full items-center justify-center gap-3 bg-espresso px-10 text-ivory transition-opacity hover:opacity-90 disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:min-w-64"
        >
          <span className="eyebrow">{pending ? 'Se trimite…' : 'Trimiteți răspunsul'}</span>
        </button>
        <p className="max-w-xs text-center text-xs leading-relaxed text-muted-foreground">
          Folosim aceste informații doar pentru organizarea nunții.
        </p>
      </div>
    </form>
  )
}

function inputClass(invalid: boolean) {
  return cn(
    'w-full border-0 border-b bg-transparent px-0 pb-3 pt-1 text-base text-espresso outline-none transition-colors placeholder:text-sage focus:border-espresso focus-visible:outline-none',
    invalid ? 'border-destructive' : 'border-sage',
  )
}

function Field({
  label,
  htmlFor,
  error,
  errorId,
  hint,
  required,
  children,
}: {
  label: string
  htmlFor: string
  error?: string
  errorId: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-3">
      <label htmlFor={htmlFor} className="flex items-baseline gap-2">
        <span className="eyebrow text-espresso">{label}</span>
        {required ? <span className="text-xs text-muted-foreground">(obligatoriu)</span> : null}
      </label>
      {children}
      {hint ? (
        <p id={`${htmlFor}-hint`} className="text-sm text-muted-foreground">
          {hint}
        </p>
      ) : null}
      <ErrorText id={errorId} message={error} />
    </div>
  )
}

function ErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null
  return (
    <p id={id} className="text-sm leading-relaxed text-destructive">
      {message}
    </p>
  )
}
