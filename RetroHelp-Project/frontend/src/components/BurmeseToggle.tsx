import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'

export function BurmeseToggle({
  className = '',
  tone = 'light',
  /** Unique per mount so Framer `layoutId` does not steal the pill between Navbar and Footer. */
  pillLayoutId = 'lang-pill',
}: {
  className?: string
  tone?: 'light' | 'dark'
  pillLayoutId?: string
}) {
  const { lang, setLang, t } = useLanguage()
  const shell =
    tone === 'dark'
      ? 'border-slate-600 bg-slate-800/90 shadow-none backdrop-blur-sm'
      : 'border-teal-300/90 bg-white shadow-sm shadow-teal-900/10 backdrop-blur-sm'
  const inactive =
    tone === 'dark'
      ? 'text-slate-200 hover:text-white'
      : 'text-stone-800 hover:text-stone-950'

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border p-1 ${shell} ${className}`}
      role="group"
      aria-label={t.lang.toggle}
    >
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`relative rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
          lang === 'en' ? 'text-white' : inactive
        }`}
      >
        {lang === 'en' && (
          <motion.span
            layoutId={pillLayoutId}
            className="absolute inset-0 rounded-full bg-teal-600"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10">{t.lang.english}</span>
      </button>
      <button
        type="button"
        onClick={() => setLang('my')}
        className={`relative rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
          lang === 'my' ? 'text-white' : inactive
        }`}
      >
        {lang === 'my' && (
          <motion.span
            layoutId={pillLayoutId}
            className="absolute inset-0 rounded-full bg-teal-600"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10">{t.lang.burmese}</span>
      </button>
    </div>
  )
}
