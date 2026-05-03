import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { api, getApiErrorMessage } from '../api/client'
import { isStaffOrAdmin } from '../constants/roles'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import type { PendingDispenseItem } from '../types/api'

export function StaffDispensesPage() {
  const { user, loading: authLoading } = useAuth()
  const { t } = useLanguage()
  const [rows, setRows] = useState<PendingDispenseItem[]>([])
  const [listLoading, setListLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setListLoading(true)
    setError(null)
    try {
      const { data } = await api.get<{ data: PendingDispenseItem[] }>(
        '/api/pill-dispenses/pending',
      )
      setRows(data.data)
    } catch (err) {
      setError(getApiErrorMessage(err))
      setRows([])
    } finally {
      setListLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user && isStaffOrAdmin(user.role_id)) void load()
  }, [load, user])

  if (authLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-16 text-center text-stone-600">
        …
      </div>
    )
  }

  if (!user || !isStaffOrAdmin(user.role_id)) {
    return <Navigate to="/profile" replace />
  }

  const markGiven = async (id: number) => {
    setBusyId(id)
    try {
      await api.patch(`/api/pill-dispenses/${id}/mark-given`)
      await load()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 max-w-2xl"
      >
        <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
          {t.staff.title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-stone-600">
          {t.staff.description}
        </p>
      </motion.div>

      {error && (
        <p className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </p>
      )}

      {listLoading ? (
        <p className="text-stone-600">{t.staff.working}</p>
      ) : rows.length === 0 ? (
        <p className="rounded-3xl border border-dashed border-orange-200 bg-white/80 px-6 py-10 text-center text-stone-600">
          {t.staff.empty}
        </p>
      ) : (
        <ul className="space-y-4">
          {rows.map((r, i) => (
            <motion.li
              key={r.dispense_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex flex-col gap-4 rounded-3xl border border-orange-100/90 bg-white p-5 shadow-lg shadow-teal-900/5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-teal-800">
                  {t.staff.member}: {r.community_member_display}
                </p>
                <p className="mt-1 text-sm text-stone-600">
                  {t.staff.at}: {r.art_center_name ?? '—'}
                </p>
                <p className="mt-1 text-xs text-stone-500">{r.status}</p>
              </div>
              <motion.button
                type="button"
                disabled={busyId === r.dispense_id}
                whileTap={{ scale: 0.98 }}
                onClick={() => void markGiven(r.dispense_id)}
                className="shrink-0 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 px-5 py-3 text-sm font-semibold text-white shadow-md disabled:opacity-60"
              >
                {busyId === r.dispense_id
                  ? t.staff.working
                  : t.staff.markGiven}
              </motion.button>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  )
}
