import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { fadeUp, staggerContainer, staggerItem } from '../lib/motionPresets'
import type { ClinicReviewItem } from '../types/api'

function Stars({ rating }: { rating: number }) {
  return (
    <span className="inline-flex gap-0.5" aria-label={`${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={n <= rating ? 'text-amber-400' : 'text-stone-300'}
          aria-hidden
        >
          ★
        </span>
      ))}
    </span>
  )
}

function formatWhen(iso: string | null): string {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

type Props = {
  reviews: ClinicReviewItem[] | null
  error: string | null
  labels: {
    title: string
    subtitle: string
    empty: string
    loading: string
    findClinic: string
    anonymousNote: string
  }
}

export function HomeClinicReviewsSection({ reviews, error, labels }: Props) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
      <motion.div
        variants={fadeUp}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-40px' }}
        className="mb-8 max-w-2xl"
      >
        <h2 className="text-2xl font-extrabold text-stone-900 sm:text-3xl">{labels.title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">{labels.subtitle}</p>
        <p className="mt-2 text-xs text-stone-500">{labels.anonymousNote}</p>
      </motion.div>

      {error ? (
        <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800">
          {error}
        </p>
      ) : null}

      {reviews == null ? (
        <p className="text-sm text-stone-600">{labels.loading}</p>
      ) : reviews.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-orange-200 bg-orange-50/50 px-6 py-12 text-center">
          <p className="text-sm text-stone-600">{labels.empty}</p>
          <Link
            to="/find-clinic"
            className="mt-4 inline-flex rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-teal-700"
          >
            {labels.findClinic}
          </Link>
        </div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-24px' }}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
        >
          {reviews.map((r) => (
            <motion.article
              key={r.id}
              variants={staggerItem}
              className="flex flex-col rounded-3xl border border-orange-100/90 bg-white p-5 shadow-md shadow-teal-900/5"
            >
              <div className="flex items-start justify-between gap-2">
                <Stars rating={r.rating} />
                {r.created_at ? (
                  <time className="shrink-0 text-[11px] text-stone-400" dateTime={r.created_at}>
                    {formatWhen(r.created_at)}
                  </time>
                ) : null}
              </div>
              {r.comment ? (
                <p className="mt-3 flex-1 text-sm leading-relaxed text-stone-700">
                  &ldquo;{r.comment}&rdquo;
                </p>
              ) : (
                <p className="mt-3 flex-1 text-sm italic text-stone-500">—</p>
              )}
              <div className="mt-4 border-t border-orange-50 pt-3">
                <p className="text-xs font-semibold text-stone-500">{r.author_label}</p>
                {r.clinic ? (
                  <Link
                    to={`/find-clinic?center=${r.clinic.id}`}
                    className="mt-1 block text-sm font-bold text-teal-800 hover:text-teal-950 hover:underline"
                  >
                    {r.clinic.name}
                    {r.clinic.township || r.clinic.area
                      ? ` · ${[r.clinic.township, r.clinic.area].filter(Boolean).join(', ')}`
                      : ''}
                  </Link>
                ) : null}
              </div>
            </motion.article>
          ))}
        </motion.div>
      )}
    </section>
  )
}
