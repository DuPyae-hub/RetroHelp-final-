import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
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

  const [rankRows, setRankRows] = useState<TopRankedClinic[]>([])
  const [rankLoading, setRankLoading] = useState(false)
  const [rankError, setRankError] = useState<string | null>(null)

  const [articleTitle, setArticleTitle] = useState('')
  const [articleBody, setArticleBody] = useState('')
  const [articleCategory, setArticleCategory] = useState('Basics')
  const [articleBusy, setArticleBusy] = useState(false)
  const [articleMsg, setArticleMsg] = useState<string | null>(null)
  const [articleErr, setArticleErr] = useState<string | null>(null)

  const admin = user && isAdmin(user.role_id)
  const rawCenter = user?.art_center_id ?? user?.art_center?.id
  const staffCenterId =
    rawCenter != null && Number.isFinite(Number(rawCenter)) && Number(rawCenter) > 0
      ? Number(rawCenter)
      : null

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
        category: articleCategory || null,
      })
      setArticleMsg(t.staffDash.articleSuccess)
      setArticleTitle('')
      setArticleBody('')
    } catch (err) {
      setArticleErr(getApiErrorMessage(err))
    } finally {
      setArticleBusy(false)
    }
  }

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
    <div className="min-h-screen bg-gradient-to-br from-stone-100 via-orange-50/35 to-teal-50/40">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-5 lg:grid-cols-12"
        >
          <motion.header variants={staggerItem} className={`lg:col-span-12 ${glassPanel} p-6 sm:p-8`}>
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

          {tab === 'bookings' && (
            <motion.div variants={staggerItem} className="space-y-5 lg:col-span-12">
              <div className="grid gap-5 lg:grid-cols-12">
                <div className={`flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between lg:col-span-5 ${glassPanel} p-5 sm:p-6`}>
                  <div className="flex flex-wrap items-end gap-3">
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
                  <button
                    type="button"
                    onClick={() => void loadBookings()}
                    className="rounded-2xl border border-teal-300/50 bg-teal-500/15 px-4 py-2 text-sm font-semibold text-teal-900 backdrop-blur-md transition hover:bg-teal-500/25"
                  >
                    {t.staffDash.refresh}
                  </button>
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
                    <p className="text-sm leading-relaxed text-stone-600">
                      {t.staffDash.adminCenterFilter} — {t.staffDash.adminAllCenters}
                    </p>
                  ) : null}
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
              ) : bookings.length === 0 && !bookingsBlocked ? (
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
                  {bookings.map((b) => (
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
                  {t.library.title}
                </p>
                <p className="mt-3 text-sm leading-relaxed text-stone-600">{t.library.description}</p>
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
              ) : rankRows.length === 0 ? (
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
                      {rankRows.map((r, idx) => (
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
