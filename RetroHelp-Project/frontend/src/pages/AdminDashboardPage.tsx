import { motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, getApiErrorMessage } from '../api/client'
import { isAdmin } from '../constants/roles'
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

type AdminTab = 'overview' | 'staff' | 'clinics'

type PendingStaff = {
  id: number
  full_name: string
  created_at: string | null
}

type PendingCenter = {
  id: number
  name: string
  nickname: string | null
  image: string | null
  township: string | null
  area: string | null
  contact_no: string | null
  created_at: string | null
}

type OverviewPayload = {
  users: {
    total: number
    patients: number
    clinic_staff: number
    admins: number
    pending_clinic_staff: number
  }
  art_centers: {
    total: number
    pending_verification: number
  }
  bookings: {
    total: number
    by_status: Record<string, number>
  }
}

function DonutChart({
  slices,
}: {
  slices: { value: number; color: string; label: string }[]
}) {
  const total = Math.max(1, slices.reduce((sum, s) => sum + s.value, 0))
  const r = 42
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
            transform="rotate(-90 60 60)"
          />
        )
        offset += len
        return el
      })}
      <circle cx="60" cy="60" r="26" fill="#fff" />
      <text x="60" y="56" textAnchor="middle" className="fill-stone-500 text-[9px] font-semibold">
        BOOKINGS
      </text>
      <text x="60" y="72" textAnchor="middle" className="fill-stone-900 text-[15px] font-extrabold">
        {slices.reduce((sum, s) => sum + s.value, 0)}
      </text>
    </svg>
  )
}

export function AdminDashboardPage() {
  const { t } = useLanguage()
  const { user, loading: authLoading } = useAuth()
  const [tab, setTab] = useState<AdminTab>('overview')
  const [error, setError] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)

  const [overview, setOverview] = useState<OverviewPayload | null>(null)
  const [overviewLoading, setOverviewLoading] = useState(false)

  const [staffRows, setStaffRows] = useState<PendingStaff[] | null>(null)
  const [staffBusyId, setStaffBusyId] = useState<number | null>(null)
  const [staffSearch, setStaffSearch] = useState('')

  const [centerRows, setCenterRows] = useState<PendingCenter[] | null>(null)
  const [centerBusyId, setCenterBusyId] = useState<number | null>(null)
  const [centerSearch, setCenterSearch] = useState('')

  const loadOverview = useCallback(async () => {
    setOverviewLoading(true)
    setError(null)
    try {
      const { data } = await api.get<{ data: OverviewPayload }>('/api/admin/overview')
      setOverview(data.data)
    } catch (e) {
      setOverview(null)
      setError(getApiErrorMessage(e))
    } finally {
      setOverviewLoading(false)
    }
  }, [])

  const loadStaff = useCallback(async () => {
    setError(null)
    try {
      const { data } = await api.get<{ data: PendingStaff[] }>('/api/admin/clinic-staff/pending')
      setStaffRows(data.data)
    } catch (e) {
      setStaffRows([])
      setError(getApiErrorMessage(e))
    }
  }, [])

  const loadCenters = useCallback(async () => {
    setError(null)
    try {
      const { data } = await api.get<{ data: PendingCenter[] }>('/api/admin/art-centers/pending')
      setCenterRows(data.data)
    } catch (e) {
      setCenterRows([])
      setError(getApiErrorMessage(e))
    }
  }, [])

  useEffect(() => {
    if (authLoading || !user || !isAdmin(user.role_id)) return
    if (tab === 'overview') void loadOverview()
    if (tab === 'staff') void loadStaff()
    if (tab === 'clinics') void loadCenters()
  }, [authLoading, loadCenters, loadOverview, loadStaff, tab, user])

  const approveStaff = async (id: number) => {
    setStaffBusyId(id)
    setMsg(null)
    setError(null)
    try {
      await api.post(`/api/admin/clinic-staff/${id}/approve`)
      setMsg(t.adminDash.approveStaffOk)
      await loadStaff()
      await loadOverview()
    } catch (e) {
      setError(getApiErrorMessage(e))
    } finally {
      setStaffBusyId(null)
    }
  }

  const verifyCenter = async (id: number) => {
    setCenterBusyId(id)
    setMsg(null)
    setError(null)
    try {
      await api.post(`/api/admin/art-centers/${id}/verify`)
      setMsg(t.adminDash.verifyCenterOk)
      await loadCenters()
      await loadOverview()
    } catch (e) {
      setError(getApiErrorMessage(e))
    } finally {
      setCenterBusyId(null)
    }
  }

  const filteredStaffRows = useMemo(() => {
    const rows = staffRows ?? []
    const q = staffSearch.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((r) => r.full_name.toLowerCase().includes(q))
  }, [staffRows, staffSearch])

  const filteredCenterRows = useMemo(() => {
    const rows = centerRows ?? []
    const q = centerSearch.trim().toLowerCase()
    if (!q) return rows
    return rows.filter((c) =>
      [c.name, c.township, c.area, c.nickname, c.contact_no].filter(Boolean).join(' ').toLowerCase().includes(q),
    )
  }, [centerRows, centerSearch])

  if (authLoading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: easeSoft }}
        className="flex min-h-[40vh] items-center justify-center text-stone-500"
      >
        {t.admin.loading}
      </motion.div>
    )
  }

  if (!user || !isAdmin(user.role_id)) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: easeSoft }}
        className="mx-auto max-w-xl px-4 py-16 text-center"
      >
        <p className="text-stone-700">{t.admin.forbidden}</p>
        <Link
          to="/profile"
          className="mt-4 inline-block text-sm font-semibold text-teal-800 underline"
        >
          {t.profile.tabSignIn}
        </Link>
      </motion.div>
    )
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(249,115,22,0.18),transparent_32%),linear-gradient(to_bottom_right,#f5f5f4,rgba(254,215,170,0.35),rgba(236,253,245,0.45))]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-14">
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
          className="grid gap-5 lg:grid-cols-12"
        >
          <motion.header variants={staggerItem} className={`lg:col-span-12 border-orange-300/45 ${glassPanel} p-6 sm:p-8`}>
            <p className="mb-2 inline-flex rounded-full border border-orange-300/50 bg-orange-50/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-orange-900">
              Admin Control Center
            </p>
            <h1 className="text-3xl font-extrabold tracking-tight text-stone-900">
              {t.adminDash.title}
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-stone-600 sm:text-base">
              {t.adminDash.subtitle}
            </p>
          </motion.header>

          <motion.div
            variants={staggerItem}
            className={`flex flex-wrap gap-2 lg:col-span-12 ${glassPanel} px-4 py-3 sm:px-5`}
          >
            {(['overview', 'staff', 'clinics'] as const).map((id) => (
              <button
                key={id}
                type="button"
                className={tab === id ? glassTabActive : glassTabIdle}
                onClick={() => setTab(id)}
              >
                {t.adminDash.tabs[id]}
              </button>
            ))}
          </motion.div>
          <motion.div
            variants={staggerItem}
            className="grid gap-4 sm:grid-cols-2 lg:col-span-12 lg:grid-cols-3"
          >
            <button
              type="button"
              onClick={() => setTab('overview')}
              className={`text-left ${glassPanel} p-5 transition hover:scale-[1.01]`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-teal-800">{t.adminDash.quickOverview}</p>
              <p className="mt-1 text-sm text-stone-600">{t.adminDash.quickOverviewSub}</p>
            </button>
            <button
              type="button"
              onClick={() => setTab('staff')}
              className={`text-left ${glassPanel} p-5 transition hover:scale-[1.01]`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-amber-800">{t.adminDash.quickPendingStaff}</p>
              <p className="mt-1 text-sm font-bold text-stone-900 tabular-nums">
                {overview?.users.pending_clinic_staff ?? 0}
              </p>
            </button>
            <button
              type="button"
              onClick={() => setTab('clinics')}
              className={`text-left ${glassPanel} p-5 transition hover:scale-[1.01]`}
            >
              <p className="text-xs font-semibold uppercase tracking-wide text-orange-800">{t.adminDash.quickPendingClinics}</p>
              <p className="mt-1 text-sm font-bold text-stone-900 tabular-nums">
                {overview?.art_centers.pending_verification ?? 0}
              </p>
            </button>
          </motion.div>

          {error ? (
            <motion.p
              variants={staggerItem}
              className={`lg:col-span-12 ${glassPanel} border-rose-200/60 bg-rose-50/60 px-5 py-4 text-sm text-rose-800`}
            >
              {error}
            </motion.p>
          ) : null}
          {msg ? (
            <motion.p
              variants={staggerItem}
              className={`lg:col-span-12 ${glassPanel} border-teal-200/60 bg-teal-50/60 px-5 py-4 text-sm text-teal-900`}
            >
              {msg}
            </motion.p>
          ) : null}

          {tab === 'overview' && (
            <motion.div variants={staggerItem} className="lg:col-span-12 w-full">
              {overviewLoading ? (
                <p className="text-stone-600">{t.admin.loading}</p>
              ) : overview ? (
                <motion.div
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  className="grid gap-5 lg:grid-cols-12"
                >
                  <motion.div
                    variants={staggerItem}
                    className={`lg:col-span-4 ${glassPanel} p-6`}
                  >
                    <p className="text-xs font-bold uppercase tracking-wide text-teal-800">
                      {t.adminDash.labelPatients}
                    </p>
                    <p className="mt-3 text-4xl font-extrabold text-stone-900 tabular-nums">
                      {overview.users.patients}
                    </p>
                  </motion.div>
                  <motion.div
                    variants={staggerItem}
                    className={`lg:col-span-4 ${glassPanel} p-6`}
                  >
                    <p className="text-xs font-bold uppercase tracking-wide text-teal-800">
                      {t.adminDash.labelStaff}
                    </p>
                    <p className="mt-3 text-4xl font-extrabold text-stone-900 tabular-nums">
                      {overview.users.clinic_staff}
                    </p>
                  </motion.div>
                  <motion.div
                    variants={staggerItem}
                    className={`lg:col-span-4 ${glassPanel} p-6`}
                  >
                    <p className="text-xs font-bold uppercase tracking-wide text-teal-800">
                      {t.adminDash.labelAdmins}
                    </p>
                    <p className="mt-3 text-4xl font-extrabold text-stone-900 tabular-nums">
                      {overview.users.admins}
                    </p>
                  </motion.div>

                  <motion.div
                    variants={staggerItem}
                    className={`lg:col-span-6 ${glassPanel} p-6 sm:p-7`}
                  >
                    <p className="text-xs font-bold uppercase tracking-wide text-teal-800">
                      {t.adminDash.cardUsers}
                    </p>
                    <p className="mt-2 text-3xl font-extrabold text-stone-900 tabular-nums">
                      {overview.users.total}
                    </p>
                    <p className="mt-4 text-sm font-semibold text-amber-900">
                      {t.adminDash.labelPendingStaff}: {overview.users.pending_clinic_staff}
                    </p>
                  </motion.div>

                  <motion.div
                    variants={staggerItem}
                    className={`lg:col-span-6 ${glassPanel} p-6 sm:p-7`}
                  >
                    <p className="text-xs font-bold uppercase tracking-wide text-teal-800">
                      {t.adminDash.cardCentersBookings}
                    </p>
                    <ul className="mt-4 space-y-2 text-sm text-stone-700">
                      <li>
                        {t.adminDash.labelCenters}: {overview.art_centers.total}
                      </li>
                      <li className="font-semibold text-amber-900">
                        {t.adminDash.labelPendingCenters}: {overview.art_centers.pending_verification}
                      </li>
                      <li>
                        {t.adminDash.labelBookings}: {overview.bookings.total}
                      </li>
                    </ul>
                  </motion.div>

                  <motion.div
                    variants={staggerItem}
                    className={`lg:col-span-12 ${glassPanel} p-6 sm:p-7`}
                  >
                    <p className="text-xs font-bold uppercase tracking-wide text-teal-800">
                      {t.adminDash.bookingsByStatus}
                    </p>
                    <div className="mt-4 grid gap-4 md:grid-cols-[auto_1fr] md:items-center">
                      <DonutChart
                        slices={Object.entries(overview.bookings.by_status).map(([k, v], idx) => ({
                          label: k,
                          value: Number(v) || 0,
                          color: ['#0ea5e9', '#f59e0b', '#10b981', '#f97316', '#8b5cf6', '#14b8a6', '#ef4444'][idx % 7],
                        }))}
                      />
                      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                        {Object.entries(overview.bookings.by_status).map(([k, v], idx) => {
                          const color = ['#0ea5e9', '#f59e0b', '#10b981', '#f97316', '#8b5cf6', '#14b8a6', '#ef4444'][idx % 7]
                          return (
                            <li
                              key={k}
                              className="rounded-2xl border border-white/50 bg-white/35 px-4 py-3 text-sm backdrop-blur-md"
                            >
                              <span className="inline-block h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} />{' '}
                              <span className="font-semibold text-stone-800">{k}</span>
                              <span className="ml-2 tabular-nums text-stone-600">{v}</span>
                            </li>
                          )
                        })}
                      </ul>
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <p className="text-stone-600">{t.adminDash.overviewEmpty}</p>
              )}
            </motion.div>
          )}

          {tab === 'staff' && (
            <motion.div variants={staggerItem} className="lg:col-span-12">
              <div className={`${glassPanel} p-6 sm:p-8`}>
                <h2 className="text-lg font-bold text-stone-900">{t.admin.pendingTitle}</h2>
                <p className="mt-2 text-sm text-stone-600">{t.admin.pendingDescription}</p>
                <div className="mt-4">
                  <input
                    value={staffSearch}
                    onChange={(e) => setStaffSearch(e.target.value)}
                    placeholder={t.adminDash.searchStaffPh}
                    className="w-full max-w-sm rounded-2xl border border-white/60 bg-white/50 px-3 py-2 text-sm text-stone-900 backdrop-blur-md"
                  />
                </div>
                {staffRows === null ? (
                  <p className="mt-6 text-stone-600">{t.admin.loading}</p>
                ) : filteredStaffRows.length === 0 ? (
                  <p className="mt-6 rounded-[1.75rem] border border-dashed border-orange-200/80 bg-white/40 px-5 py-10 text-center text-sm text-stone-600 backdrop-blur-sm">
                    {t.admin.empty}
                  </p>
                ) : (
                  <motion.ul
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="mt-6 grid gap-4 sm:grid-cols-2"
                  >
                    {filteredStaffRows.map((r) => (
                      <motion.li
                        key={r.id}
                        variants={staggerItem}
                        className={`flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between ${glassPanel} p-5`}
                      >
                        <div>
                          <p className="font-semibold text-stone-900">{r.full_name}</p>
                          {r.created_at ? (
                            <p className="mt-1 text-xs text-stone-500">{r.created_at}</p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          disabled={staffBusyId === r.id}
                          onClick={() => void approveStaff(r.id)}
                          className="rounded-2xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/20 disabled:opacity-60"
                        >
                          {staffBusyId === r.id ? t.admin.approving : t.admin.approveBtn}
                        </button>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </div>
            </motion.div>
          )}

          {tab === 'clinics' && (
            <motion.div variants={staggerItem} className="lg:col-span-12">
              <div className={`${glassPanel} p-6 sm:p-8`}>
                <h2 className="text-lg font-bold text-stone-900">{t.adminDash.clinicsTitle}</h2>
                <p className="mt-2 text-sm text-stone-600">{t.adminDash.clinicsDescription}</p>
                <div className="mt-4">
                  <input
                    value={centerSearch}
                    onChange={(e) => setCenterSearch(e.target.value)}
                    placeholder={t.adminDash.searchClinicPh}
                    className="w-full max-w-sm rounded-2xl border border-white/60 bg-white/50 px-3 py-2 text-sm text-stone-900 backdrop-blur-md"
                  />
                </div>
                {centerRows === null ? (
                  <p className="mt-6 text-stone-600">{t.admin.loading}</p>
                ) : filteredCenterRows.length === 0 ? (
                  <p className="mt-6 rounded-[1.75rem] border border-dashed border-orange-200/80 bg-white/40 px-5 py-10 text-center text-sm text-stone-600 backdrop-blur-sm">
                    {t.adminDash.clinicsEmpty}
                  </p>
                ) : (
                  <motion.ul
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                    className="mt-6 grid gap-4 lg:grid-cols-2"
                  >
                    {filteredCenterRows.map((c) => (
                      <motion.li
                        key={c.id}
                        variants={staggerItem}
                        className={`flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between ${glassPanel} p-5`}
                      >
                        <div>
                          <div className="mb-2 overflow-hidden rounded-xl border border-orange-100/80 bg-orange-50/40">
                            {c.image ? (
                              <img src={c.image} alt={c.name} className="h-20 w-full object-cover" loading="lazy" />
                            ) : (
                              <div className="flex h-20 items-center justify-center bg-gradient-to-r from-teal-100 to-orange-100 text-xl">
                                🏥
                              </div>
                            )}
                          </div>
                          <p className="font-semibold text-stone-900">{c.name}</p>
                          <p className="mt-1 text-xs text-stone-500">
                            {[c.township, c.area].filter(Boolean).join(' · ') || '—'}
                          </p>
                          {c.nickname ? (
                            <p className="mt-1 text-xs text-stone-500">
                              {t.adminDash.centerNickname}: {c.nickname}
                            </p>
                          ) : null}
                          {c.contact_no ? (
                            <p className="mt-1 text-xs text-stone-600">
                              {t.adminDash.centerContact}: {c.contact_no}
                            </p>
                          ) : null}
                        </div>
                        <button
                          type="button"
                          disabled={centerBusyId === c.id}
                          onClick={() => void verifyCenter(c.id)}
                          className="shrink-0 rounded-2xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/20 disabled:opacity-60"
                        >
                          {centerBusyId === c.id ? t.admin.approving : t.adminDash.verifyCenterBtn}
                        </button>
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
