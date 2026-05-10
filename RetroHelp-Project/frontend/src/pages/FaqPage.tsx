import { AnimatePresence, motion } from 'framer-motion'
import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

const FAQ_ICONS = ['✶', '🔐', '🏥', '🔎', '✓', '📋', '✨', '👥', '🔒', '📧']

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
}

export function FaqPage() {
  const { t } = useLanguage()
  const [openIdx, setOpenIdx] = useState<number | null>(0)
  const [query, setQuery] = useState('')

  useEffect(() => {
    document.title = `${t.footer.faq} · ${t.brand}`
  }, [t.brand, t.footer.faq])

  const itemsWithIcons = useMemo(
    () =>
      t.faqPage.items.map((item, idx) => ({
        ...item,
        icon: FAQ_ICONS[idx] ?? '•',
      })),
    [t.faqPage.items],
  )

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return itemsWithIcons
    return itemsWithIcons.filter(
      (item) =>
        item.q.toLowerCase().includes(q) || item.a.toLowerCase().includes(q),
    )
  }, [itemsWithIcons, query])

  useEffect(() => {
    setOpenIdx(null)
  }, [query])

  return (
    <section className="relative overflow-hidden pb-16" aria-labelledby="faq-main-heading">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute inset-x-0 top-0 h-72 bg-gradient-to-b from-orange-100/80 via-teal-50/50 to-transparent" />
        <div className="absolute -right-24 top-20 h-72 w-72 rounded-full bg-teal-200/25 blur-3xl" />
        <div className="absolute -left-16 top-40 h-56 w-56 rounded-full bg-orange-200/30 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2314b8a6' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 sm:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2rem] border border-orange-100/90 bg-gradient-to-br from-white via-white to-orange-50/40 p-8 shadow-2xl shadow-teal-900/10 sm:p-10"
        >
          <div className="absolute right-6 top-6 hidden text-6xl opacity-[0.12] sm:block" aria-hidden>
            ✶
          </div>
          <p className="inline-flex rounded-full bg-gradient-to-r from-orange-100 to-teal-100 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-800">
            {t.brand}
          </p>
          <h1
            id="faq-main-heading"
            className="mt-5 bg-gradient-to-r from-stone-900 via-teal-900 to-stone-800 bg-clip-text text-3xl font-bold text-transparent sm:text-5xl"
          >
            {t.footer.faq}
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone-600">{t.footer.faqLead}</p>
          <p className="mt-3 text-sm font-medium text-teal-800">{t.home.modalFootnote}</p>
        </motion.div>

        <div className="mt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-teal-800">
                {t.faqPage.sectionLabel}
              </p>
              <p className="mt-1 text-sm text-stone-500">{t.faqPage.tapHint}</p>
            </div>
            <label className="sr-only" htmlFor="faq-search">
              {t.faqPage.searchPlaceholder}
            </label>
            <input
              id="faq-search"
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t.faqPage.searchPlaceholder}
              autoComplete="off"
              className="w-full rounded-2xl border border-orange-100 bg-white px-4 py-3 text-sm text-stone-900 shadow-inner outline-none ring-teal-500/20 placeholder:text-stone-400 focus:ring-2 sm:max-w-xs"
            />
          </div>

          {filteredItems.length === 0 ? (
            <p
              className="mt-8 rounded-3xl border border-dashed border-stone-200 bg-white/80 px-6 py-10 text-center text-stone-600"
              role="status"
            >
              {t.faqPage.noResults}
            </p>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="mt-6 space-y-3"
            >
              {filteredItems.map((item, idx) => {
                const isOpen = openIdx === idx
                const panelId = `faq-panel-${idx}`
                return (
                  <motion.div key={`${item.q}-${idx}`} variants={itemVariants}>
                    <div
                      className={`overflow-hidden rounded-3xl border transition-shadow duration-300 ${
                        isOpen
                          ? 'border-teal-300/80 bg-white shadow-lg shadow-teal-900/10 ring-2 ring-teal-500/15'
                          : 'border-teal-100/80 bg-white/90 shadow-md shadow-teal-900/5 hover:border-teal-200'
                      }`}
                    >
                      <button
                        type="button"
                        id={`faq-trigger-${idx}`}
                        aria-expanded={isOpen}
                        aria-controls={panelId}
                        onClick={() => setOpenIdx(isOpen ? null : idx)}
                        className="flex w-full items-start gap-4 p-5 text-left transition-colors hover:bg-teal-50/40 sm:p-6"
                      >
                        <span
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-orange-50 text-xl shadow-inner"
                          aria-hidden
                        >
                          {item.icon}
                        </span>
                        <span className="min-w-0 flex-1 pt-1">
                          <span className="block text-base font-semibold text-stone-900 sm:text-lg">{item.q}</span>
                        </span>
                        <motion.span
                          animate={{ rotate: isOpen ? 180 : 0 }}
                          className="mt-2 shrink-0 text-stone-400"
                          aria-hidden
                        >
                          ▼
                        </motion.span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen ? (
                          <motion.div
                            id={panelId}
                            role="region"
                            aria-labelledby={`faq-trigger-${idx}`}
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                            className="overflow-hidden"
                          >
                            <p className="border-t border-orange-50/90 px-5 pb-6 pl-[4.25rem] pr-12 text-sm leading-relaxed text-stone-600 sm:px-6 sm:pb-7 sm:text-base">
                              {item.a}
                            </p>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-12 flex flex-col items-center gap-4 rounded-3xl border border-dashed border-teal-200/90 bg-gradient-to-r from-teal-50/80 via-white to-orange-50/80 p-8 text-center sm:flex-row sm:justify-center sm:gap-8"
        >
          <Link
            to="/customer-support"
            className="inline-flex items-center gap-2 rounded-full bg-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-teal-900/25 transition hover:bg-teal-700"
          >
            {t.footer.customerSupport} →
          </Link>
          <Link
            to="/about"
            className="inline-flex items-center gap-2 rounded-full border-2 border-teal-200 bg-white px-6 py-3 text-sm font-semibold text-teal-800 transition hover:border-teal-400"
          >
            {t.footer.aboutUs} →
          </Link>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 rounded-3xl border border-amber-200/90 bg-gradient-to-br from-amber-50 to-orange-50/90 p-6 shadow-inner sm:p-8"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <span className="text-4xl" aria-hidden>
              ⚠️
            </span>
            <div>
              <h2 className="text-lg font-semibold text-amber-950">{t.footer.emergencyTitle}</h2>
              <p className="mt-2 leading-relaxed text-amber-950/85">{t.footer.emergencyBody}</p>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  )
}
