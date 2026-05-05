import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useState } from 'react'
import { api, getApiErrorMessage } from '../api/client'
import { useAuth } from '../context/AuthContext'
import { isCommunityMember } from '../constants/roles'
import { useLanguage } from '../i18n/LanguageContext'
import type { ArtCenterDetail, ArtCenterSearchItem } from '../types/api'
import { ClinicMapPanel } from './ClinicMapPanel'

function parseCoord(v: string | number | null | undefined): number | null {
  if (v === null || v === undefined || v === '') return null
  const n = typeof v === 'number' ? v : Number.parseFloat(String(v))
  return Number.isFinite(n) ? n : null
}

function externalDirectionLinks(lat: number, lng: number) {
  const dest = `${lat},${lng}`
  return {
    google: `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`,
    apple: `https://maps.apple.com/?daddr=${encodeURIComponent(dest)}&dirflg=d`,
  }
}

export function ClinicSearchForm({
  initialCenterId = null,
}: {
  initialCenterId?: number | null
}) {
  const { t } = useLanguage()
  const { user, token } = useAuth()
  const [nameQuery, setNameQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [clinics, setClinics] = useState<ArtCenterSearchItem[]>([])
  const [selectedId, setSelectedId] = useState<number | null>(null)
  const [detail, setDetail] = useState<ArtCenterDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [detailError, setDetailError] = useState<string | null>(null)
  const [recording, setRecording] = useState(false)
  const [recordMsg, setRecordMsg] = useState<string | null>(null)
  const [recordOk, setRecordOk] = useState<boolean | null>(null)
  const [requestingBooking, setRequestingBooking] = useState(false)
  const [bookingMsg, setBookingMsg] = useState<string | null>(null)
  const [bookingOk, setBookingOk] = useState<boolean | null>(null)
  const [detailOpen, setDetailOpen] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [locating, setLocating] = useState(false)
  const [locationError, setLocationError] = useState<string | null>(null)

  const isPatient = user && token && isCommunityMember(user.role_id)

  const fetchClinicList = useCallback(
    async (clearSelection: boolean) => {
      if (clearSelection) {
        setSelectedId(null)
        setDetail(null)
      }
      setLoading(true)
      setError(null)
      try {
        const params = new URLSearchParams()
        params.set('limit', '150')
        if (nameQuery.trim()) params.set('q', nameQuery.trim())
        const { data } = await api.get<{ data: ArtCenterSearchItem[] }>(
          `/api/art-centers/search?${params.toString()}`,
        )
        setClinics(data.data)
      } catch (err) {
        setError(getApiErrorMessage(err))
        setClinics([])
      } finally {
        setLoading(false)
      }
    },
    [nameQuery],
  )

  useEffect(() => {
    void fetchClinicList(false)
    // Initial directory load only (filters start empty).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const search = (e: React.FormEvent) => {
    e.preventDefault()
    void fetchClinicList(true)
  }

  const openCenter = useCallback(
    async (id: number) => {
      setSelectedId(id)
      setDetailOpen(true)
      setDetail(null)
      setDetailError(null)
      setRecordMsg(null)
      setRecordOk(null)
      setBookingMsg(null)
      setBookingOk(null)
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
    },
    [isPatient],
  )

  useEffect(() => {
    if (initialCenterId == null) return
    void openCenter(initialCenterId)
  }, [initialCenterId, openCenter])

  useEffect(() => {
    if (!detailOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setDetailOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [detailOpen])

  const locateUser = () => {
    if (!navigator.geolocation) {
      setLocationError(t.findClinic.locationUnsupported)
      return
    }
    setLocating(true)
    setLocationError(null)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setLocating(false)
      },
      () => {
        setLocationError(t.findClinic.locationDenied)
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  const recordVisit = async () => {
    if (!selectedId || !isPatient) return
    setRecording(true)
    setRecordMsg(null)
    setRecordOk(null)
    try {
      await api.post('/api/navigations', {
        art_center_id: selectedId,
        start_location: null,
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

  const requestPillVisit = async () => {
    if (!selectedId || !isPatient) return
    setRequestingBooking(true)
    setBookingMsg(null)
    setBookingOk(null)
    setRecordMsg(null)
    setRecordOk(null)
    try {
      await api.post('/api/bookings', {
        art_center_id: selectedId,
        patient_note: null,
      })
      setBookingOk(true)
      setBookingMsg(t.findClinic.bookingRequested)
    } catch (err) {
      setBookingOk(false)
      setBookingMsg(getApiErrorMessage(err))
    } finally {
      setRequestingBooking(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-teal-100/80 bg-teal-50/40 px-5 py-4 sm:px-6">
        <h2 className="text-base font-bold text-stone-900 sm:text-lg">
          {t.findClinic.clinicsHeading}
        </h2>
        <p className="mt-1 text-sm leading-relaxed text-stone-600">
          {t.findClinic.clinicsSub}
        </p>
      </div>

      <form onSubmit={search} className="flex flex-col gap-4 sm:flex-row sm:items-end">
        <label className="min-w-0 flex-1 flex flex-col gap-1.5 text-sm font-medium text-stone-700">
          {t.findClinic.searchKeyword}
          <input
            value={nameQuery}
            onChange={(e) => setNameQuery(e.target.value)}
            placeholder={t.findClinic.searchKeywordPh}
            className="rounded-2xl border border-orange-100 bg-white px-4 py-3 text-stone-900 shadow-inner shadow-stone-900/5 outline-none ring-teal-500/25 focus:ring-2"
          />
        </label>
        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full shrink-0 rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/25 transition disabled:opacity-60 sm:w-auto"
        >
          {loading ? t.findClinic.loading : t.findClinic.submit}
        </motion.button>
      </form>

      {error && (
        <p className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </p>
      )}

      {loading && clinics.length === 0 ? (
        <p className="text-sm text-stone-600">{t.findClinic.loading}</p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2">
          {clinics.length === 0 ? (
            <li className="sm:col-span-2 rounded-3xl border border-dashed border-orange-200 bg-white/70 px-5 py-8 text-center text-sm text-stone-600">
              {t.findClinic.empty}
            </li>
          ) : (
            clinics.map((c, i) => (
              <motion.li
                key={c.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`rounded-3xl border bg-white p-5 shadow-lg shadow-teal-900/5 ${
                  selectedId === c.id
                    ? 'border-teal-400 ring-2 ring-teal-200'
                    : 'border-orange-100/90'
                }`}
              >
                <div className="mb-3 overflow-hidden rounded-2xl border border-orange-100/80 bg-orange-50/40">
                  {c.image ? (
                    <img
                      src={c.image}
                      alt={c.name}
                      className="h-24 w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="flex h-24 items-center justify-center bg-gradient-to-r from-teal-100 to-orange-100 text-2xl">
                      🏥
                    </div>
                  )}
                </div>
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
                    {c.completed_bookings_count ?? 0}
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

      <AnimatePresence>
      {selectedId !== null && detailOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/50 p-3 backdrop-blur-sm sm:items-center sm:p-6"
          onClick={() => setDetailOpen(false)}
        >
          <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          className="max-h-[92vh] w-full max-w-5xl overflow-y-auto rounded-3xl border border-orange-100/90 bg-white/95 p-5 shadow-2xl shadow-teal-900/20 sm:p-6"
          onClick={(e) => e.stopPropagation()}
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
              <div className="overflow-hidden rounded-2xl border border-orange-100/80 bg-orange-50/40">
                {detail.image ? (
                  <img
                    src={detail.image}
                    alt={detail.name}
                    className="h-40 w-full object-cover sm:h-48"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-40 items-center justify-center bg-gradient-to-r from-teal-100 to-orange-100 text-4xl sm:h-48">
                    🏥
                  </div>
                )}
              </div>
              <ClinicMapPanel
                name={detail.name}
                latitude={parseCoord(detail.latitude)}
                longitude={parseCoord(detail.longitude)}
                noCoordsLabel={t.findClinic.noCoords}
                userLatitude={userLocation?.lat ?? null}
                userLongitude={userLocation?.lng ?? null}
              />
              <div className="rounded-2xl border border-teal-100/90 bg-teal-50/45 p-3">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm font-semibold text-teal-950">{t.findClinic.siteDirectionsTitle}</p>
                  <button
                    type="button"
                    onClick={locateUser}
                    disabled={locating}
                    className="rounded-xl border border-teal-200 bg-white px-3 py-2 text-xs font-semibold text-teal-900 transition hover:bg-teal-50 disabled:opacity-60"
                  >
                    {locating ? t.findClinic.locating : t.findClinic.useMyLocation}
                  </button>
                </div>
                <p className="mt-2 text-xs text-stone-600">{t.findClinic.siteDirectionsHint}</p>
                {locationError ? <p className="mt-2 text-xs text-rose-700">{locationError}</p> : null}
              </div>
              {(() => {
                const lat = parseCoord(detail.latitude)
                const lng = parseCoord(detail.longitude)
                if (lat === null || lng === null) return null
                const { google, apple } = externalDirectionLinks(lat, lng)
                return (
                  <div className="rounded-2xl border border-teal-100/90 bg-teal-50/50 p-4">
                    <p className="text-sm font-semibold text-teal-950">
                      {t.findClinic.directionsIntro}
                    </p>
                    <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                      <a
                        href={google}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex flex-1 items-center justify-center rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-teal-900 shadow-sm ring-1 ring-teal-200/80 transition hover:bg-teal-50"
                      >
                        {t.findClinic.openGoogleMaps}
                      </a>
                      <a
                        href={apple}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex flex-1 items-center justify-center rounded-2xl border border-teal-200 bg-white/90 px-4 py-3 text-sm font-semibold text-teal-900 transition hover:bg-teal-50/80"
                      >
                        {t.findClinic.openAppleMaps}
                      </a>
                    </div>
                  </div>
                )
              })()}
              <p className="text-sm font-medium text-stone-800">
                {t.findClinic.actionsIntro}
              </p>
              <motion.button
                type="button"
                disabled={requestingBooking}
                whileTap={{ scale: 0.98 }}
                onClick={() => void requestPillVisit()}
                className="w-full rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/25 disabled:opacity-60"
              >
                {requestingBooking
                  ? t.findClinic.requestingBooking
                  : t.findClinic.requestPillVisit}
              </motion.button>
              <p className="text-xs leading-relaxed text-stone-600">
                {t.findClinic.requestPillVisitHelp}
              </p>
              <motion.button
                type="button"
                disabled={recording}
                whileTap={{ scale: 0.98 }}
                onClick={() => void recordVisit()}
                className="w-full rounded-2xl border-2 border-orange-200/90 bg-white py-3 text-sm font-semibold text-teal-900 shadow-sm transition hover:bg-orange-50/80 disabled:opacity-60"
              >
                {recording ? t.findClinic.recording : t.findClinic.recordVisit}
              </motion.button>
              <p className="text-xs leading-relaxed text-stone-500">
                {t.findClinic.recordVisitHelp}
              </p>
              {bookingMsg && (
                <p
                  className={`text-center text-sm ${
                    bookingOk ? 'text-teal-800' : 'text-rose-700'
                  }`}
                >
                  {bookingMsg}
                </p>
              )}
              {recordMsg && (
                <p
                  className={`text-center text-sm ${
                    recordOk ? 'text-teal-800' : 'text-rose-700'
                  }`}
                >
                  {recordMsg}
                </p>
              )}
              <button
                type="button"
                onClick={() => setDetailOpen(false)}
                className="w-full rounded-2xl border border-stone-200 bg-stone-50 py-2.5 text-sm font-semibold text-stone-700 transition hover:bg-stone-100"
              >
                {t.home.closeArticle}
              </button>
            </div>
          ) : (
            <p className="text-sm text-stone-600">{t.findClinic.selectHint}</p>
          )}
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>
    </div>
  )
}
