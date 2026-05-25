import { motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { fadeUp, staggerContainer, staggerItem } from '../lib/motionPresets'
import { partitionResourceLibrary } from '../lib/resourceLibraryCategory'
import type { ResourceLibraryItem } from '../types/api'

type Tab = 'basics' | 'care'

type Props = {
  items: ResourceLibraryItem[]
  loading: boolean
  error: string | null
  labels: {
    title: string
    subtitle: string
    viewAll: string
    tabBasics: string
    tabCare: string
    emptyBasics: string
    emptyCare: string
    read: string
    loading: string
    featured: string
  }
  onOpenArticle: (item: ResourceLibraryItem) => void
}

function excerpt(text: string | null, max = 120): string {
  if (!text) return ''
  const t = text.replace(/\s+/g, ' ').trim()
  return t.length <= max ? t : `${t.slice(0, max).trim()}…`
}

export function HomeLibrarySection({
  items,
  loading,
  error,
  labels,
  onOpenArticle,
}: Props) {
  const { basics, care } = useMemo(() => partitionResourceLibrary(items), [items])
  const [tab, setTab] = useState<Tab>('basics')

  const activeItems = tab === 'basics' ? basics : care
  const featured = activeItems[0] ?? null
  const rest = activeItems.slice(1, 5)

  return (
    <section className="relative overflow-hidden rounded-[2rem] border border-teal-200/60 bg-gradient-to-br from-teal-950 via-teal-900 to-stone-900 text-white shadow-2xl shadow-teal-950/30">
      <div
        className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-orange-400/20 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 left-10 h-48 w-48 rounded-full bg-teal-300/15 blur-3xl"
        aria-hidden
      />

      <div className="relative px-5 py-8 sm:px-8 sm:py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-teal-200/90">📚 Library</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{labels.title}</h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-teal-100/85">{labels.subtitle}</p>
          </motion.div>
          <Link
            to="/library"
            className="inline-flex shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            {labels.viewAll} →
          </Link>
        </div>

        <div className="mt-6 flex gap-2">
          {(['basics', 'care'] as const).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setTab(key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                tab === key
                  ? 'bg-white text-teal-900 shadow-md'
                  : 'bg-white/10 text-teal-100 hover:bg-white/15'
              }`}
            >
              {key === 'basics' ? labels.tabBasics : labels.tabCare}
            </button>
          ))}
        </div>

        {error ? (
          <p className="mt-6 rounded-2xl border border-rose-300/40 bg-rose-500/20 px-4 py-3 text-sm text-rose-100">
            {error}
          </p>
        ) : null}

        {loading ? (
          <p className="mt-8 text-center text-sm text-teal-200/80">{labels.loading}</p>
        ) : activeItems.length === 0 ? (
          <p className="mt-8 rounded-2xl border border-dashed border-white/20 px-6 py-12 text-center text-sm text-teal-100/80">
            {tab === 'basics' ? labels.emptyBasics : labels.emptyCare}
          </p>
        ) : (
          <div className="mt-8 grid gap-4 lg:grid-cols-[1.15fr_0.85fr] lg:gap-5">
            {featured ? (
              <motion.button
                type="button"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                onClick={() => onOpenArticle(featured)}
                className="group flex min-h-[220px] flex-col rounded-3xl border border-white/15 bg-white/10 p-6 text-left backdrop-blur-md transition hover:border-orange-300/40 hover:bg-white/15 sm:min-h-[260px] sm:p-8"
              >
                <span className="text-[10px] font-bold uppercase tracking-widest text-orange-200/90">
                  {labels.featured}
                </span>
                <h3 className="mt-3 text-xl font-bold leading-snug sm:text-2xl">{featured.title}</h3>
                {featured.content ? (
                  <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-teal-50/90">
                    {excerpt(featured.content, 200)}
                  </p>
                ) : null}
                <span className="mt-auto pt-5 text-sm font-semibold text-orange-200 group-hover:text-white">
                  {labels.read} →
                </span>
              </motion.button>
            ) : null}

            <motion.ul
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-20px' }}
              className="flex flex-col gap-3"
            >
              {rest.map((item) => (
                <motion.li key={item.id} variants={staggerItem}>
                  <button
                    type="button"
                    onClick={() => onOpenArticle(item)}
                    className="group flex w-full items-start gap-3 rounded-2xl border border-white/10 bg-stone-950/25 px-4 py-3.5 text-left transition hover:border-teal-300/30 hover:bg-stone-950/40"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/30 text-lg">
                      📖
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block font-semibold text-white group-hover:text-teal-50">
                        {item.title}
                      </span>
                      {item.content ? (
                        <span className="mt-0.5 block line-clamp-2 text-xs text-teal-100/75">
                          {excerpt(item.content, 72)}
                        </span>
                      ) : null}
                    </span>
                    <span className="shrink-0 pt-1 text-teal-300/90 opacity-0 transition group-hover:opacity-100">
                      →
                    </span>
                  </button>
                </motion.li>
              ))}
            </motion.ul>
          </div>
        )}
      </div>
    </section>
  )
}
