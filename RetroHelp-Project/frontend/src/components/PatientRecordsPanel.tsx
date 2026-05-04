import { motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, getApiErrorMessage } from '../api/client'
import { isCommunityMember } from '../constants/roles'
import { BookingStatusMascot } from './BookingStatusMascot'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import type { NavigationLogItem, PatientBookingRow } from '../types/api'

const CLOSED = new Set(['completed', 'cancelled'])

const CANCELLABLE = new Set([
  'requested',
  'accepted',
  'on_my_way',
  'arrived',
  'pill_given',
])

function cancellationExplanation(
  t: {
    profile: {
      cancellationNoComing: string
      cancellationByPatient: string
      cancellationByClinic: string
      bookingStatus: Record<string, string>
    }
  },
  reason: string | null | undefined,
): string {
  if (reason === 'no_patient_coming_confirmation') {
    return t.profile.cancellationNoComing
  }
  if (reason === 'cancelled_by_patient') {
    return t.profile.cancellationByPatient
  }
  if (reason === 'cancelled_by_clinic') {
    return t.profile.cancellationByClinic
  }

  return t.profile.bookingStatus.cancelled
}

function bookingStatusLabel(
  t: { profile: { bookingStatus: Record<string, string> } },
  status: string,
): string {
  return t.profile.bookingStatus[status] ?? status
}

function stepIndex(status: string): number {
  const m: Record<string, number> = {
    requested: 0,
    accepted: 1,
    on_my_way: 2,
    arrived: 3,
    pill_given: 4,
    completed: 5,
  }

  return m[status] ?? -1
}

function formatTimeLeft(respondByAt: string | null | undefined): string | null {
  if (!respondByAt) return null
  const end = new Date(respondByAt).getTime()
  const ms = end - Date.now()
  if (ms <= 0) return null
  const h = Math.floor(ms / 3600000)
  const m = Math.floor((ms % 3600000) / 60000)
  if (h > 0) return `${h}h ${m}m`
  return `${m}m`
}

function BookingProgressStrip({
  status,
  steps,
}: {
  status: string
  steps: {
    pending: string
    approved: string
    coming: string
    arrived: string
    pill: string
    done: string
  }
}) {
  const labels = [
    steps.pending,
    steps.approved,
    steps.coming,
    steps.arrived,
    steps.pill,
    steps.done,
  ]

  if (status === 'cancelled') {
    return (
      <div className="mt-3">
        <div className="flex flex-wrap gap-1">
          {labels.map((label, i) => {
            const passed = i <= 1
            return (
              <span
                key={label}
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  passed
                    ? 'bg-teal-600 text-white'
                    : 'bg-stone-100 text-stone-400'
                }`}
              >
                {label}
              </span>
            )
          })}
        </div>
      </div>
    )
  }

  const cur = stepIndex(status)
  const completed = status === 'completed'

  return (
    <div className="mt-3">
      <div className="flex flex-wrap gap-1">
        {labels.map((label, i) => {
          const done = completed || cur > i
          const current = !completed && cur === i

          return (
            <span
              key={label}
              className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                done
                  ? 'bg-teal-600 text-white'
                  : current
                    ? 'bg-white text-teal-800 ring-2 ring-teal-500'
                    : 'bg-stone-100 text-stone-400'
              }`}
            >
              {label}
            </span>
          )
        })}
      </div>
    </div>
  )
}

export function PatientRecordsPanel() {
  const { t } = useLanguage()
  const { user, token } = useAuth()
  const [navRows, setNavRows] = useState<NavigationLogItem[]>([])
  const [bookings, setBookings] = useState<PatientBookingRow[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busyBookingId, setBusyBookingId] = useState<number | null>(null)
  const [nowTick, setNowTick] = useState(0)

  useEffect(() => {
    const id = window.setInterval(() => {
      setNowTick((x) => x + 1)
    }, 30000)

    return () => window.clearInterval(id)
  }, [])

  const { activeBookings, closedBookings } = useMemo(() => {
    const active: PatientBookingRow[] = []
    const closed: PatientBookingRow[] = []
    for (const b of bookings) {
      if (CLOSED.has(b.status)) {
        closed.push(b)
      } else {
        active.push(b)
      }
    }

    const order: Record<string, number> = {
      accepted: 0,
      requested: 1,
      on_my_way: 2,
      arrived: 3,
      pill_given: 4,
    }

    active.sort((a, b) => {
      const da = a.respond_by_at
        ? new Date(a.respond_by_at).getTime()
        : Number.POSITIVE_INFINITY
      const db = b.respond_by_at
        ? new Date(b.respond_by_at).getTime()
        : Number.POSITIVE_INFINITY
      if (a.status === 'accepted' && b.status === 'accepted') {
        return da - db
      }

      return (order[a.status] ?? 99) - (order[b.status] ?? 99)
    })

    closed.sort((a, b) => {
      const ta = new Date(a.updated_at ?? a.created_at ?? 0).getTime()
      const tb = new Date(b.updated_at ?? b.created_at ?? 0).getTime()

      return tb - ta
    })

    return { activeBookings: active, closedBookings: closed }
  }, [bookings])

  void nowTick

  const load = useCallback(async () => {
    if (!user || !token || !isCommunityMember(user.role_id)) {
      setNavRows([])
      setBookings([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const [navRes, bookRes] = await Promise.all([
        api.get<{ data: NavigationLogItem[] }>('/api/navigations'),
        api.get<{ data: PatientBookingRow[] }>('/api/bookings'),
      ])
      setNavRows(navRes.data.data)
      setBookings(bookRes.data.data)
    } catch (err) {
      setError(getApiErrorMessage(err))
      setNavRows([])
      setBookings([])
    } finally {
      setLoading(false)
    }
  }, [user, token])

  useEffect(() => {
    void load()
  }, [load])

  const runBookingAction = async (
    bookingId: number,
    path: 'on-my-way' | 'arrived' | 'complete',
  ) => {
    setBusyBookingId(bookingId)
    setError(null)
    try {
      await api.patch(`/api/bookings/${bookingId}/${path}`, {})
      await load()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setBusyBookingId(null)
    }
  }

  const runCancel = async (bookingId: number) => {
    if (!window.confirm(t.profile.bookingCancelConfirm)) {
      return
    }
    setBusyBookingId(bookingId)
    setError(null)
    try {
      await api.patch(`/api/bookings/${bookingId}/cancel`, {})
      await load()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setBusyBookingId(null)
    }
  }

  if (!user || !token || !isCommunityMember(user.role_id)) {
    return null
  }

  const steps = t.profile.bookingSteps

  const renderBookingCard = (b: PatientBookingRow) => {
    const timeLeft =
      b.status === 'accepted' ? formatTimeLeft(b.respond_by_at) : null

    return (
      <motion.li
        key={b.id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        className={`rounded-3xl border p-5 shadow-lg shadow-teal-900/5 ${
          b.status === 'cancelled'
            ? 'border-stone-200 bg-stone-50/90'
            : 'border-teal-100/90 bg-white'
        }`}
      >
        <div className="flex gap-4">
          <BookingStatusMascot
            status={b.status}
            size={92}
            aria-label={bookingStatusLabel(t, b.status)}
          />
          <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-stone-900">
          {b.art_center?.name ?? t.profile.bookingAt}
        </p>
        <p className="mt-1 text-xs text-stone-500">
          {t.profile.bookingProgressLabel}:{' '}
          <span className="font-semibold text-teal-900">
            {bookingStatusLabel(t, b.status)}
          </span>
        </p>
        <BookingProgressStrip status={b.status} steps={steps} />
        <p className="mt-2 text-xs text-stone-500">
          {t.profile.bookingRequestedOn}:{' '}
          {b.created_at ? new Date(b.created_at).toLocaleString() : '—'}
        </p>
        {b.status === 'accepted' && (
          <div className="mt-3 rounded-2xl border border-amber-200 bg-amber-50/90 px-3 py-2.5 text-xs leading-relaxed text-amber-950">
            <p>{t.profile.respondByIntro}</p>
            <p className="mt-1 font-mono text-sm font-semibold">
              {b.respond_by_at
                ? new Date(b.respond_by_at).toLocaleString()
                : t.profile.respondByUnknown}
            </p>
            {timeLeft ? (
              <p className="mt-1 font-semibold text-amber-900">
                {t.profile.respondByTimeLeftPrefix} {timeLeft}
              </p>
            ) : null}
          </div>
        )}
        {b.status === 'accepted' && (
          <button
            type="button"
            disabled={busyBookingId === b.id}
            onClick={() => void runBookingAction(b.id, 'on-my-way')}
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 py-2.5 text-sm font-semibold text-white shadow-md disabled:opacity-60"
          >
            {busyBookingId === b.id
              ? t.profile.bookingActionWorking
              : t.profile.bookingActionOnMyWay}
          </button>
        )}
        {b.status === 'on_my_way' && (
          <button
            type="button"
            disabled={busyBookingId === b.id}
            onClick={() => void runBookingAction(b.id, 'arrived')}
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 py-2.5 text-sm font-semibold text-white shadow-md disabled:opacity-60"
          >
            {busyBookingId === b.id
              ? t.profile.bookingActionWorking
              : t.profile.bookingActionArrived}
          </button>
        )}
        {b.status === 'pill_given' && (
          <button
            type="button"
            disabled={busyBookingId === b.id}
            onClick={() => void runBookingAction(b.id, 'complete')}
            className="mt-4 w-full rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 py-2.5 text-sm font-semibold text-white shadow-md disabled:opacity-60"
          >
            {busyBookingId === b.id
              ? t.profile.bookingActionWorking
              : t.profile.bookingActionComplete}
          </button>
        )}
        {CANCELLABLE.has(b.status) && (
          <button
            type="button"
            disabled={busyBookingId === b.id}
            onClick={() => void runCancel(b.id)}
            className="mt-3 w-full rounded-2xl border border-rose-200 bg-white py-2.5 text-sm font-semibold text-rose-800 shadow-sm transition hover:bg-rose-50 disabled:opacity-60"
          >
            {busyBookingId === b.id
              ? t.profile.bookingActionWorking
              : t.profile.bookingActionCancel}
          </button>
        )}
        {b.status === 'requested' && (
          <p className="mt-3 text-xs text-stone-600">{t.profile.bookingWaitClinic}</p>
        )}
        {b.status === 'arrived' && (
          <p className="mt-3 text-xs text-stone-600">{t.profile.bookingWaitPill}</p>
        )}
        {b.status === 'completed' && (
          <p className="mt-3 text-xs text-teal-800">{t.profile.bookingDone}</p>
        )}
        {b.status === 'cancelled' && (
          <p className="mt-3 text-xs font-medium text-rose-800">
            {cancellationExplanation(t, b.cancellation_reason)}
          </p>
        )}
          </div>
        </div>
      </motion.li>
    )
  }

  return (
    <section className="mt-10 space-y-8">
      <div>
        <h2 className="text-xl font-bold text-stone-900 sm:text-2xl">
          {t.profile.recordsTitle}
        </h2>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">
          {t.profile.recordsIntro}
        </p>
      </div>

      {error && (
        <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-stone-600">{t.findClinic.loading}</p>
      ) : (
        <>
          <div>
            <h3 className="text-lg font-semibold text-stone-900">
              {t.profile.bookingsTitle}
            </h3>
            <p className="mt-1 text-sm text-stone-600">{t.profile.bookingsHelp}</p>
            {bookings.length === 0 ? (
              <p className="mt-4 rounded-3xl border border-orange-100/90 bg-white/80 px-5 py-5 text-sm text-stone-600 shadow-inner">
                {t.profile.bookingsEmpty}{' '}
                <Link
                  to="/find-clinic"
                  className="font-semibold text-teal-800 underline decoration-teal-300 underline-offset-2 hover:text-teal-950"
                >
                  {t.profile.bookingsViewFindClinic}
                </Link>
              </p>
            ) : (
              <div className="mt-4 space-y-8">
                {activeBookings.length > 0 ? (
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wide text-stone-500">
                      {t.profile.bookingsActiveHeading}
                    </h4>
                    <ul className="mt-3 grid gap-4 sm:grid-cols-2">
                      {activeBookings.map((b) => renderBookingCard(b))}
                    </ul>
                  </div>
                ) : null}
                {closedBookings.length > 0 ? (
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-wide text-stone-500">
                      {t.profile.bookingsClosedHeading}
                    </h4>
                    <ul className="mt-3 grid gap-4 sm:grid-cols-2">
                      {closedBookings.map((b) => renderBookingCard(b))}
                    </ul>
                  </div>
                ) : null}
              </div>
            )}
            <p className="mt-3 text-xs text-stone-500">
              {t.profile.bookingCompleteNote}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-stone-900">
              {t.profile.visitLogTitle}
            </h3>
            <p className="mt-1 text-sm text-stone-600">{t.profile.visitLogHelp}</p>
            {navRows.length === 0 ? (
              <p className="mt-4 rounded-3xl border border-dashed border-orange-200 bg-orange-50/40 px-5 py-5 text-sm text-stone-600">
                {t.profile.visitLogEmpty}
              </p>
            ) : (
              <ul className="mt-4 divide-y divide-orange-100 rounded-3xl border border-orange-100/90 bg-white shadow-sm">
                {navRows.map((n) => (
                  <li
                    key={n.navigation_id}
                    className="flex flex-col gap-1 px-5 py-4 text-sm sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="font-medium text-stone-900">
                        {n.art_center?.name ?? n.destination ?? '—'}
                      </p>
                      {n.start_location ? (
                        <p className="text-xs text-stone-500">{n.start_location}</p>
                      ) : null}
                    </div>
                    <p className="shrink-0 text-xs text-stone-500">
                      {n.created_at ? new Date(n.created_at).toLocaleString() : '—'}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}
    </section>
  )
}
