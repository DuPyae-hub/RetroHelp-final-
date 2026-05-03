import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { AwaitingReceiptSection } from '../components/AwaitingReceiptSection'
import { useLanguage } from '../i18n/LanguageContext'

export function HomePage() {
  const { t } = useLanguage()

  return (
    <div>
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-700 via-teal-800 to-stone-900" />
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-orange-300/25 blur-3xl" />
        <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-teal-400/20 blur-3xl" />

        <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-100/95"
          >
            {t.home.eyebrow}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="max-w-3xl text-4xl font-extrabold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl"
          >
            {t.home.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.16 }}
            className="max-w-2xl text-lg leading-relaxed text-teal-50/95 sm:text-xl"
          >
            {t.home.subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.24 }}
            className="flex flex-col gap-4 sm:flex-row sm:items-center"
          >
            <motion.div
              className="inline-block"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to="/find-clinic"
                className="inline-flex rounded-full bg-white px-8 py-4 text-base font-bold text-teal-800 shadow-xl shadow-stone-900/30"
              >
                {t.home.cta}
              </Link>
            </motion.div>
            <p className="text-sm font-medium text-teal-100/90 sm:pl-2">
              {t.home.trust}
            </p>
          </motion.div>
        </div>
      </section>

      <AwaitingReceiptSection />

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-6 rounded-3xl border border-orange-100/90 bg-white/80 p-8 shadow-xl shadow-teal-900/5 backdrop-blur-sm sm:grid-cols-3 sm:p-10">
          {[
            { emoji: '🤝', label: t.home.trust1 },
            { emoji: '🔒', label: t.home.trust2 },
            { emoji: '☀️', label: t.home.trust3 },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ delay: i * 0.1 }}
              className="text-center sm:text-left"
            >
              <div className="mb-2 text-3xl">{item.emoji}</div>
              <p className="text-sm font-semibold text-stone-800">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
