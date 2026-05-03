import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'

export function CustomerSupportPage() {
  const { t } = useLanguage()

  return (
    <div className="mx-auto max-w-2xl px-4 py-14 sm:px-6">
      <motion.article
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-orange-100/90 bg-white p-8 shadow-lg shadow-teal-900/5"
      >
        <h1 className="text-3xl font-bold text-stone-900">
          {t.footer.customerSupport}
        </h1>
        <p className="mt-4 leading-relaxed text-stone-600">{t.footer.supportLead}</p>
      </motion.article>
    </div>
  )
}
