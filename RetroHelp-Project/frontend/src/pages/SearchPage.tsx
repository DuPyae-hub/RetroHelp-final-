import { motion } from 'framer-motion'
import { ClinicSearchForm } from '../components/ClinicSearchForm'
import { useLanguage } from '../i18n/LanguageContext'

export function SearchPage() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 max-w-2xl"
      >
        <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
          {t.search.title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-stone-600">
          {t.search.description}
        </p>
        <p className="mt-2 text-sm font-medium text-teal-800">{t.search.hint}</p>
      </motion.div>
      <ClinicSearchForm variant="compact" />
    </div>
  )
}
