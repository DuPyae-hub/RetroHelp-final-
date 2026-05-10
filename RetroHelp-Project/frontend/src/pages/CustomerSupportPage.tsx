import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useSupportOpener } from '../context/SupportOpenerContext'
import { useLanguage } from '../i18n/LanguageContext'

export function CustomerSupportPage() {
  const { t } = useLanguage()
  const { requestOpen } = useSupportOpener()

  useEffect(() => {
    document.title = `${t.footer.customerSupport} · ${t.brand}`
  }, [t.brand, t.footer.customerSupport])

  const channels = [
    {
      emoji: '✨',
      title: t.support.aiTab,
      body: t.support.aiHint,
      chip: t.supportPage.aiCardBadge,
      highlight: true,
    },
    {
      emoji: '👋',
      title: t.support.liveTab,
      body: t.support.liveHint,
      chip: t.support.comingSoon,
      highlight: false,
    },
  ]

  const steps = [
    { n: '1', text: t.supportPage.stepOpen },
    { n: '2', text: t.supportPage.stepAsk },
    { n: '3', text: t.supportPage.stepReply },
  ]

  return (
    <section className="relative overflow-hidden pb-20" aria-labelledby="support-main-heading">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-br from-teal-100/90 via-orange-50/60 to-transparent" />
        <div className="absolute right-0 top-32 h-64 w-64 rounded-full bg-teal-300/20 blur-3xl" />
        <div className="absolute bottom-20 left-10 h-48 w-48 rounded-full bg-orange-200/25 blur-3xl" />
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 sm:pt-14">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-[2rem] border border-teal-100/90 bg-white p-8 shadow-2xl shadow-teal-900/15 sm:p-12"
        >
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gradient-to-br from-teal-400/30 to-orange-300/20 blur-2xl" />
          <p className="relative inline-flex rounded-full bg-teal-100 px-4 py-1 text-xs font-bold uppercase tracking-wider text-teal-900">
            {t.support.title}
          </p>
          <h1
            id="support-main-heading"
            className="relative mt-5 max-w-3xl text-4xl font-bold leading-tight text-stone-900 sm:text-5xl"
          >
            {t.footer.customerSupport}
          </h1>
          <p className="relative mt-5 max-w-2xl text-lg leading-relaxed text-stone-600">{t.footer.supportLead}</p>

          <div className="relative mt-8 rounded-2xl border border-stone-100 bg-stone-50/80 p-5 sm:p-6">
            <h2 className="text-sm font-bold uppercase tracking-wide text-stone-700">{t.supportPage.scopeTitle}</h2>
            <p className="mt-2 text-sm leading-relaxed text-stone-600 sm:text-base">{t.supportPage.scopeBody}</p>
          </div>

          <div className="relative mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => requestOpen()}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-teal-600 to-teal-700 px-8 py-4 text-base font-bold text-white shadow-xl shadow-teal-900/30 ring-4 ring-orange-100/80"
            >
              <span aria-hidden>💬</span>
              {t.home.ctaSupport}
            </motion.button>
            <Link
              to="/faq"
              className="inline-flex items-center justify-center rounded-full border-2 border-stone-200 bg-white px-8 py-4 text-base font-semibold text-stone-800 transition hover:border-teal-300 hover:bg-teal-50/50"
            >
              {t.footer.faq}
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="mt-12 rounded-[2rem] border border-orange-100/90 bg-white p-8 shadow-lg shadow-teal-900/5 sm:p-10"
        >
          <h2 className="text-lg font-bold text-stone-900">{t.supportPage.guidelinesTitle}</h2>
          <ul className="mt-5 space-y-3">
            {t.supportPage.guidelines.map((line) => (
              <li key={line} className="flex gap-3 text-sm leading-relaxed text-stone-600 sm:text-base">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-500" aria-hidden />
                <span>{line}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-xs leading-relaxed text-stone-500 sm:text-sm">{t.supportPage.privacyNote}</p>
        </motion.div>

        <p className="mt-10 text-center text-sm font-semibold uppercase tracking-widest text-teal-800">
          {t.supportPage.channelsIntro}
        </p>

        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mt-4 grid gap-4 sm:grid-cols-3"
        >
          {steps.map((step) => (
            <li
              key={step.n}
              className="flex gap-4 rounded-3xl border border-orange-100/90 bg-white/90 p-5 shadow-md shadow-teal-900/5"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-teal-50 text-lg font-black text-teal-800">
                {step.n}
              </span>
              <p className="pt-1 text-sm leading-relaxed text-stone-600">{step.text}</p>
            </li>
          ))}
        </motion.ul>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {channels.map((ch) => (
            <motion.article
              key={ch.title}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: ch.highlight ? 0.05 : 0.1 }}
              whileHover={{ y: -4 }}
              className={`relative overflow-hidden rounded-3xl border p-8 shadow-lg transition-shadow ${
                ch.highlight
                  ? 'border-teal-300/80 bg-gradient-to-br from-white via-teal-50/50 to-orange-50/40 shadow-teal-900/10 ring-2 ring-teal-500/10'
                  : 'border-teal-100/80 bg-white shadow-teal-900/5'
              }`}
            >
              <span className="absolute right-5 top-5 max-w-[10rem] rounded-full bg-stone-100 px-3 py-1 text-center text-[10px] font-bold uppercase leading-tight tracking-wide text-stone-600">
                {ch.chip}
              </span>
              <span className="text-4xl" aria-hidden>
                {ch.emoji}
              </span>
              <h2 className="mt-4 text-lg font-bold text-stone-900">{ch.title}</h2>
              <p className="mt-2 leading-relaxed text-stone-600">{ch.body}</p>
            </motion.article>
          ))}
        </div>

        <motion.aside
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-12 overflow-hidden rounded-[2rem] border border-amber-200/90 bg-gradient-to-br from-amber-50 via-white to-orange-50 p-8 shadow-inner sm:p-10"
        >
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-amber-100 text-3xl shadow-inner">
              ☎️
            </div>
            <div className="min-w-0 flex-1">
              <h3 className="text-xl font-bold text-amber-950">{t.footer.emergencyTitle}</h3>
              <p className="mt-3 leading-relaxed text-amber-950/85">{t.footer.emergencyBody}</p>
              <div className="mt-6 grid gap-3 rounded-2xl border border-amber-200/80 bg-white/80 p-5 sm:grid-cols-2">
                <p className="text-sm">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-stone-500">
                    {t.footer.hotline1Label}
                  </span>
                  <span className="mt-1 block text-lg font-semibold text-stone-900">{t.footer.hotline1Number}</span>
                </p>
                <p className="text-sm">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-stone-500">
                    {t.footer.hotline2Label}
                  </span>
                  <span className="mt-1 block text-lg font-semibold text-stone-900">{t.footer.hotline2Number}</span>
                </p>
              </div>
            </div>
          </div>
        </motion.aside>
      </div>
    </section>
  )
}
