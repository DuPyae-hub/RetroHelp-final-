import { Link } from 'react-router-dom'
import { BurmeseToggle } from './BurmeseToggle'
import { useLanguage } from '../i18n/LanguageContext'

export function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="mt-auto border-t border-slate-800 bg-slate-900 text-slate-200">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              {t.footer.quickLinks}
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              <li>
                <Link
                  to="/faq"
                  className="text-slate-200 underline-offset-4 hover:text-white hover:underline"
                >
                  {t.footer.faq}
                </Link>
              </li>
              <li>
                <Link
                  to="/customer-support"
                  className="text-slate-200 underline-offset-4 hover:text-white hover:underline"
                >
                  {t.footer.customerSupport}
                </Link>
              </li>
              <li>
                <Link
                  to="/about"
                  className="text-slate-200 underline-offset-4 hover:text-white hover:underline"
                >
                  {t.footer.aboutUs}
                </Link>
              </li>
              <li>
                <Link
                  to="/library"
                  className="text-slate-200 underline-offset-4 hover:text-white hover:underline"
                >
                  {t.nav.library}
                </Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-300/90">
              {t.footer.emergencyTitle}
            </p>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-slate-300">
              {t.footer.emergencyBody}
            </p>
            <div className="mt-5 grid gap-3 rounded-2xl border border-amber-400/40 bg-amber-500/10 px-4 py-4 sm:grid-cols-2">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-200/90">
                  {t.footer.hotline1Label}
                </p>
                <p className="mt-1 font-mono text-lg font-bold text-white">
                  {t.footer.hotline1Number}
                </p>
              </div>
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-wide text-amber-200/90">
                  {t.footer.hotline2Label}
                </p>
                <p className="mt-1 font-mono text-lg font-bold text-white">
                  {t.footer.hotline2Number}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
              {t.footer.languageHeading}
            </p>
            <div className="mt-4">
              <BurmeseToggle tone="dark" pillLayoutId="lang-pill-footer" />
            </div>
            <p className="mt-8 text-xs text-slate-500">{t.footer.rights}</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
