import { AnimatePresence, motion } from 'framer-motion'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { api, getApiErrorMessage } from '../api/client'
import { AwaitingReceiptSection } from '../components/AwaitingReceiptSection'
import { useSupportOpener } from '../context/SupportOpenerContext'
import { useLanguage } from '../i18n/LanguageContext'
import type { ResourceLibraryItem, TopRankedClinic } from '../types/api'

function formatRating(avg: string | number | null | undefined): string {
  if (avg === null || avg === undefined || avg === '') return '—'
  const n = typeof avg === 'number' ? avg : Number.parseFloat(String(avg))
  if (!Number.isFinite(n)) return '—'
  return n.toFixed(1)
}

export function HomePage() {
  const { t } = useLanguage()
  const { requestOpen } = useSupportOpener()
  const [clinics, setClinics] = useState<TopRankedClinic[] | null>(null)
  const [clinicsError, setClinicsError] = useState<string | null>(null)
  const [library, setLibrary] = useState<ResourceLibraryItem[] | null>(null)
  const [libraryError, setLibraryError] = useState<string | null>(null)
  const [article, setArticle] = useState<ResourceLibraryItem | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await api.get<{ data: TopRankedClinic[] }>(
          '/api/art-centers/top-ranked?limit=12',
        )
        if (!cancelled) {
          setClinics(data.data)
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
        const { data } = await api.get<{ data: ResourceLibraryItem[] }>(
          '/api/resource-libraries',
        )
        if (!cancelled) {
          setLibrary(data.data)
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

  const basics = useMemo(
    () => library?.filter((i) => i.category === 'Basics') ?? [],
    [library],
  )
  const care = useMemo(
    () => library?.filter((i) => i.category === 'Care') ?? [],
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

  const confidence = [
    {
      title: t.home.confidence1Title,
      body: t.home.confidence1Body,
      icon: '🔒',
    },
    {
      title: t.home.confidence2Title,
      body: t.home.confidence2Body,
      icon: '✓',
    },
    {
      title: t.home.confidence3Title,
      body: t.home.confidence3Body,
      icon: '☀️',
    },
  ] as const

  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 bg-gradient-to-br from-teal-700 via-teal-800 to-stone-900"
        />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-orange-300/25 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-teal-400/20 blur-3xl" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55 }}
            className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-100/95"
          >
            {t.home.eyebrow}
          </motion.p>
          <div className="space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.06 }}
              className="max-w-4xl font-sans text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
            >
              {t.home.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12 }}
              className="max-w-3xl font-sans text-2xl font-semibold leading-snug text-teal-50/95 sm:text-3xl"
            >
              {t.home.titleMy}
            </motion.p>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="max-w-2xl text-lg leading-relaxed text-teal-50/95 sm:text-xl"
          >
            {t.home.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center"
          >
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
              <Link
                to="/find-clinic"
                className="inline-flex rounded-full bg-white px-8 py-4 text-base font-bold text-teal-800 shadow-xl shadow-stone-900/30"
              >
                {t.home.cta}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <button
                type="button"
                onClick={() => requestOpen()}
                className="inline-flex w-full justify-center rounded-full border-2 border-white/80 bg-transparent px-8 py-4 text-base font-bold text-white shadow-inner shadow-black/10 backdrop-blur-sm sm:w-auto"
              >
                {t.home.ctaSupport}
              </button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <AwaitingReceiptSection />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          className="text-center text-2xl font-extrabold text-stone-900 sm:text-3xl"
        >
          {t.home.confidenceTitle}
        </motion.h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {confidence.map((card, i) => (
            <motion.article
              key={card.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-32px' }}
              transition={{ delay: i * 0.08 }}
              className="rounded-[1.75rem] border border-orange-100/90 bg-white/90 p-7 shadow-xl shadow-teal-900/5 backdrop-blur-sm"
            >
              <div className="mb-3 text-2xl">{card.icon}</div>
              <h3 className="text-lg font-bold text-stone-900">{card.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-stone-600">
                {card.body}
              </p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="border-y border-orange-100/80 bg-white/60 py-14 backdrop-blur-sm">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-8 max-w-2xl"
          >
            <h2 className="text-2xl font-extrabold text-stone-900 sm:text-3xl">
              {t.home.topClinicsTitle}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
              {t.home.topClinicsSub}
            </p>
          </motion.div>

          {clinicsError && (
            <p className="mb-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-800">
              {clinicsError}
            </p>
          )}

          {clinics === null ? (
            <p className="text-sm text-stone-600">{t.home.clinicsLoading}</p>
          ) : clinics.length === 0 ? (
            <p className="rounded-3xl border border-dashed border-orange-200 bg-white/80 px-5 py-10 text-center text-sm text-stone-600">
              {t.home.clinicsEmpty}
            </p>
          ) : (
            <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible lg:grid-cols-3">
              {clinics.map((c, i) => (
                <motion.article
                  key={c.id}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: Math.min(i * 0.05, 0.35) }}
                  className="w-[min(100%,22rem)] shrink-0 snap-center rounded-[1.75rem] border border-orange-100/90 bg-white p-6 shadow-xl shadow-teal-900/5 sm:w-auto"
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
                  <p className="mt-4 text-sm text-stone-700">
                    <span className="text-amber-500" aria-hidden>
                      ★
                    </span>{' '}
                    <span className="font-bold text-stone-900">
                      {formatRating(c.rating_avg)}
                    </span>
                    {c.total_reviews != null && c.total_reviews > 0 ? (
                      <span className="text-stone-500">
                        {' '}
                        · {c.total_reviews} {t.home.reviewsLabel}
                      </span>
                    ) : null}
                  </p>
                  <Link
                    to={`/find-clinic?center=${c.id}`}
                    className="mt-5 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-teal-600 to-teal-700 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/25"
                  >
                    {t.home.viewDirections}
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 max-w-2xl"
        >
          <h2 className="text-2xl font-extrabold text-stone-900 sm:text-3xl">
            {t.home.homeLibraryTitle}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">
            {t.home.homeLibrarySub}
          </p>
        </motion.div>

        {libraryError && (
          <p className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-800">
            {libraryError}
          </p>
        )}

        {library === null ? (
          <p className="rounded-3xl border border-orange-100 bg-white px-6 py-10 text-center text-stone-600">
            {t.library.loading}
          </p>
        ) : (
          <div className="space-y-12">
            <LibraryRow
              title={t.library.basics}
              items={basics}
              empty={t.library.emptyBasics}
              onOpen={setArticle}
              readLabel={t.home.readArticle}
            />
            <LibraryRow
              title={t.library.care}
              items={care}
              empty={t.library.emptyCare}
              onOpen={setArticle}
              readLabel={t.home.readArticle}
            />
          </div>
        )}
      </section>

      <AnimatePresence>
        {article && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="home-article-title"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-stone-900/60 p-4 sm:items-center"
            onClick={() => setArticle(null)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ type: 'spring', damping: 28, stiffness: 320 }}
              className="max-h-[min(88vh,40rem)] w-full max-w-lg overflow-hidden rounded-[1.75rem] border border-orange-100/90 bg-white shadow-2xl shadow-teal-900/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="max-h-[min(88vh,40rem)] overflow-y-auto px-6 py-6 sm:px-8 sm:py-8">
                <p className="text-xs font-bold uppercase tracking-wide text-teal-700/90">
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
                <p className="mt-6 text-xs leading-relaxed text-stone-500">
                  {t.home.modalFootnote}
                </p>
                <button
                  type="button"
                  onClick={() => setArticle(null)}
                  className="mt-6 w-full rounded-2xl border border-stone-200 py-3 text-sm font-semibold text-stone-800 transition hover:bg-stone-50"
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

function LibraryRow({
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
        <h3 className="mb-4 text-xl font-bold text-teal-900">{title}</h3>
        <p className="rounded-3xl border border-dashed border-orange-200 bg-white/80 px-5 py-8 text-center text-sm text-stone-600">
          {empty}
        </p>
      </div>
    )
  }

  return (
    <div>
      <h3 className="mb-4 text-xl font-bold text-teal-900">{title}</h3>
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible lg:grid-cols-3">
        {items.map((item, i) => (
          <motion.button
            key={item.id}
            type="button"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-20px' }}
            transition={{ delay: Math.min(i * 0.05, 0.25) }}
            onClick={() => onOpen(item)}
            className="w-[min(100%,20rem)] shrink-0 snap-start rounded-[1.75rem] border border-orange-100/90 bg-white p-6 text-left shadow-xl shadow-teal-900/5 transition hover:border-teal-200/90 hover:shadow-2xl sm:w-auto"
          >
            <h4 className="text-base font-bold text-stone-900">{item.title}</h4>
            {item.content ? (
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-stone-600">
                {item.content}
              </p>
            ) : null}
            <span className="mt-4 inline-block text-sm font-semibold text-teal-800">
              {readLabel} →
            </span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
