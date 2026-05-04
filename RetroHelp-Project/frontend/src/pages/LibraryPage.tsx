import { motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { api, getApiErrorMessage } from '../api/client'
import { AnimatedLibraryMascot } from '../components/AnimatedSectionMascots'
import { partitionResourceLibrary } from '../lib/resourceLibraryCategory'
import { useLanguage } from '../i18n/LanguageContext'
import type { TranslationTree } from '../i18n/translations'
import type { ResourceLibraryItem } from '../types/api'

export function LibraryPage() {
  const { t } = useLanguage()
  const [items, setItems] = useState<ResourceLibraryItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      try {
        const { data } = await api.get<{ data: ResourceLibraryItem[] }>(
          '/api/resource-libraries',
        )
        if (!cancelled) {
          setItems(Array.isArray(data?.data) ? data.data : [])
        }
      } catch (e) {
        if (!cancelled) {
          setError(getApiErrorMessage(e))
          setItems([])
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [])

  const { basics, care, other } = useMemo(
    () => partitionResourceLibrary(items ?? []),
    [items],
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <div className="mb-10 flex flex-col items-start gap-6 sm:mb-12 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
            {t.library.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-stone-600 sm:text-lg">
            {t.library.description}
          </p>
        </motion.div>
        <AnimatedLibraryMascot className="mx-auto h-32 w-32 sm:mx-0 sm:h-36 sm:w-36" />
      </div>

      {error && (
        <p className="mb-6 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </p>
      )}

      {items == null ? (
        <p className="rounded-3xl border border-orange-100 bg-white px-6 py-10 text-center text-stone-600">
          {t.library.loading}
        </p>
      ) : (
        <div className="space-y-14">
          <section>
            <h2 className="mb-5 text-xl font-bold text-teal-900 sm:text-2xl">
              {t.library.basics}
            </h2>
            {basics.length === 0 ? (
              <p className="rounded-3xl border border-dashed border-orange-200 bg-white/70 px-5 py-8 text-center text-sm text-stone-600">
                {t.library.emptyBasics}
              </p>
            ) : (
              <ul className="grid gap-5 sm:grid-cols-2">
                {basics.map((item, i) => (
                  <ResourceCard key={item.id} item={item} index={i} t={t} />
                ))}
              </ul>
            )}
          </section>
          <section>
            <h2 className="mb-5 text-xl font-bold text-teal-900 sm:text-2xl">
              {t.library.care}
            </h2>
            {care.length === 0 ? (
              <p className="rounded-3xl border border-dashed border-orange-200 bg-white/70 px-5 py-8 text-center text-sm text-stone-600">
                {t.library.emptyCare}
              </p>
            ) : (
              <ul className="grid gap-5 sm:grid-cols-2">
                {care.map((item, i) => (
                  <ResourceCard key={item.id} item={item} index={i} t={t} />
                ))}
              </ul>
            )}
          </section>
          {other.length > 0 ? (
            <section>
              <h2 className="mb-5 text-xl font-bold text-teal-900 sm:text-2xl">
                {t.library.other}
              </h2>
              <ul className="grid gap-5 sm:grid-cols-2">
                {other.map((item, i) => (
                  <ResourceCard key={item.id} item={item} index={i} t={t} />
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}
    </div>
  )
}

function ResourceCard({
  item,
  index,
  t,
}: {
  item: ResourceLibraryItem
  index: number
  t: TranslationTree
}) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-24px' }}
      transition={{ delay: index * 0.05 }}
      className="flex flex-col rounded-3xl border border-orange-100/90 bg-white p-6 shadow-lg shadow-teal-900/5"
    >
      <h3 className="text-lg font-bold text-stone-900">{item.title}</h3>
      {item.content && (
        <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-600">
          {item.content}
        </p>
      )}
      <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-teal-700/90">
        {t.library.readTime}
      </p>
    </motion.li>
  )
}
