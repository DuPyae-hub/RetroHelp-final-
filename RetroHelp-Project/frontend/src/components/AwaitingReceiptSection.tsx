import { motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { api, getApiErrorMessage } from '../api/client'
import { isCommunityMember } from '../constants/roles'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import type { AwaitingReceiptItem } from '../types/api'

export function AwaitingReceiptSection() {
  const { t } = useLanguage()
  const { user, token } = useAuth()
  const [items, setItems] = useState<AwaitingReceiptItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<number | null>(null)

  const load = useCallback(async () => {
    if (!user || !token || !isCommunityMember(user.role_id)) {
      setItems([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const { data } = await api.get<{ data: AwaitingReceiptItem[] }>(
        '/api/pill-dispenses/awaiting-receipt',
      )
      setItems(data.data)
    } catch (err) {
      setError(getApiErrorMessage(err))
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [user, token])

  useEffect(() => {
    void load()
  }, [load])

  const confirm = async (id: number) => {
    setBusyId(id)
    try {
      await api.patch(`/api/pill-dispenses/${id}/mark-received`)
      await load()
    } catch (err) {
      setError(getApiErrorMessage(err))
    } finally {
      setBusyId(null)
    }
  }

  if (!user || !token || !isCommunityMember(user.role_id)) {
    return null
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h2 className="text-xl font-bold text-stone-900 sm:text-2xl">
        {t.receipt.title}
      </h2>
      <p className="mt-2 max-w-2xl text-sm leading-relaxed text-stone-600">
        {t.receipt.subtitle}
      </p>

      {error && (
        <p className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </p>
      )}

      {loading ? (
        <p className="mt-6 text-sm text-stone-600">{t.receipt.busy}</p>
      ) : items.length === 0 ? (
        <p className="mt-6 rounded-3xl border border-orange-100/80 bg-white/70 px-5 py-6 text-sm text-stone-600">
          {t.receipt.none}
        </p>
      ) : (
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {items.map((item) => (
            <motion.li
              key={item.dispense_id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-teal-100 bg-white p-6 shadow-lg shadow-teal-900/5"
            >
              <p className="text-sm font-semibold text-stone-900">
                {item.art_center_name ?? '—'}
              </p>
              <p className="mt-1 text-xs text-stone-500">
                {t.receipt.when}:{' '}
                {item.dispense_date
                  ? new Date(item.dispense_date).toLocaleString()
                  : '—'}
              </p>
              <motion.button
                type="button"
                className="mt-4 w-full rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 py-3 text-sm font-semibold text-white shadow-md disabled:opacity-60"
                whileTap={{ scale: 0.98 }}
                disabled={busyId === item.dispense_id}
                onClick={() => void confirm(item.dispense_id)}
              >
                {busyId === item.dispense_id
                  ? t.receipt.busy
                  : t.receipt.confirm}
              </motion.button>
            </motion.li>
          ))}
        </ul>
      )}
    </section>
  )
}
