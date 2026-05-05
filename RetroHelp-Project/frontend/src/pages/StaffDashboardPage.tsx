import { motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { BookingStatusMascot } from '../components/BookingStatusMascot'
import { api, getApiErrorMessage } from '../api/client'
import { isAdmin, isStaffOrAdmin } from '../constants/roles'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import {
  easeSoft,
  glassPanel,
  glassTabActive,
  glassTabIdle,
  staggerContainer,
  staggerItem,
} from '../lib/motionPresets'
import type { ArtCenterSearchItem, TopRankedClinic } from '../types/api'

type StaffTab = 'bookings' | 'article' | 'rankings'

type StaffBookingRow = {
  id: number
  user_id: number
  art_center_id: number
  staff_id: number | null
  navigation_id: number | null
  status: string
  patient_note: string | null
  created_at: string | null
  patient?: { id: number; full_name: string | null; nickname: string | null } | null
  art_center?: { id: number; name: string; township: string | null; area: string | null } | null
}

function DonutChart({
  slices,
}: {
  slices: { value: number; color: string; label: string }[]
}) {
  const total = Math.max(1, slices.reduce((sum, s) => sum + s.value, 0))
  const r = 44
  const c = 2 * Math.PI * r
  let offset = 0

  return (
    <svg viewBox="0 0 120 120" className="h-28 w-28">
      <circle cx="60" cy="60" r={r} fill="none" stroke="#e7e5e4" strokeWidth="14" />
      {slices.map((s) => {
        const len = (s.value / total) * c
        const el = (
          <circle
            key={s.label}
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={s.color}
            strokeWidth="14"
            strokeDasharray={`${len} ${Math.max(0, c - len)}`}
            strokeDashoffset={-offset}
            strokeLinecap="butt"
            transform="rotate(-90 60 60)"
          />
        )
        offset += len
        return el
      })}
      <circle cx="60" cy="60" r="27" fill="#fff" />
      <text x="60" y="56" textAnchor="middle" className="fill-stone-500 text-[9px] font-semibold">
        TOTAL
      </text>
      <text x="60" y="72" textAnchor="middle" className="fill-stone-900 text-[16px] font-extrabold">
        {slices.reduce((sum, s) => sum + s.value, 0)}
      </text>
    </svg>
  )
}

export function StaffDashboardPage() {
  const { user, loading: authLoading } = useAuth()
  const { t } = useLanguage()
  const [tab, setTab] = useState<StaffTab>('bookings')

  const [bookings, setBookings] = useState<StaffBookingRow[]>([])
  const [bookingsLoading, setBookingsLoading] = useState(false)
  const [bookingsError, setBookingsError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState('')
  const [adminCenterId, setAdminCenterId] = useState<number | null>(null)
  const [centersForAdmin, setCentersForAdmin] = useState<ArtCenterSearchItem[]>([])
  const [busyBookingId, setBusyBookingId] = useState<number | null>(null)
  const [bookingSearch, setBookingSearch] = useState('')

  const [rankRows, setRankRows] = useState<TopRankedClinic[]>([])
  const [rankLoading, setRankLoading] = useState(false)
  const [rankError, setRankError] = useState<string | null>(null)
  const [rankSearch, setRankSearch] = useState('')

  const [articleTitle, setArticleTitle] = useState('')
  const [articleBody, setArticleBody] = useState('')
  const [articleEbookUrl, setArticleEbookUrl] = useState('')
  const [articleCategory, setArticleCategory] = useState('Basics')
  const [articleBusy, setArticleBusy] = useState(false)
  const [articleMsg, setArticleMsg] = useState<string | null>(null)
  const [articleErr, setArticleErr] = useState<string | null>(null)
  const [availabilityLoading, setAvailabilityLoading] = useState(false)
  const [availabilityBusy, setAvailabilityBusy] = useState(false)
  const [availabilityError, setAvailabilityError] = useState<string | null>(null)
  const [availabilityMsg, setAvailabilityMsg] = useState<string | null>(null)
  const [availabilityAvailable, setAvailabilityAvailable] = useState(false)
  const [availabilityCount, setAvailabilityCount] = useState(0)

  const admin = user && isAdmin(user.role_id)
  const rawCenter = user?.art_center_id ?? user?.art_center?.id
  const staffCenterId =
    rawCenter != null && Number.isFinite(Number(rawCenter)) && Number(rawCenter) > 0
      ? Number(rawCenter)
      : null
  const targetCenterId = admin ? adminCenterId : staffCenterId

  const loadBookings = useCallback(async () => {
    setBookingsLoading(true)
    setBookingsError(null)
    try {
      const params: Record<string, string> = {}
      if (statusFilter) params.status = statusFilter
      if (admin) {
        if (adminCenterId !== null) params.art_center_id = String(adminCenterId)
      } else if (staffCenterId !== null) {
        params.art_center_id = String(staffCenterId)
      }
      const { data } = await api.get<{ data: StaffBookingRow[] }>('/api/bookings', { params })
      setBookings(data.data)
    } catch (err) {
      setBookingsError(getApiErrorMessage(err))
      setBookings([])
    } finally {
      setBookingsLoading(false)
    }
  }, [admin, adminCenterId, staffCenterId, statusFilter])

  const loadRankings = useCallback(async () => {
    setRankLoading(true)
    setRankError(null)
    try {
      const { data } = await api.get<{ data: TopRankedClinic[] }>(
        '/api/art-centers/top-ranked?limit=30',
      )
      setRankRows(data.data)
    } catch (err) {
      setRankError(getApiErrorMessage(err))
      setRankRows([])
    } finally {
      setRankLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!user || !isStaffOrAdmin(user.role_id)) return
    if (tab !== 'bookings') return
    void loadBookings()
  }, [loadBookings, tab, user])

  useEffect(() => {
    if (!user || !isStaffOrAdmin(user.role_id)) return
    if (tab !== 'rankings') return
    void loadRankings()
  }, [loadRankings, tab, user])

  useEffect(() => {
    if (!admin || tab !== 'bookings') return
    let cancelled = false
    void (async () => {
      try {
        const { data } = await api.get<{ data: ArtCenterSearchItem[] }>(
          '/api/art-centers/search?limit=400',
        )
        if (!cancelled) setCentersForAdmin(data.data)
      } catch {
        if (!cancelled) setCentersForAdmin([])
      }
    })()
    return () => {
      cancelled = true
    }
  }, [admin, tab])

  useEffect(() => {
    if (!user || !isStaffOrAdmin(user.role_id) || tab !== 'bookings') return
    if (targetCenterId == null) {
      setAvailabilityError(null)
      setAvailabilityMsg(null)
      return
    }
    let cancelled = false
    setAvailabilityLoading(true)
    setAvailabilityError(null)
    void (async () => {
      try {
        const { data } = await api.get<{
          data: {
            art_pills_available?: boolean
            art_pills_count?: number
            art_three_month_people_count?: number
          }
        }>(
          `/api/art-centers/${targetCenterId}`,
        )
        if (cancelled) return
        setAvailabilityAvailable(Boolean(data?.data?.art_pills_available))
        setAvailabilityCount(
          Math.max(0, Number(data?.data?.art_three_month_people_count ?? data?.data?.art_pills_count ?? 0)),
        )
      } catch (err) {
        if (!cancelled) setAvailabilityError(getApiErrorMessage(err))
      } finally {
        if (!cancelled) setAvailabilityLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [tab, targetCenterId, user])

  const statusLabel = useCallback(
    (s: string) => {
      const key = s as keyof typeof t.profile.bookingStatus
      return t.profile.bookingStatus[key] ?? s
    },
    [t.profile.bookingStatus],
  )

  const patientDisplay = (b: StaffBookingRow) => {
    const nick = b.patient?.nickname
    if (nick) return nick
    return b.patient?.full_name ?? '—'
  }

  const patchBooking = async (bookingId: number, path: 'accept' | 'pill-given' | 'cancel') => {
    setBusyBookingId(bookingId)
    setBookingsError(null)
    try {
      await api.patch(`/api/bookings/${bookingId}/${path}`)
      await loadBookings()
    } catch (err) {
      setBookingsError(getApiErrorMessage(err))
    } finally {
      setBusyBookingId(null)
    }
  }

  const submitArticle = async (e: React.FormEvent) => {
    e.preventDefault()
    setArticleBusy(true)
    setArticleErr(null)
    setArticleMsg(null)
    try {
      await api.post('/api/resource-libraries', {
        title: articleTitle.trim(),
        content: articleBody.trim() || null,
        ebook_url: articleEbookUrl.trim() || null,
        category: articleCategory || null,
      })
      setArticleMsg(t.staffDash.articleSuccess)
      setArticleTitle('')
      setArticleBody('')
      setArticleEbookUrl('')
    } catch (err) {
      setArticleErr(getApiErrorMessage(err))
    } finally {
      setArticleBusy(false)
    }
  }

  const saveAvailability = async (e: React.FormEvent) => {
    e.preventDefault()
    if (targetCenterId == null) return
    setAvailabilityBusy(true)
    setAvailabilityError(null)
    setAvailabilityMsg(null)
    try {
      const safeCount = Math.max(0, Math.floor(Number(availabilityCount) || 0))
      await api.patch(`/api/art-centers/${targetCenterId}/availability`, {
        art_pills_available: availabilityAvailable,
        art_pills_count: availabilityAvailable ? safeCount : 0,
        art_three_month_people_count: availabilityAvailable ? safeCount : 0,
      })
      setAvailabilityMsg(t.staffDash.availabilitySaved)
      setAvailabilityCount(availabilityAvailable ? safeCount : 0)
      if (admin) {
        setCentersForAdmin((prev) =>
          prev.map((c) =>
            c.id === targetCenterId
              ? {
                  ...c,
                  art_pills_available: availabilityAvailable,
                  art_pills_count: availabilityAvailable ? safeCount : 0,
                  art_three_month_people_count: availabilityAvailable ? safeCount : 0,
                }
              : c,
          ),
        )
      }
    } catch (err) {
      setAvailabilityError(getApiErrorMessage(err))
    } finally {
      setAvailabilityBusy(false)
    }
  }

  const bookingSummary = useMemo(() => {
    const byStatus = bookings.reduce<Record<string, number>>((acc, b) => {
      acc[b.status] = (acc[b.status] ?? 0) + 1
      return acc
    }, {})
    return {
      total: bookings.length,
      pending: (byStatus.requested ?? 0) + (byStatus.accepted ?? 0),
      inProgress: (byStatus.on_my_way ?? 0) + (byStatus.arrived ?? 0),
      done: (byStatus.pill_given ?? 0) + (byStatus.completed ?? 0),
    }
  }, [bookings])

  const filteredBookings = useMemo(() => {
    const q = bookingSearch.trim().toLowerCase()
    if (!q) return bookings
    return bookings.filter((b) => {
      const patient = patientDisplay(b).toLowerCase()
      const center = (b.art_center?.name ?? '').toLowerCase()
      const note = (b.patient_note ?? '').toLowerCase()
      return patient.includes(q) || center.includes(q) || note.includes(q)
    })
  }, [bookingSearch, bookings])

  const filteredRankRows = useMemo(() => {
    const q = rankSearch.trim().toLowerCase()
    if (!q) return rankRows
    return rankRows.filter((r) =>
      [r.name, r.township, r.area].filter(Boolean).join(' ').toLowerCase().includes(q),
    )
  }, [rankRows, rankSearch])

  const adminClinicBreakdown = useMemo(() => {
    const counts = new Map<string, number>()
    for (const b of bookings) {
      const name = b.art_center?.name ?? `#${b.art_center_id}`
      counts.set(name, (counts.get(name) ?? 0) + 1)
    }
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
  }, [bookings])

  const queueStatusBreakdown = useMemo(() => {
    const byStatus = filteredBookings.reduce<Record<string, number>>((acc, row) => {
      acc[row.status] = (acc[row.status] ?? 0) + 1
      return acc
    }, {})
    return [
      { label: 'Requested', value: byStatus.requested ?? 0, tone: 'text-amber-800 bg-amber-100' },
      { label: 'Accepted', value: byStatus.accepted ?? 0, tone: 'text-sky-800 bg-sky-100' },
      { label: 'In route', value: (byStatus.on_my_way ?? 0) + (byStatus.arrived ?? 0), tone: 'text-indigo-800 bg-indigo-100' },
      { label: 'Done', value: (byStatus.pill_given ?? 0) + (byStatus.completed ?? 0), tone: 'text-emerald-800 bg-emerald-100' },
    ]
  }, [filteredBookings])

  const selectedCenterName = useMemo(() => {
    if (!admin) return user?.art_center?.name ?? 'Your linked clinic'
    if (adminCenterId == null) return 'All clinics'
    return centersForAdmin.find((c) => c.id === adminCenterId)?.name ?? `Clinic #${adminCenterId}`
  }, [admin, adminCenterId, centersForAdmin, user?.art_center?.name])

  if (authLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: easeSoft }}
        className="flex min-h-[40vh] items-center justify-center text-stone-500"
      >
        …
      </motion.div>
    )
  }

  if (!user || !isStaffOrAdmin(user.role_id)) {
    return <Navigate to="/profile" replace />
  }

  const bookingsBlocked =
    !admin && (staffCenterId === null || staffCenterId < 1)

  const scoreCell = (r: TopRankedClinic) => r.booking_pill_given_count ?? 0

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(13,148,136,0.16),transparent_35%),linear-gradient(to_bottom_right,#f5f5f4,rgba(254,215,170,0.35),rgba(204,251,241,0.45))]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-5 lg:grid-cols-12"
        >
          <motion.header variants={staggerItem} className={`lg:col-span-12 border-teal-300/45 ${glassPanel} p-6 sm:p-8`}>
            <p className="mb-2 inline-flex rounded-full border border-teal-300/50 bg-teal-50/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-teal-900">
              Staff Operations Console
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
              {t.staffDash.title}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-stone-600">{t.staffDash.subtitle}</p>
            <p className="mt-4 max-w-3xl text-xs leading-relaxed text-stone-500">{t.staffDash.tabLegend}</p>
          </motion.header>

          <motion.div
            variants={staggerItem}
            className={`flex flex-wrap gap-2 lg:col-span-12 ${glassPanel} px-4 py-3 sm:px-5`}
          >
            {(['bookings', 'article', 'rankings'] as const).map((id) => (
              <button
                key={id}
                type="button"
                className={tab === id ? glassTabActive : glassTabIdle}
                onClick={() => setTab(id)}
              >
                {t.staffDash.tabs[id]}
              </button>
            ))}
          </motion.div>
          <motion.div
            variants={staggerItem}
            className="grid gap-4 sm:grid-cols-2 lg:col-span-12 lg:grid-cols-4"
          >
            <div className={`${glassPanel} p-4`}>
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">{t.staffDash.kpiTotal}</p>
              <p className="mt-1 text-2xl font-extrabold text-stone-900 tabular-nums">{bookingSummary.total}</p>
            </div>
            <div className={`${glassPanel} p-4`}>
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">{t.staffDash.kpiPending}</p>
              <p className="mt-1 text-2xl font-extrabold text-stone-900 tabular-nums">{bookingSummary.pending}</p>
            </div>
            <div className={`${glassPanel} p-4`}>
              <p className="text-xs font-semibold uppercase tracking-wide text-sky-800">{t.staffDash.kpiInProgress}</p>
              <p className="mt-1 text-2xl font-extrabold text-stone-900 tabular-nums">{bookingSummary.inProgress}</p>
            </div>
            <div className={`${glassPanel} p-4`}>
              <p className="text-xs font-semibold uppercase tracking-wide text-emerald-800">{t.staffDash.kpiDone}</p>
              <p className="mt-1 text-2xl font-extrabold text-stone-900 tabular-nums">{bookingSummary.done}</p>
            </div>
          </motion.div>

          {tab === 'bookings' && (
            <motion.div variants={staggerItem} className="space-y-5 lg:col-span-12">
              <div className="grid gap-5 lg:grid-cols-12">
                <div className={`flex flex-col gap-4 lg:col-span-5 ${glassPanel} p-5 sm:p-6`}>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-white/60 bg-white/45 p-3">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-stone-500">Selected clinic</p>
                      <p className="mt-1 text-sm font-semibold text-teal-900">{selectedCenterName}</p>
                    </div>
                    <div className="rounded-2xl border border-white/60 bg-white/45 p-3">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-stone-500">ART pills</p>
                      <div className="mt-1 flex items-center justify-between">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                            availabilityAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-700'
                          }`}
                        >
                          {availabilityAvailable ? 'Available' : 'Low / Out'}
                        </span>
                        <motion.span
                          key={`queue-pill-${availabilityCount}`}
                          initial={{ scale: 0.9, opacity: 0.6 }}
                          animate={{ scale: [0.95, 1.08, 1], opacity: 1 }}
                          transition={{ duration: 0.5 }}
                          className="text-base font-extrabold text-stone-900 tabular-nums"
                        >
                          {availabilityAvailable ? availabilityCount : 0}
                        </motion.span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-2xl border border-white/60 bg-white/35 p-3">
                    <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-stone-500">
                      Queue at a glance
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {queueStatusBreakdown.map((row) => (
                        <span
                          key={row.label}
                          className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${row.tone}`}
                        >
                          {row.label}: {row.value}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-end gap-3">
                    <label className="block min-w-[13rem] text-sm font-semibold text-stone-800">
                      <span className="mb-1 block">{t.staffDash.searchLabel}</span>
                      <input
                        value={bookingSearch}
                        onChange={(e) => setBookingSearch(e.target.value)}
                        placeholder={t.staffDash.searchPh}
                        className="w-full rounded-2xl border border-white/60 bg-white/50 px-3 py-2 text-sm text-stone-900 backdrop-blur-md"
                      />
                    </label>
                    <label className="block text-sm font-semibold text-stone-800">
                      <span className="mb-1 block">{t.staffDash.statusFilter}</span>
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="rounded-2xl border border-white/60 bg-white/50 px-3 py-2 text-sm text-stone-900 backdrop-blur-md"
                      >
                        <option value="">{t.staffDash.statusAll}</option>
                        <option value="requested">requested</option>
                        <option value="accepted">accepted</option>
                        <option value="on_my_way">on_my_way</option>
                        <option value="arrived">arrived</option>
                        <option value="pill_given">pill_given</option>
                        <option value="completed">completed</option>
                        <option value="cancelled">cancelled</option>
                      </select>
                    </label>
                    {admin ? (
                      <label className="block min-w-[12rem] text-sm font-semibold text-stone-800">
                        <span className="mb-1 block">{t.staffDash.adminCenterFilter}</span>
                        <select
                          value={adminCenterId === null ? '' : String(adminCenterId)}
                          onChange={(e) => {
                            const v = e.target.value
                            setAdminCenterId(v === '' ? null : Number(v))
                          }}
                          className="w-full rounded-2xl border border-white/60 bg-white/50 px-3 py-2 text-sm text-stone-900 backdrop-blur-md"
                        >
                          <option value="">{t.staffDash.adminAllCenters}</option>
                          {centersForAdmin.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name}
                            </option>
                          ))}
                        </select>
                      </label>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => void loadBookings()}
                      className="rounded-2xl border border-teal-300/50 bg-teal-500/15 px-4 py-2 text-sm font-semibold text-teal-900 backdrop-blur-md transition hover:bg-teal-500/25"
                    >
                      {t.staffDash.refresh}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setStatusFilter('requested')
                        setBookingSearch('')
                      }}
                      className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-900 transition hover:bg-amber-100"
                    >
                      Focus requested
                    </button>
                  </div>
                </div>

                <div className={`lg:col-span-7 ${glassPanel} p-5 sm:p-6`}>
                  {!admin && staffCenterId != null && user?.art_center?.name ? (
                    <div className="space-y-2 text-sm text-stone-700">
                      <p>
                        {t.staffDash.bookingsLinkedClinicPrefix}{' '}
                        <span className="font-semibold text-teal-900">{user.art_center.name}</span>
                        {user.art_center.nickname ? (
                          <span className="text-stone-500"> ({user.art_center.nickname})</span>
                        ) : null}
                        . {t.staffDash.bookingsLinkedClinicSuffix}
                      </p>
                      <p className="text-xs text-stone-500">
                        {t.staffDash.bookingsLinkedIdLabel}{' '}
                        <code className="rounded-xl bg-white/60 px-2 py-0.5 font-mono text-stone-800 backdrop-blur-sm">
                          {staffCenterId}
                        </code>
                      </p>
                    </div>
                  ) : admin ? (
                    <div className="space-y-3">
                      <p className="text-sm leading-relaxed text-stone-600">
                        {t.staffDash.adminCenterFilter} — {t.staffDash.adminAllCenters}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold text-stone-700">
                          Clinics loaded: {centersForAdmin.length}
                        </span>
                        <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-800">
                          Current filter: {adminCenterId === null ? t.staffDash.adminAllCenters : `#${adminCenterId}`}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            setStatusFilter('requested')
                            setAdminCenterId(null)
                          }}
                          className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-900 transition hover:bg-amber-100"
                        >
                          Quick: Requested only
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setStatusFilter('')
                            setBookingSearch('')
                            setAdminCenterId(null)
                          }}
                          className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-900 transition hover:bg-teal-100"
                        >
                          Clear filters
                        </button>
                      </div>
                      {adminClinicBreakdown.length > 0 ? (
                        <div className="rounded-2xl border border-white/60 bg-white/40 p-3 backdrop-blur">
                          <p className="text-xs font-bold uppercase tracking-wide text-teal-800">
                            Top busy clinics (current data)
                          </p>
                          <ul className="mt-2 space-y-1">
                            {adminClinicBreakdown.map(([name, count]) => (
                              <li key={name} className="flex items-center justify-between text-xs text-stone-700">
                                <span className="truncate pr-3">{name}</span>
                                <span className="font-bold tabular-nums">{count}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                  <form onSubmit={saveAvailability} className="mt-4 space-y-3 rounded-2xl border border-white/60 bg-white/40 p-4 backdrop-blur">
                    <div>
                      <p className="text-sm font-bold text-stone-900">{t.staffDash.availabilityTitle}</p>
                      <p className="text-xs text-stone-600">{t.staffDash.availabilityHint}</p>
                    </div>
                    <p className="text-xs text-stone-700">
                      {t.staffDash.availabilityClinicLabel}:{' '}
                      <span className="font-semibold text-teal-900">
                        {targetCenterId == null ? t.staffDash.adminAllCenters : `#${targetCenterId}`}
                      </span>
                    </p>
                    <label className="flex items-center justify-between rounded-xl border border-teal-100 bg-teal-50/70 px-3 py-2 text-sm font-semibold text-teal-900">
                      <span>{t.staffDash.availabilityToggle}</span>
                      <input
                        type="checkbox"
                        checked={availabilityAvailable}
                        onChange={(e) => setAvailabilityAvailable(e.target.checked)}
                        disabled={availabilityLoading || targetCenterId == null}
                        className="h-4 w-4 accent-teal-700"
                      />
                    </label>
                    <label className="block text-sm font-semibold text-stone-800">
                      <span className="mb-1 block">{t.staffDash.availabilityCount}</span>
                      <input
                        type="number"
                        min={0}
                        step={1}
                        value={availabilityCount}
                        onChange={(e) => setAvailabilityCount(Number(e.target.value))}
                        disabled={availabilityLoading || !availabilityAvailable || targetCenterId == null}
                        className="w-full rounded-2xl border border-white/60 bg-white/50 px-3 py-2 text-sm text-stone-900 backdrop-blur-md"
                      />
                    </label>
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold uppercase tracking-wide text-stone-500">
                        {t.staffDash.availabilityQuickSet}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {[1, 2, 3, 5, 10].map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => {
                              setAvailabilityAvailable(true)
                              setAvailabilityCount(n)
                            }}
                            className="rounded-xl border border-teal-200 bg-teal-50 px-2.5 py-1 text-xs font-semibold text-teal-900 transition hover:bg-teal-100"
                          >
                            {n} person / 3m
                          </button>
                        ))}
                      </div>
                    </div>
                    {availabilityError ? <p className="text-xs text-rose-700">{availabilityError}</p> : null}
                    {availabilityMsg ? <p className="text-xs text-emerald-700">{availabilityMsg}</p> : null}
                    <button
                      type="submit"
                      disabled={availabilityBusy || availabilityLoading || targetCenterId == null}
                      className="w-full rounded-2xl border border-teal-300/50 bg-teal-500/15 px-4 py-2 text-sm font-semibold text-teal-900 backdrop-blur-md transition hover:bg-teal-500/25 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {targetCenterId == null ? t.staffDash.availabilityNeedClinic : t.staffDash.availabilitySave}
                    </button>
                  </form>
                </div>
              </div>

              {bookingsBlocked ? (
                <motion.p
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ ease: easeSoft }}
                  className={`${glassPanel} border-amber-200/50 bg-amber-50/50 px-5 py-4 text-sm text-amber-950`}
                >
                  {t.staffDash.bookingsNeedCenter}
                </motion.p>
              ) : null}

              {bookingsError ? (
                <p
                  className={`${glassPanel} border-rose-200/60 bg-rose-50/60 px-5 py-4 text-sm text-rose-800`}
                >
                  {bookingsError}
                </p>
              ) : null}

              {bookingsLoading ? (
                <p className="text-stone-600">{t.staff.working}</p>
              ) : filteredBookings.length === 0 && !bookingsBlocked ? (
                <div className="grid gap-5 lg:grid-cols-12">
                  <div className={`lg:col-span-8 ${glassPanel} px-6 py-10 text-center text-stone-600`}>
                    {t.staffDash.bookingsEmpty}
                  </div>
                  <div className={`flex flex-col justify-between gap-4 lg:col-span-4 ${glassPanel} p-6`}>
                    {!admin && staffCenterId != null && !bookingsError ? (
                      <p className="text-xs leading-relaxed text-stone-600">
                        {t.staffDash.bookingsEmptyStaffHint}
                      </p>
                    ) : null}
                    <div>
                      <p className="mb-3 text-xs font-semibold text-stone-800">
                        {t.staffDash.bookingsEmptyActionsIntro}
                      </p>
                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => setTab('rankings')}
                          className="rounded-2xl border border-teal-300/40 bg-white/40 px-4 py-2.5 text-xs font-semibold text-teal-900 backdrop-blur-md transition hover:bg-white/60"
                        >
                          {t.staffDash.bookingsEmptyGoRankings}
                        </button>
                        <button
                          type="button"
                          onClick={() => setTab('article')}
                          className="rounded-2xl border border-teal-300/40 bg-white/40 px-4 py-2.5 text-xs font-semibold text-teal-900 backdrop-blur-md transition hover:bg-white/60"
                        >
                          {t.staffDash.bookingsEmptyGoArticle}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : !bookingsBlocked ? (
                <motion.ul
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-4"
                >
                  {filteredBookings.map((b) => (
                    <motion.li key={b.id} variants={staggerItem} className={`${glassPanel} p-5 sm:p-6`}>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 flex-1 gap-3">
                          <BookingStatusMascot
                            status={b.status}
                            size={72}
                            aria-label={statusLabel(b.status)}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-bold uppercase tracking-wide text-teal-800">
                              {t.staffDash.bookingPatient}: {patientDisplay(b)}
                            </p>
                            {admin && b.art_center ? (
                              <p className="mt-1 text-sm text-stone-600">
                                {t.staff.at}: {b.art_center.name}
                              </p>
                            ) : null}
                            <p className="mt-1 text-sm text-stone-600">
                              {t.staffDash.bookingStatus}:{' '}
                              <span className="font-semibold text-stone-900">
                                {statusLabel(b.status)}
                              </span>
                            </p>
                            {b.patient_note ? (
                              <p className="mt-2 text-xs text-stone-500">
                                {t.staffDash.note}: {b.patient_note}
                              </p>
                            ) : null}
                          </div>
                        </div>
                        <div className="flex shrink-0 flex-wrap gap-2">
                          {b.status === 'requested' ? (
                            <button
                              type="button"
                              disabled={busyBookingId === b.id}
                              onClick={() => void patchBooking(b.id, 'accept')}
                              className="rounded-2xl bg-teal-600 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-teal-900/20 disabled:opacity-60"
                            >
                              {busyBookingId === b.id ? t.staff.working : t.staffDash.accept}
                            </button>
                          ) : null}
                          {b.status === 'arrived' ? (
                            <button
                              type="button"
                              disabled={busyBookingId === b.id}
                              onClick={() => void patchBooking(b.id, 'pill-given')}
                              className="rounded-2xl bg-teal-700 px-3 py-2 text-xs font-semibold text-white shadow-lg shadow-teal-900/20 disabled:opacity-60"
                            >
                              {busyBookingId === b.id ? t.staff.working : t.staffDash.pillGiven}
                            </button>
                          ) : null}
                          {b.status !== 'completed' && b.status !== 'cancelled' ? (
                            <button
                              type="button"
                              disabled={busyBookingId === b.id}
                              onClick={() => void patchBooking(b.id, 'cancel')}
                              className="rounded-2xl border border-rose-200/80 bg-rose-50/70 px-3 py-2 text-xs font-semibold text-rose-900 backdrop-blur-sm disabled:opacity-60"
                            >
                              {busyBookingId === b.id ? t.staff.working : t.staffDash.cancelBooking}
                            </button>
                          ) : null}
                        </div>
                      </div>
                    </motion.li>
                  ))}
                </motion.ul>
              ) : null}
            </motion.div>
          )}

          {tab === 'article' && (
            <motion.div
              variants={staggerItem}
              className="grid gap-5 lg:col-span-12 lg:grid-cols-12"
            >
              <div className={`lg:col-span-7 ${glassPanel} p-6 sm:p-8`}>
                <h2 className="text-lg font-bold text-stone-900">{t.staffDash.articleHeading}</h2>
                <p className="mt-2 text-sm text-stone-600">{t.staffDash.articleHint}</p>
                {articleErr ? (
                  <p className="mt-4 rounded-2xl border border-rose-200/60 bg-rose-50/70 px-4 py-3 text-sm text-rose-800 backdrop-blur-sm">
                    {articleErr}
                  </p>
                ) : null}
                {articleMsg ? (
                  <p className="mt-4 rounded-2xl border border-teal-200/60 bg-teal-50/70 px-4 py-3 text-sm text-teal-900 backdrop-blur-sm">
                    {articleMsg}
                  </p>
                ) : null}
                <form className="mt-6 space-y-4" onSubmit={(e) => void submitArticle(e)}>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setArticleCategory('Basics')}
                      className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-800"
                    >
                      {t.staffDash.presetBasics}
                    </button>
                    <button
                      type="button"
                      onClick={() => setArticleCategory('Care')}
                      className="rounded-xl border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-800"
                    >
                      {t.staffDash.presetCare}
                    </button>
                    <button
                      type="button"
                      onClick={() => setArticleCategory('Psychosocial')}
                      className="rounded-xl border border-violet-200 bg-violet-50 px-3 py-1.5 text-xs font-semibold text-violet-800"
                    >
                      {t.staffDash.presetPsychosocial}
                    </button>
                  </div>
                  <label className="block text-sm font-semibold text-stone-800">
                    {t.staffDash.articleTitle}
                    <input
                      required
                      value={articleTitle}
                      onChange={(e) => setArticleTitle(e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-white/60 bg-white/50 px-3 py-2 text-stone-900 backdrop-blur-md"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-stone-800">
                    {t.staffDash.articleCategory}
                    <select
                      value={articleCategory}
                      onChange={(e) => setArticleCategory(e.target.value)}
                      className="mt-1 w-full rounded-2xl border border-white/60 bg-white/50 px-3 py-2 text-stone-900 backdrop-blur-md"
                    >
                      <option value="Basics">Basics</option>
                      <option value="Care">Care</option>
                      <option value="More">More</option>
                    </select>
                  </label>
                  <label className="block text-sm font-semibold text-stone-800">
                    {t.staffDash.articleBody}
                    <textarea
                      value={articleBody}
                      onChange={(e) => setArticleBody(e.target.value)}
                      rows={8}
                      className="mt-1 w-full rounded-2xl border border-white/60 bg-white/50 px-3 py-2 text-stone-900 backdrop-blur-md"
                    />
                  </label>
                  <label className="block text-sm font-semibold text-stone-800">
                    {t.staffDash.articleEbookUrl}
                    <input
                      type="url"
                      value={articleEbookUrl}
                      onChange={(e) => setArticleEbookUrl(e.target.value)}
                      placeholder="https://example.com/support-ebook.pdf"
                      className="mt-1 w-full rounded-2xl border border-white/60 bg-white/50 px-3 py-2 text-stone-900 backdrop-blur-md"
                    />
                  </label>
                  <button
                    type="submit"
                    disabled={articleBusy}
                    className="rounded-2xl bg-teal-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/25 disabled:opacity-60"
                  >
                    {articleBusy ? t.staff.working : t.staffDash.articleSubmit}
                  </button>
                </form>
              </div>
              <div
                className={`flex flex-col justify-center ${glassPanel} p-6 sm:p-8 lg:col-span-5`}
              >
                <p className="text-xs font-bold uppercase tracking-wide text-teal-800">
                  {t.staffDash.workflowSnapshot}
                </p>
                <div className="mt-4 flex items-center gap-4">
                  <DonutChart
                    slices={[
                      { value: bookingSummary.pending, color: '#f59e0b', label: t.staffDash.kpiPending },
                      { value: bookingSummary.inProgress, color: '#0ea5e9', label: t.staffDash.kpiInProgress },
                      { value: bookingSummary.done, color: '#10b981', label: t.staffDash.kpiDone },
                    ]}
                  />
                  <div className="space-y-2 text-xs text-stone-700">
                    <p>
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-amber-500" />{' '}
                      {t.staffDash.kpiPending}: <span className="font-bold">{bookingSummary.pending}</span>
                    </p>
                    <p>
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-sky-500" />{' '}
                      {t.staffDash.kpiInProgress}: <span className="font-bold">{bookingSummary.inProgress}</span>
                    </p>
                    <p>
                      <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500" />{' '}
                      {t.staffDash.kpiDone}: <span className="font-bold">{bookingSummary.done}</span>
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {tab === 'rankings' && (
            <motion.div variants={staggerItem} className="lg:col-span-12">
              {rankError ? (
                <p className={`mb-5 ${glassPanel} border-rose-200/60 bg-rose-50/60 px-5 py-4 text-sm text-rose-800`}>
                  {rankError}
                </p>
              ) : null}
              {rankLoading ? (
                <p className="text-stone-600">{t.home.clinicsLoading}</p>
              ) : (
                <div className="mb-4">
                  <input
                    value={rankSearch}
                    onChange={(e) => setRankSearch(e.target.value)}
                    placeholder={t.staffDash.rankSearchPh}
                    className="w-full max-w-sm rounded-2xl border border-white/60 bg-white/50 px-3 py-2 text-sm text-stone-900 backdrop-blur-md"
                  />
                </div>
              )}
              {!rankLoading && filteredRankRows.length === 0 ? (
                <p className={`${glassPanel} px-6 py-10 text-stone-600`}>{t.home.clinicsEmpty}</p>
              ) : (
                <div className={`overflow-x-auto ${glassPanel}`}>
                  <table className="min-w-full text-left text-sm">
                    <thead className="border-b border-white/40 bg-white/30 text-xs font-bold uppercase tracking-wide text-teal-900 backdrop-blur-md">
                      <tr>
                        <th className="px-4 py-3">#</th>
                        <th className="px-4 py-3">{t.staffDash.rankClinic}</th>
                        <th className="px-4 py-3">{t.staffDash.rankTownship}</th>
                        <th className="px-4 py-3">{t.staffDash.rankScore}</th>
                        <th className="px-4 py-3">{t.home.reviewsLabel}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRankRows.map((r, idx) => (
                        <tr
                          key={r.id}
                          className="border-b border-white/30 last:border-0 transition hover:bg-white/25"
                        >
                          <td className="px-4 py-3 text-stone-500">{idx + 1}</td>
                          <td className="px-4 py-3 font-medium text-stone-900">{r.name}</td>
                          <td className="px-4 py-3 text-stone-600">
                            {[r.township, r.area].filter(Boolean).join(' · ') || '—'}
                          </td>
                          <td className="px-4 py-3 text-stone-800">{scoreCell(r)}</td>
                          <td className="px-4 py-3 text-stone-600">
                            {r.rating_avg != null ? String(r.rating_avg) : '—'} ({r.total_reviews ?? 0})
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              <p className="mt-4 text-xs text-stone-500">{t.staffDash.rankFootnote}</p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
