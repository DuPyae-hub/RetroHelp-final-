import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'
import { ClinicSearchForm } from '../components/ClinicSearchForm'

export function FindClinicPage() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 max-w-2xl"
      >
        <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
          {t.findClinic.title}
        </h1>
        <p className="mt-3 text-base leading-relaxed text-stone-600 sm:text-lg">
          {t.findClinic.description}
        </p>
      </motion.div>
      <ClinicSearchForm />
    </div>
  )
}
