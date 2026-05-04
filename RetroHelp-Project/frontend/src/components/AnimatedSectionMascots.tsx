import { motion, useReducedMotion } from 'framer-motion'

type MascotProps = {
  className?: string
}

/**
 * Friendly reading / library character — inline SVG + motion (no external assets).
 */
export function AnimatedLibraryMascot({ className = 'h-28 w-28 sm:h-32 sm:w-32' }: MascotProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={`shrink-0 select-none ${className}`}
      aria-hidden
      initial={false}
      animate={
        reduce
          ? undefined
          : {
              y: [0, -8, 0],
              rotate: [0, -2.5, 2.5, 0],
            }
      }
      transition={{ duration: 3.8, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible drop-shadow-md">
        <defs>
          <linearGradient id="lib-body" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5eead4" />
            <stop offset="100%" stopColor="#14b8a6" />
          </linearGradient>
          <linearGradient id="lib-book" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fff7ed" />
            <stop offset="100%" stopColor="#fed7aa" />
          </linearGradient>
        </defs>
        {/* shadow */}
        <ellipse cx="60" cy="108" rx="28" ry="6" fill="rgb(41 37 36 / 0.12)" />
        {/* body */}
        <ellipse cx="60" cy="72" rx="34" ry="30" fill="url(#lib-body)" />
        {/* head */}
        <circle cx="60" cy="38" r="26" fill="url(#lib-body)" />
        {/* blush */}
        <circle cx="48" cy="42" r="5" fill="rgb(254 202 202 / 0.55)" />
        <circle cx="72" cy="42" r="5" fill="rgb(254 202 202 / 0.55)" />
        {/* eyes */}
        <motion.g
          animate={reduce ? undefined : { scaleY: [1, 0.12, 1, 1, 1] }}
          transition={{ duration: 4.2, repeat: Infinity, times: [0, 0.08, 0.12, 0.5, 1] }}
          style={{ transformOrigin: '60px 40px' }}
        >
          <ellipse cx="52" cy="40" rx="3.5" ry="4" fill="#1c1917" />
          <ellipse cx="68" cy="40" rx="3.5" ry="4" fill="#1c1917" />
        </motion.g>
        {/* smile */}
        <path
          d="M 50 48 Q 60 56 70 48"
          fill="none"
          stroke="#0f766e"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        {/* book */}
        <motion.g
          animate={reduce ? undefined : { rotate: [0, -4, 4, 0] }}
          transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '60px 78px' }}
        >
          <rect x="38" y="62" width="44" height="32" rx="4" fill="url(#lib-book)" stroke="#ea580c" strokeWidth="2" />
          <line x1="60" y1="62" x2="60" y2="94" stroke="#ea580c" strokeWidth="1.5" />
          <line x1="44" y1="72" x2="56" y2="72" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="44" y1="80" x2="56" y2="80" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="64" y1="72" x2="76" y2="72" stroke="#fdba74" strokeWidth="1.5" strokeLinecap="round" />
        </motion.g>
      </svg>
    </motion.div>
  )
}

/**
 * Small clinic / care character for find-clinic flows.
 */
export function AnimatedClinicMascot({ className = 'h-28 w-28 sm:h-32 sm:w-32' }: MascotProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      className={`shrink-0 select-none ${className}`}
      aria-hidden
      initial={false}
      animate={
        reduce
          ? undefined
          : {
              y: [0, -7, 0],
            }
      }
      transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible drop-shadow-md">
        <defs>
          <linearGradient id="clinic-roof" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0d9488" />
            <stop offset="100%" stopColor="#115e59" />
          </linearGradient>
          <linearGradient id="clinic-wall" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fafaf9" />
            <stop offset="100%" stopColor="#e7e5e4" />
          </linearGradient>
        </defs>
        <ellipse cx="60" cy="108" rx="30" ry="6" fill="rgb(41 37 36 / 0.1)" />
        {/* building */}
        <rect x="28" y="48" width="64" height="52" rx="8" fill="url(#clinic-wall)" stroke="#a8a29e" strokeWidth="2" />
        <path d="M 22 52 L 60 22 L 98 52 Z" fill="url(#clinic-roof)" stroke="#0f766e" strokeWidth="2" strokeLinejoin="round" />
        {/* door */}
        <rect x="52" y="78" width="16" height="22" rx="2" fill="#ccfbf1" stroke="#0d9488" strokeWidth="1.5" />
        {/* window */}
        <rect x="36" y="60" width="14" height="12" rx="2" fill="#cffafe" stroke="#0891b2" strokeWidth="1.2" />
        <rect x="70" y="60" width="14" height="12" rx="2" fill="#cffafe" stroke="#0891b2" strokeWidth="1.2" />
        {/* cross — pulse */}
        <motion.g
          animate={reduce ? undefined : { scale: [1, 1.12, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '60px 38px' }}
        >
          <rect x="56" y="30" width="8" height="22" rx="1.5" fill="#f43f5e" />
          <rect x="49" y="37" width="22" height="8" rx="1.5" fill="#f43f5e" />
        </motion.g>
        {/* tiny heart spark */}
        <motion.path
          d="M 88 88 C 88 82 94 82 96 86 C 98 82 104 82 104 88 C 104 94 96 100 96 100 C 96 100 88 94 88 88 Z"
          fill="#fb7185"
          animate={reduce ? undefined : { opacity: [0.35, 1, 0.35], scale: [0.9, 1.05, 0.9] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ transformOrigin: '96px 92px' }}
        />
      </svg>
    </motion.div>
  )
}
