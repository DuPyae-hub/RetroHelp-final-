import { AnimatePresence, motion } from 'framer-motion'
import { useMemo, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { isStaffOrAdmin } from '../constants/roles'
import { useAuth } from '../context/AuthContext'
import { useLanguage } from '../i18n/LanguageContext'
import { BurmeseToggle } from './BurmeseToggle'

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-2xl px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-teal-600 text-white shadow-md shadow-teal-900/20'
      : 'text-stone-700 hover:bg-orange-50 hover:text-stone-900'
  }`

export function Navbar() {
  const { t } = useLanguage()
  const { user } = useAuth()
  const [open, setOpen] = useState(false)

  const links = useMemo(() => {
    const base = [
      { to: '/', label: t.nav.home },
      { to: '/find-clinic', label: t.nav.findClinic },
      { to: '/library', label: t.nav.library },
      { to: '/profile', label: t.nav.profile },
      { to: '/search', label: t.nav.search },
    ] as { to: string; label: string }[]
    if (user && isStaffOrAdmin(user.role_id)) {
      base.splice(4, 0, { to: '/staff', label: t.nav.staff })
    }
    return base
  }, [t.nav, user])

  return (
    <header className="sticky top-0 z-40 border-b border-orange-100/80 bg-orange-50/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link
          to="/"
          className="group flex shrink-0 items-center gap-2 rounded-2xl px-1 py-1"
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-teal-700 text-lg text-white shadow-lg shadow-teal-900/25 ring-2 ring-white/60">
            ❤
          </span>
          <span className="text-lg font-bold tracking-tight text-stone-900 sm:text-xl">
            {t.brand}
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {links.map(({ to, label }) => (
            <NavLink key={to} to={to} className={navClass} end={to === '/'}>
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <BurmeseToggle className="hidden sm:inline-flex" />
          <button
            type="button"
            className="inline-flex rounded-2xl border border-orange-200/80 bg-white p-2 text-stone-800 shadow-sm md:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-label={open ? t.nav.closeMenu : t.nav.openMenu}
          >
            <span className="sr-only">
              {open ? t.nav.closeMenu : t.nav.openMenu}
            </span>
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden
            >
              {open ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-orange-100/90 bg-orange-50/95 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              <div className="pb-2">
                <BurmeseToggle />
              </div>
              {links.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `${navClass({ isActive })} text-base`
                  }
                  onClick={() => setOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
