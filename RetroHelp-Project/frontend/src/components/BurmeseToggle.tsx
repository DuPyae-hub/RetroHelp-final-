import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'

export function BurmeseToggle({
  className = '',
  tone = 'light',
}: {
  className?: string
  tone?: 'light' | 'dark'
}) {
  const { lang, setLang, t } = useLanguage()
  const shell =
    tone === 'dark'
      ? 'border-slate-600 bg-slate-800/90 shadow-none backdrop-blur-sm'
      : 'border-teal-200/80 bg-white/90 shadow-sm shadow-teal-900/5 backdrop-blur-sm'
  const inactive = tone === 'dark' ? 'text-slate-300 hover:text-white' : 'text-stone-600 hover:text-stone-900'

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
            layoutId="lang-pill"
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
            layoutId="lang-pill"
            className="absolute inset-0 rounded-full bg-teal-600"
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          />
        )}
        <span className="relative z-10">{t.lang.burmese}</span>
      </button>
    </div>
  )
}
