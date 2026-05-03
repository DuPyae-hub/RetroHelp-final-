import { motion } from 'framer-motion'
import { useLanguage } from '../i18n/LanguageContext'

export function BurmeseToggle({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useLanguage()

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full border border-teal-200/80 bg-white/90 p-1 shadow-sm shadow-teal-900/5 backdrop-blur-sm ${className}`}
      role="group"
      aria-label={t.lang.toggle}
    >
      <button
        type="button"
        onClick={() => setLang('en')}
        className={`relative rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm ${
          lang === 'en'
            ? 'text-white'
            : 'text-stone-600 hover:text-stone-900'
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
          lang === 'my'
            ? 'text-white'
            : 'text-stone-600 hover:text-stone-900'
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
