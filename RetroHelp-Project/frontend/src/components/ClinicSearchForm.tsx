import { motion } from 'framer-motion'
import { useState } from 'react'
import { api, getApiErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { isCommunityMember } from '../constants/roles'
import { useLanguage } from '../i18n/LanguageContext'
import type { ArtCenterDetail, ArtCenterSearchItem } from '../types/api'
import { ClinicMapPanel } from './ClinicMapPanel'

type Props = {
  variant?: 'default' | 'compact'
}

function parseCoord(v: string | number | null | undefined): number | null {
  if (v === null || v === undefined || v === '') return null
  const n = typeof v === 'number' ? v : Number.parseFloat(String(v))
  return Number.isFinite(n) ? n : null
}

export function ClinicSearchForm({ variant = 'default' }: Props) {
  const { t } = useLanguage()
  const { user, token } = useAuth()
  const [township, setTownship] = useState('')
  const [area, setArea] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<ArtCenterSearchItem[] | null>(null)
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [detail, setDetail] = useState<ArtCenterDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)
  const [recording, setRecording] = useState(false)
  const [recordMsg, setRecordMsg] = useState<string | null>(null)
  const [recordOk, setRecordOk] = useState<boolean | null>(null)

  const isPatient = user && token && isCommunityMember(user.role_id)

  const search = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setSelectedId(null)
    setDetail(null)
    setRecordMsg(null)
    try {
      const params = new URLSearchParams()
      if (township.trim()) params.set('township', township.trim())
      if (area.trim()) params.set('area', area.trim())
      const q = params.toString()
      const { data } = await api.get<{ data: ArtCenterSearchItem[] }>(
        `/api/art-centers/search${q ? `?${q}` : ''}`,
      )
      setResults(data.data)
    } catch (err) {
      setError(getApiErrorMessage(err))
      setResults(null)
    } finally {
      setLoading(false)
    }
  }

  const openCenter = async (id: number) => {
    setSelectedId(id)
    setDetail(null)
    setDetailError(null)
    setRecordMsg(null)
    setRecordOk(null)
    if (!isPatient) {
      return
    }
    setDetailLoading(true)
    try {
      const { data } = await api.get<{ data: ArtCenterDetail }>(
        `/api/art-centers/${id}`,
      )
      setDetail(data.data)
    } catch (err) {
      setDetailError(getApiErrorMessage(err))
    } finally {
      setDetailLoading(false)
    }
  }

  const recordVisit = async () => {
    if (!selectedId || !isPatient) return
    setRecording(true)
    setRecordMsg(null)
    setRecordOk(null)
    try {
      await api.post('/api/navigations', {
        art_center_id: selectedId,
        start_location: [township, area].filter(Boolean).join(' · ') || null,
      })
      setRecordOk(true)
      setRecordMsg(t.findClinic.visitSaved)
    } catch (err) {
      setRecordOk(false)
      setRecordMsg(getApiErrorMessage(err))
    } finally {
      setRecording(false)
    }
  }

  return (
    <div className="space-y-6">
      <form
        onSubmit={search}
        className={`grid gap-3 ${variant === 'compact' ? 'sm:grid-cols-2' : 'sm:grid-cols-2 lg:grid-cols-3'}`}
      >
        <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-700">
          {t.findClinic.township}
          <input
            value={township}
            onChange={(e) => setTownship(e.target.value)}
            placeholder={t.findClinic.townshipPh}
            className="rounded-2xl border border-orange-100 bg-white px-4 py-3 text-stone-900 shadow-inner shadow-stone-900/5 outline-none ring-teal-500/25 focus:ring-2"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-medium text-stone-700">
          {t.findClinic.area}
          <input
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder={t.findClinic.areaPh}
            className="rounded-2xl border border-orange-100 bg-white px-4 py-3 text-stone-900 shadow-inner shadow-stone-900/5 outline-none ring-teal-500/25 focus:ring-2"
          />
        </label>
        <div
          className={`flex items-end ${variant === 'compact' ? 'sm:col-span-2' : 'sm:col-span-2 lg:col-span-1'}`}
        >
          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/25 transition disabled:opacity-60"
          >
            {loading ? t.findClinic.loading : t.findClinic.submit}
          </motion.button>
        </div>
      </form>

      {error && (
        <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </p>
      )}

      {results && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {results.length === 0 ? (
            <li className="sm:col-span-2 rounded-3xl border border-dashed border-orange-200 bg-white/70 px-5 py-8 text-center text-sm text-stone-600">
              {t.findClinic.empty}
            </li>
          ) : (
            results.map((c, i) => (
              <motion.li
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
                className={`rounded-3xl border bg-white p-5 shadow-lg shadow-teal-900/5 ${
                  selectedId === c.id
                    ? 'border-teal-400 ring-2 ring-teal-200'
                    : 'border-orange-100/90'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-lg font-bold text-stone-900">{c.name}</h3>
                  {c.is_verified && (
                    <span className="shrink-0 rounded-full bg-teal-100 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-teal-800">
                      {t.findClinic.verified}
                    </span>
                  )}
                </div>
                <p className="mt-2 text-sm text-stone-600">
                  {[c.township, c.area].filter(Boolean).join(' · ') || '—'}
                </p>
                <p className="mt-3 text-xs font-medium text-teal-800">
                  {t.findClinic.visitsLabel}:{' '}
                  <span className="text-base font-bold text-teal-900">
                    {c.completed_dispenses_count ?? 0}
                  </span>
                </p>
                <button
                  type="button"
                  onClick={() => void openCenter(c.id)}
                  className="mt-4 w-full rounded-2xl border border-teal-200 bg-teal-50/80 py-2.5 text-sm font-semibold text-teal-900 transition hover:bg-teal-100"
                >
                  {t.findClinic.viewMap}
                </button>
              </motion.li>
            ))
          )}
        </ul>
      )}

      {selectedId !== null && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl border border-orange-100/90 bg-white/90 p-5 shadow-xl shadow-teal-900/5 sm:p-6"
        >
          {!isPatient ? (
            <p className="text-sm leading-relaxed text-stone-600">
              {t.findClinic.mapSignInHint}
            </p>
          ) : detailLoading ? (
            <p className="text-sm text-stone-600">{t.findClinic.loading}</p>
          ) : detailError ? (
            <p className="text-sm text-rose-700">{detailError}</p>
          ) : detail ? (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-stone-900">
                {t.findClinic.mapTitle}: {detail.name}
              </h3>
              <ClinicMapPanel
                name={detail.name}
                latitude={parseCoord(detail.latitude)}
                longitude={parseCoord(detail.longitude)}
                noCoordsLabel={t.findClinic.noCoords}
              />
              <motion.button
                type="button"
                disabled={recording}
                whileTap={{ scale: 0.98 }}
                onClick={() => void recordVisit()}
                className="w-full rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/25 disabled:opacity-60"
              >
                {recording ? t.findClinic.recording : t.findClinic.recordVisit}
              </motion.button>
              {recordMsg && (
                <p
                  className={`text-center text-sm ${
                    recordOk ? 'text-teal-800' : 'text-rose-700'
                  }`}
                >
                  {recordMsg}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-stone-600">{t.findClinic.selectHint}</p>
          )}
        </motion.div>
      )}
    </div>
  )
}
