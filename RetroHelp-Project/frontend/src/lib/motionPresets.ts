import type { Transition, Variants } from 'framer-motion'

/** Soft ease for premium entrance curves */
export const easeSoft: Transition['ease'] = [0.22, 1, 0.36, 1]

export const duration = {
  page: 0.65,
  section: 0.55,
  item: 0.48,
} as const

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.section, ease: easeSoft },
  },
}

export const fade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: duration.page, ease: easeSoft },
  },
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.06,
      ease: easeSoft,
    },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: duration.item, ease: easeSoft },
  },
}

/** Glassmorphism panel — large radius, blur, light border */
export const glassPanel =
  'rounded-[2rem] border border-white/50 bg-white/45 shadow-[0_8px_40px_-8px_rgba(15,118,110,0.12)] backdrop-blur-2xl supports-[backdrop-filter]:bg-white/40'

export const glassPanelStrong =
  'rounded-[2rem] border border-white/55 bg-white/55 shadow-[0_12px_48px_-10px_rgba(15,118,110,0.18)] backdrop-blur-2xl supports-[backdrop-filter]:bg-white/50'

export const glassTabActive =
  'rounded-2xl bg-teal-600/95 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-teal-900/25 backdrop-blur-md'

export const glassTabIdle =
  'rounded-2xl border border-white/50 bg-white/35 px-4 py-2.5 text-sm font-semibold text-stone-800 shadow-sm backdrop-blur-md transition hover:bg-white/55'
