import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ClinicSearchForm } from '../components/ClinicSearchForm'
import { useLanguage } from '../i18n/LanguageContext'

export function FindClinicPage() {
  const { t } = useLanguage()
  const [params] = useSearchParams()
  const initialCenterId = useMemo(() => {
    const raw = params.get('center')
    if (!raw) return null
    const n = Number.parseInt(raw, 10)
    return Number.isFinite(n) && n > 0 ? n : null
  }, [params])

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
      <ClinicSearchForm initialCenterId={initialCenterId} />
    </div>
  )
}
