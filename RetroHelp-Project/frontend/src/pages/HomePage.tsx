import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, getApiErrorMessage } from '../api/client'
import { AnimatedClinicMascot, AnimatedLibraryMascot } from '../components/AnimatedSectionMascots'
import { BookingStatusMascot } from '../components/BookingStatusMascot'
import { useSupportOpener } from '../context/SupportOpenerContext'
import { useLanguage } from '../i18n/LanguageContext'
import {
  easeSoft,
  fade,
  fadeUp,
  glassPanel,
  glassPanelStrong,
  staggerContainer,
  staggerItem,
} from '../lib/motionPresets'
import { partitionResourceLibrary } from '../lib/resourceLibraryCategory'
import type { HomeOverviewStats, ResourceLibraryItem, TopRankedClinic } from '../types/api'

function formatRating(avg: string | number | null | undefined): string {
  if (avg === null || avg === undefined || avg === '') return '—'
  const n = typeof avg === 'number' ? avg : Number.parseFloat(String(avg))
  if (!Number.isFinite(n)) return '—'
  return n.toFixed(1)
}

function formatCount(value: number | null): string {
  if (value === null) return '...'
  return new Intl.NumberFormat().format(value)
}

export function HomePage() {
  const { t } = useLanguage()
  const { requestOpen } = useSupportOpener()
  const [clinics, setClinics] = useState<TopRankedClinic[] | null>(null)
  const [clinicsError, setClinicsError] = useState<string | null>(null)
  const [library, setLibrary] = useState<ResourceLibraryItem[] | null>(null)
  const [libraryError, setLibraryError] = useState<string | null>(null)
  const [article, setArticle] = useState<ResourceLibraryItem | null>(null)
  const [overview, setOverview] = useState<HomeOverviewStats | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await api.get<{ data: TopRankedClinic[] }>(
          '/api/art-centers/top-ranked?limit=3',
        )
        if (!cancelled) {
          const rows = Array.isArray(data?.data) ? data.data : []
          setClinics(rows)
          setClinicsError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setClinicsError(getApiErrorMessage(e))
          setClinics([])
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await api.get<{ data: HomeOverviewStats }>('/api/overview/public')
        if (!cancelled && data?.data) setOverview(data.data)
      } catch {
        if (!cancelled) setOverview(null)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await api.get<{ data: ResourceLibraryItem[] }>(
          '/api/resource-libraries',
        )
        if (!cancelled) {
          const rows = Array.isArray(data?.data) ? data.data : []
          setLibrary(rows)
          setLibraryError(null)
        }
      } catch (e) {
        if (!cancelled) {
          setLibraryError(getApiErrorMessage(e))
          setLibrary([])
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const { basics, care, other } = useMemo(
    () => partitionResourceLibrary(library ?? []),
    [library],
  )

  const onKeyModal = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') setArticle(null)
  }, [])

  useEffect(() => {
    if (!article) return
    window.addEventListener('keydown', onKeyModal)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKeyModal)
      document.body.style.overflow = prev
    }
  }, [article, onKeyModal])

  return (
    <div className="bg-stone-50">
      {/* Cinematic hero — full viewport, soft blend into scroll */}
      <section className="relative isolate flex min-h-[92svh] flex-col overflow-hidden">
        <motion.div
          variants={fade}
          initial="hidden"
          animate="visible"
          className="absolute inset-0 bg-gradient-to-br from-teal-800 via-teal-900 to-stone-950"
        />
        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: easeSoft }}
          className="absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(45,212,191,0.35),transparent_55%)]"
        />
        <div className="absolute -left-32 top-20 h-96 w-96 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="absolute -right-24 bottom-32 h-[28rem] w-[28rem] rounded-full bg-teal-400/15 blur-3xl" />

        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[min(52vh,28rem)] bg-gradient-to-b from-transparent via-stone-50/65 to-stone-50" />

        <div className="relative z-[3] mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-8 px-4 pb-28 pt-16 sm:px-6 sm:pb-36 sm:pt-20 lg:pt-24">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="flex max-w-4xl flex-col gap-6"
          >
            <motion.p
              variants={staggerItem}
              className="text-sm font-semibold uppercase tracking-[0.22em] text-orange-100/95"
            >
              {t.home.eyebrow}
            </motion.p>
            <motion.div variants={staggerItem} className="space-y-4">
              <h1 className="font-sans text-4xl font-extrabold leading-[1.06] tracking-tight text-white sm:text-5xl lg:text-6xl">
                {t.home.title}
              </h1>
              <p className="font-sans text-2xl font-semibold leading-snug text-teal-50/95 sm:text-3xl">
                {t.home.titleMy}
              </p>
            </motion.div>
            <motion.p
              variants={staggerItem}
              className="max-w-2xl text-lg leading-relaxed text-teal-50/90 sm:text-xl"
            >
              {t.home.subtitle}
            </motion.p>
            <motion.div
              variants={staggerItem}
              className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center"
            >
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
                <Link
                  to="/find-clinic"
                  className="inline-flex rounded-full bg-white px-8 py-4 text-base font-bold text-teal-800 shadow-xl shadow-stone-900/35"
                >
                  {t.home.cta}
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <button
                  type="button"
                  onClick={() => requestOpen()}
                  className="inline-flex w-full justify-center rounded-full border-2 border-white/70 bg-white/10 px-8 py-4 text-base font-bold text-white shadow-inner shadow-black/20 backdrop-blur-md sm:w-auto"
                >
                  {t.home.ctaSupport}
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Scroll — overlaps hero fade for continuous cinematic handoff */}
      <div className="relative z-[4] -mt-24 sm:-mt-28">
        <section className="mx-auto max-w-6xl px-4 pb-16 pt-4 sm:px-6 sm:pb-20">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
            className="mt-10"
          >
            <motion.h2
              variants={staggerItem}
              className="text-center text-2xl font-extrabold text-stone-900 sm:text-3xl"
            >
              {t.home.confidenceTitle}
            </motion.h2>
            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <motion.article
                variants={staggerItem}
                className={`${glassPanel} p-8 lg:p-9`}
              >
                <div className="mb-4 flex items-center justify-between gap-3">
                  <BookingStatusMascot status="accepted" size={62} aria-label={t.home.usersCountLabel} />
                  <p className="text-3xl font-extrabold text-stone-900 tabular-nums">
                    {formatCount(overview?.users_count ?? null)}
                  </p>
                </div>
                <h3 className="text-lg font-bold text-stone-900">{t.home.usersCountLabel}</h3>
              </motion.article>
              <motion.article variants={staggerItem} className={`${glassPanel} p-8 lg:p-9`}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <AnimatedLibraryMascot className="h-16 w-16" />
                  <p className="text-3xl font-extrabold text-stone-900 tabular-nums">
                    {formatCount(overview?.pill_given_count ?? null)}
                  </p>
                </div>
                <h3 className="text-lg font-bold text-stone-900">{t.home.pillsCountLabel}</h3>
              </motion.article>
              <motion.article variants={staggerItem} className={`${glassPanel} p-8 lg:p-9`}>
                <div className="mb-4 flex items-center justify-between gap-3">
                  <AnimatedClinicMascot className="h-16 w-16" />
                  <p className="text-3xl font-extrabold text-stone-900 tabular-nums">
                    {formatCount(overview?.clinics_count ?? null)}
                  </p>
                </div>
                <h3 className="text-lg font-bold text-stone-900">{t.home.clinicsCountLabel}</h3>
              </motion.article>
            </div>
          </motion.div>
        </section>

        <section className="border-y border-white/40 bg-gradient-to-b from-white/50 to-stone-50/80 py-16 backdrop-blur-md">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="mb-10 flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                className="max-w-2xl"
              >
                <h2 className="text-2xl font-extrabold text-stone-900 sm:text-3xl">
                  {t.home.topClinicsTitle}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
                  {t.home.topClinicsSub}
                </p>
              </motion.div>
              <motion.div
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-40px' }}
                className="mx-auto shrink-0 sm:mx-0"
              >
                <AnimatedClinicMascot className="h-28 w-28 sm:h-32 sm:w-32" />
              </motion.div>
            </div>

            {clinicsError && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 rounded-[1.75rem] border border-rose-200/60 bg-rose-50/80 px-5 py-3 text-sm text-rose-800 backdrop-blur-md"
              >
                {clinicsError}
              </motion.p>
            )}

            {clinics == null ? (
              <p className="text-sm text-stone-600">{t.home.clinicsLoading}</p>
            ) : clinics.length === 0 ? (
              <p
                className={`rounded-[2rem] border border-dashed border-orange-200/80 px-6 py-12 text-center text-sm text-stone-600 ${glassPanel}`}
              >
                {t.home.clinicsEmpty}
              </p>
            ) : (
              <motion.div
                variants={staggerContainer}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: '-24px' }}
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-12"
              >
                {clinics.map((c, i) => (
                  <motion.article
                    key={c.id}
                    variants={staggerItem}
                    className={`${glassPanel} flex flex-col p-5 sm:p-6 ${
                      i === 0
                        ? 'sm:col-span-2 lg:col-span-7'
                        : i === 1 || i === 2
                          ? 'lg:col-span-5'
                          : 'lg:col-span-4'
                    }`}
                  >
                    <div className="mb-4 overflow-hidden rounded-2xl border border-orange-100/70 bg-orange-50/50">
                      {c.image ? (
                        <img
                          src={c.image}
                          alt={c.name}
                          className={`w-full object-cover ${
                            i === 0 ? 'h-40 sm:h-44' : 'h-24 sm:h-28'
                          }`}
                          loading="lazy"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const fallback = e.currentTarget.nextElementSibling as HTMLDivElement | null
                            if (fallback) fallback.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      <div
                        className={`${
                          c.image ? 'hidden' : 'flex'
                        } w-full items-center justify-center bg-gradient-to-r from-teal-100 to-orange-100 ${
                          i === 0 ? 'h-40 sm:h-44' : 'h-24 sm:h-28'
                        }`}
                      >
                        <div className="rounded-2xl border border-white/70 bg-white/70 px-4 py-2 text-center backdrop-blur">
                          <p className="text-xl">🏥</p>
                          <p className="text-xs font-semibold text-stone-700">Clinic image unavailable</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className={`${i === 0 ? 'text-xl sm:text-2xl' : 'text-lg'} font-bold text-stone-900`}>
                        {c.name}
                      </h3>
                      {c.is_verified && (
                        <span className="shrink-0 rounded-full bg-teal-500/20 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-teal-900 backdrop-blur-sm">
                          {t.findClinic.verified}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-stone-600">
                      {[c.township, c.area].filter(Boolean).join(' · ') || '—'}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <span className="rounded-full bg-stone-100 px-2.5 py-1 text-[11px] font-semibold text-stone-700">
                        ID: #{c.id}
                      </span>
                      {c.nickname ? (
                        <span className="rounded-full bg-teal-100 px-2.5 py-1 text-[11px] font-semibold text-teal-800">
                          @{c.nickname}
                        </span>
                      ) : null}
                      <span className="rounded-full bg-orange-100 px-2.5 py-1 text-[11px] font-semibold text-orange-900">
                        Visits: {c.booking_pill_given_count ?? 0}
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-stone-700">
                      <span className="text-amber-500" aria-hidden>
                        ★
                      </span>{' '}
                      <span className="font-bold text-stone-900">{formatRating(c.rating_avg)}</span>
                      {c.total_reviews != null && c.total_reviews > 0 ? (
                        <span className="text-stone-500">
                          {' '}
                          · {c.total_reviews} {t.home.reviewsLabel}
                        </span>
                      ) : null}
                    </p>
                    <div className="pt-3">
                      <Link
                        to={`/find-clinic?center=${c.id}`}
                        className={`flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 ${
                          i === 0 ? 'py-3.5 text-base' : 'py-3 text-sm'
                        } font-semibold text-white shadow-lg shadow-teal-900/30`}
                      >
                        {t.home.viewDirections}
                      </Link>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* Library — bento grid, visually continuous from clinics */}
        <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <div className="mb-12 flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="max-w-2xl"
            >
              <h2 className="text-2xl font-extrabold text-stone-900 sm:text-3xl">
                {t.home.homeLibraryTitle}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
                {t.home.homeLibrarySub}
              </p>
            </motion.div>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="mx-auto shrink-0 sm:mx-0"
            >
              <AnimatedLibraryMascot className="h-28 w-28 sm:h-32 sm:w-32" />
            </motion.div>
          </div>

          {libraryError && (
            <p className="mb-6 rounded-[1.75rem] border border-rose-200/60 bg-rose-50/80 px-5 py-3 text-sm text-rose-800 backdrop-blur-md">
              {libraryError}
            </p>
          )}

          {library == null ? (
            <p className={`px-6 py-12 text-center text-stone-600 ${glassPanel}`}>
              {t.library.loading}
            </p>
          ) : (
            <div className="space-y-16">
              <LibraryBento
                title={t.library.basics}
                items={basics}
                empty={t.library.emptyBasics}
                onOpen={setArticle}
                readLabel={t.home.readArticle}
              />
              <LibraryBento
                title={t.library.care}
                items={care}
                empty={t.library.emptyCare}
                onOpen={setArticle}
                readLabel={t.home.readArticle}
              />
              {other.length > 0 ? (
                <LibraryBento
                  title={t.library.other}
                  items={other}
                  empty={t.library.emptyOther}
                  onOpen={setArticle}
                  readLabel={t.home.readArticle}
                />
              ) : null}
            </div>
          )}
        </section>
      </div>

      <AnimatePresence>
        {article && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-article-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35, ease: easeSoft }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-stone-950/55 p-4 backdrop-blur-sm sm:items-center"
            onClick={() => setArticle(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 28, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ type: 'spring', damping: 30, stiffness: 320 }}
              className={`max-h-[min(88vh,40rem)] w-full max-w-lg overflow-hidden ${glassPanelStrong} shadow-2xl shadow-teal-900/25`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-h-[min(88vh,40rem)] overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
                <p className="text-xs font-bold uppercase tracking-wide text-teal-800/90">
                  {article.category ?? ''}
                </p>
                <h3
                  id="home-article-title"
                  className="mt-2 text-xl font-bold text-stone-900 sm:text-2xl"
                >
                  {article.title}
                </h3>
                {article.content ? (
                  <p className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-stone-600">
                    {article.content}
                  </p>
                ) : null}
                <p className="mt-6 text-xs leading-relaxed text-stone-500">{t.home.modalFootnote}</p>
                <button
                  type="button"
                  onClick={() => setArticle(null)}
                  className="mt-6 w-full rounded-2xl border border-stone-200/80 bg-white/50 py-3 text-sm font-semibold text-stone-800 backdrop-blur-sm transition hover:bg-white/80"
                >
                  {t.home.closeArticle}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function LibraryBento({
  title,
  items,
  empty,
  onOpen,
  readLabel,
}: {
  title: string
  items: ResourceLibraryItem[]
  empty: string
  onOpen: (item: ResourceLibraryItem) => void
  readLabel: string
}) {
  if (items.length === 0) {
    return (
      <div>
        <h3 className="mb-5 text-xl font-bold text-teal-900">{title}</h3>
        <p className={`rounded-[2rem] border border-dashed border-orange-200/80 px-6 py-10 text-center text-sm text-stone-600 ${glassPanel}`}>
          {empty}
        </p>
      </div>
    )
  }

  return (
    <div>
      <motion.h3
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="mb-5 text-xl font-bold text-teal-900"
      >
        {title}
      </motion.h3>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-30px' }}
        className="grid auto-rows-fr grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-5"
      >
        {items.map((item, i) => {
          const featured = i === 0 && items.length > 1
          return (
            <motion.button
              key={item.id}
              type="button"
              variants={staggerItem}
              onClick={() => onOpen(item)}
              className={`${glassPanel} flex flex-col p-5 text-left transition hover:border-teal-200/60 hover:shadow-xl sm:p-6 ${
                featured ? 'col-span-2 min-h-[12rem] sm:min-h-[14rem]' : 'col-span-1'
              }`}
            >
              <h4
                className={`font-bold text-stone-900 ${featured ? 'text-lg sm:text-xl' : 'text-base'}`}
              >
                {item.title}
              </h4>
              {item.content ? (
                <p
                  className={`mt-2 text-sm leading-relaxed text-stone-600 ${featured ? 'line-clamp-5 sm:line-clamp-7' : 'line-clamp-3'}`}
                >
                  {item.content}
                </p>
              ) : null}
              <span className="mt-auto pt-4 text-sm font-semibold text-teal-800">
                {readLabel} →
              </span>
            </motion.button>
          )
        })}
      </motion.div>
    </div>
  )
}
