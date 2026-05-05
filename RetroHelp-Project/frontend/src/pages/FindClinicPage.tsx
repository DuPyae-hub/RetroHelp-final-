import { motion } from 'framer-motion'
import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { AnimatedClinicMascot } from '../components/AnimatedSectionMascots'
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
      <div className="mb-8 rounded-3xl border border-teal-100/80 bg-gradient-to-br from-white to-teal-50/70 p-6 shadow-sm sm:mb-10 sm:p-8">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl"
        >
          <h1 className="text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl">
            {t.findClinic.title}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-stone-600 sm:text-lg">
            {t.findClinic.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-teal-100 px-3 py-1 text-xs font-semibold text-teal-900">
              {t.findClinic.chipSearch}
            </span>
            <span className="rounded-full bg-orange-100 px-3 py-1 text-xs font-semibold text-orange-900">
              {t.findClinic.chipVerified}
            </span>
            <span className="rounded-full bg-sky-100 px-3 py-1 text-xs font-semibold text-sky-900">
              {t.findClinic.chipMaps}
            </span>
          </div>
        </motion.div>
        <AnimatedClinicMascot className="mx-auto h-32 w-32 sm:mx-0 sm:h-36 sm:w-36" />
        </div>
      </div>
      <ClinicSearchForm initialCenterId={initialCenterId} />
    </div>
  )
}
