import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Lang } from './translations'
import { translations } from './translations'

type Messages = (typeof translations)[Lang]

type LanguageContextValue = {
  lang: Lang
  setLang: (lang: Lang) => void
  toggleLang: () => void
  t: Messages
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('retrohelp-lang') as Lang | null
      return saved === 'my' || saved === 'en' ? saved : 'en'
    } catch {
      return 'en'
    }
  })

  const setLangPersist = useCallback((next: Lang) => {
    setLang(next)
    try {
      localStorage.setItem('retrohelp-lang', next)
    } catch {
      /* ignore */
    }
  }, [])

  const toggleLang = useCallback(() => {
    setLangPersist(lang === 'en' ? 'my' : 'en')
  }, [lang, setLangPersist])

  const value = useMemo<LanguageContextValue>(
    () => ({
      lang,
      setLang: setLangPersist,
      toggleLang,
      t: translations[lang],
    }),
    [lang, setLangPersist, toggleLang],
  )

  useEffect(() => {
    document.documentElement.lang = lang === 'my' ? 'my' : 'en'
  }, [lang])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider')
  }
  return ctx
}
