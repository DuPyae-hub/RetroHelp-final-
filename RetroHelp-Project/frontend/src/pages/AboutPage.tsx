import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../i18n/LanguageContext'

const stagger = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
}

const fadeUp = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0 },
}

export function AboutPage() {
  const { t } = useLanguage()

  useEffect(() => {
    document.title = `${t.footer.aboutUs} · ${t.brand}`
  }, [t.brand, t.footer.aboutUs])

  const pillars = [
    {
      emoji: '🔒',
      title: t.home.confidence1Title,
      body: t.home.confidence1Body,
      accent: 'from-teal-500/15 to-emerald-500/10',
    },
    {
      emoji: '✓',
      title: t.home.confidence2Title,
      body: t.home.confidence2Body,
      accent: 'from-orange-500/15 to-amber-500/10',
    },
    {
      emoji: '🤝',
      title: t.home.confidence3Title,
      body: t.home.confidence3Body,
      accent: 'from-teal-500/15 to-orange-500/10',
    },
  ]

  const offers = t.aboutPage.offers.map((offer, i) => ({
    ...offer,
    emoji: ['🗺️', '📚', '📋'][i] ?? '✶',
  }))

  return (
    <section className="relative overflow-hidden pb-20" aria-labelledby="about-main-heading">
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div className="absolute inset-x-0 top-0 h-[28rem] bg-gradient-to-b from-teal-100/70 via-orange-50/50 to-transparent" />
        <div className="absolute bottom-0 left-1/2 h-96 w-[120%] -translate-x-1/2 rounded-[100%] bg-gradient-to-t from-teal-100/40 to-transparent blur-2xl" />
      </div>

      <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 sm:pt-14">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:gap-12">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative"
          >
            <div className="absolute -left-2 top-8 h-24 w-24 rounded-full bg-teal-400/20 blur-2xl" aria-hidden />
            <p className="inline-flex rounded-full bg-white/90 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-teal-800 shadow-sm ring-1 ring-teal-100">
              {t.brand}
            </p>
            <h1
              id="about-main-heading"
              className="mt-5 text-4xl font-bold leading-tight text-stone-900 sm:text-5xl"
            >
              {t.footer.aboutUs}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-stone-600">{t.aboutPage.missionLead}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/faq"
                className="inline-flex items-center rounded-full bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/20 transition hover:bg-teal-700"
              >
                {t.footer.faq}
              </Link>
              <Link
                to="/find-clinic"
                className="inline-flex items-center rounded-full border-2 border-stone-200 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 transition hover:border-teal-300"
              >
                {t.nav.findClinic}
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.08, type: 'spring', stiffness: 120 }}
            className="relative mx-auto w-full max-w-md lg:mx-0"
          >
            <div className="aspect-square rounded-[2rem] bg-gradient-to-br from-teal-500 via-teal-600 to-orange-400 p-[3px] shadow-2xl shadow-teal-900/25">
              <div className="flex h-full w-full flex-col items-center justify-center rounded-[1.85rem] bg-gradient-to-b from-white to-orange-50/90 px-8 text-center">
                <span className="text-7xl drop-shadow-sm" aria-hidden>
                  ✶
                </span>
                <p className="mt-6 font-serif text-2xl italic leading-snug text-teal-900/90">
                  “{t.home.eyebrow}”
                </p>
                <p className="mt-4 text-sm font-medium text-stone-500">{t.home.subtitle}</p>
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-14 rounded-[2rem] border border-teal-100/90 bg-white/90 p-8 shadow-lg shadow-teal-900/5 sm:p-10"
        >
          <h2 className="text-xl font-bold text-stone-900">{t.aboutPage.missionTitle}</h2>
          <p className="mt-3 max-w-3xl leading-relaxed text-stone-600">{t.footer.aboutLead}</p>
        </motion.div>

        <p className="mt-12 text-center text-sm font-semibold uppercase tracking-widest text-teal-800">
          {t.aboutPage.pillarsIntro}
        </p>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
          className="mt-6 grid gap-5 sm:grid-cols-3"
        >
          {pillars.map((p) => (
            <motion.article
              key={p.title}
              variants={fadeUp}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className="group relative overflow-hidden rounded-3xl border border-teal-100/90 bg-white p-6 shadow-lg shadow-teal-900/5"
            >
              <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${p.accent}`}
              />
              <div className="relative">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-100 to-orange-50 text-2xl shadow-inner">
                  {p.emoji}
                </span>
                <h3 className="mt-4 text-sm font-bold uppercase tracking-wide text-teal-800">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600">{p.body}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>

        <h2 className="mt-16 text-center text-lg font-bold text-stone-900 sm:text-xl">{t.aboutPage.offersTitle}</h2>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mt-6 grid gap-5 md:grid-cols-3"
        >
          {offers.map((offer) => (
            <motion.article
              key={offer.title}
              variants={fadeUp}
              className="rounded-3xl border border-orange-100/90 bg-gradient-to-b from-white to-orange-50/30 p-6 shadow-md shadow-teal-900/5"
            >
              <span className="text-3xl" aria-hidden>
                {offer.emoji}
              </span>
              <h3 className="mt-4 font-semibold text-stone-900">{offer.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-stone-600">{offer.body}</p>
            </motion.article>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative mt-16 overflow-hidden rounded-[2rem] border border-orange-100 bg-gradient-to-r from-orange-50 via-white to-teal-50 p-8 sm:p-10"
        >
          <div className="absolute -right-8 -top-8 text-[10rem] leading-none text-orange-100/80" aria-hidden>
            ”
          </div>
          <h2 className="relative text-xl font-bold text-stone-900">{t.aboutPage.closingTitle}</h2>
          <p className="relative mt-3 max-w-3xl leading-relaxed text-stone-700">{t.aboutPage.closingBody}</p>
          <div className="relative mt-6 flex flex-wrap gap-4">
            <Link
              to="/library"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 underline-offset-4 hover:text-teal-900 hover:underline"
            >
              {t.nav.library} →
            </Link>
            <Link
              to="/customer-support"
              className="inline-flex items-center gap-2 text-sm font-semibold text-teal-700 underline-offset-4 hover:text-teal-900 hover:underline"
            >
              {t.footer.customerSupport} →
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
