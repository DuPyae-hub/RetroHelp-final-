import { motion, useReducedMotion, type Transition } from 'framer-motion'
import { useId, type ReactNode } from 'react'

export type BookingMascotStatus =
  | 'requested'
  | 'accepted'
  | 'on_my_way'
  | 'arrived'
  | 'pill_given'
  | 'completed'
  | 'cancelled'

type Props = {
  status: string
  /** Pixel width/height of the illustration box */
  size?: number
  className?: string
  /** Screen reader label, e.g. translated status text */
  'aria-label'?: string
}

function normalizeStatus(s: string): BookingMascotStatus {
  const allowed: BookingMascotStatus[] = [
    'requested',
    'accepted',
    'on_my_way',
    'arrived',
    'pill_given',
    'completed',
    'cancelled',
  ]
  return (allowed.includes(s as BookingMascotStatus) ? s : 'requested') as BookingMascotStatus
}

/** Shared cute blob body + face (eyes follow mood via props). */
function Face({
  mood,
  uid,
}: {
  mood: 'wait' | 'happy' | 'walk' | 'focus' | 'relief' | 'celebrate' | 'sad'
  uid: string
}) {
  const bodyGrad = `${uid}-body`
  const cheekGrad = `${uid}-cheek`
  const mouth =
    mood === 'wait' ? (
      <ellipse cx="60" cy="58" rx="6" ry="3" fill="#0f766e" opacity={0.35} />
    ) : mood === 'happy' || mood === 'celebrate' ? (
      <path
        d="M 48 56 Q 60 66 72 56"
        fill="none"
        stroke="#0f766e"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    ) : mood === 'sad' ? (
      <path
        d="M 48 60 Q 60 52 72 60"
        fill="none"
        stroke="#9a3412"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    ) : (
      <line x1="52" y1="58" x2="68" y2="58" stroke="#0f766e" strokeWidth="2" strokeLinecap="round" />
    )

  const eyeRx = mood === 'celebrate' ? 3.2 : 3
  const eyeRy = mood === 'wait' || mood === 'sad' ? 2.2 : 3.2
  const eyeOff = mood === 'walk' ? 1.5 : 0

  return (
    <g>
      <defs>
        <linearGradient id={bodyGrad} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#5eead4" />
          <stop offset="100%" stopColor="#0d9488" />
        </linearGradient>
        <linearGradient id={cheekGrad} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fed7aa" stopOpacity={0.9} />
          <stop offset="100%" stopColor="#fdba74" stopOpacity={0.5} />
        </linearGradient>
      </defs>
      {/* soft shadow */}
      <ellipse cx="62" cy="102" rx="32" ry="8" fill="#134e4a" opacity={0.12} />
      {/* body */}
      <ellipse cx="60" cy="78" rx="34" ry="36" fill={`url(#${bodyGrad})`} />
      {/* head */}
      <circle cx="60" cy="42" r="30" fill={`url(#${bodyGrad})`} />
      {/* tiny ears */}
      <circle cx="34" cy="38" r="10" fill="#14b8a6" />
      <circle cx="86" cy="38" r="10" fill="#14b8a6" />
      {/* cheeks (hidden for sad) */}
      {mood !== 'sad' ? (
        <>
          <ellipse cx="42" cy="48" rx="6" ry="4" fill={`url(#${cheekGrad})`} />
          <ellipse cx="78" cy="48" rx="6" ry="4" fill={`url(#${cheekGrad})`} />
        </>
      ) : null}
      {/* eyes */}
      <ellipse cx={48 - eyeOff} cy="44" rx={eyeRx} ry={eyeRy} fill="#134e4a" />
      <ellipse cx={72 + eyeOff} cy="44" rx={eyeRx} ry={eyeRy} fill="#134e4a" />
      {mouth}
    </g>
  )
}

function MascotSvg({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 120 120" className="h-full w-full overflow-visible" aria-hidden>
      {children}
    </svg>
  )
}

export function BookingStatusMascot({
  status,
  size = 88,
  className = '',
  'aria-label': ariaLabel,
}: Props) {
  const s = normalizeStatus(status)
  const reduce = useReducedMotion()
  const uid = useId().replace(/:/g, '')

  const loopBase: Transition = reduce
    ? { duration: 0 }
    : { repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }

  const withDur = (seconds: number): Transition =>
    reduce ? { duration: 0 } : { ...loopBase, duration: seconds }

  const bob = reduce
    ? {}
    : {
        y: [0, -5, 0],
        transition: withDur(2.2),
      }

  const walk = reduce
    ? {}
    : {
        x: [-5, 5, -5],
        rotate: [-2, 2, -2],
        transition: withDur(1.4),
      }

  const pulse = reduce
    ? {}
    : {
        scale: [1, 1.06, 1],
        transition: withDur(1.8),
      }

  const wobble = reduce
    ? {}
    : {
        rotate: [0, -4, 4, 0],
        transition: withDur(2.6),
      }

  const extras = (() => {
    switch (s) {
      case 'requested':
        return (
          <MascotSvg>
            <Face mood="wait" uid={uid} />
            {/* waiting dots */}
            <motion.g
              animate={reduce ? {} : { opacity: [0.4, 1, 0.4] }}
              transition={withDur(1.2)}
            >
              <circle cx="28" cy="88" r="4" fill="#f97316" />
              <circle cx="40" cy="88" r="4" fill="#fb923c" />
              <circle cx="52" cy="88" r="4" fill="#fdba74" />
            </motion.g>
          </MascotSvg>
        )
      case 'accepted':
        return (
          <MascotSvg>
            <Face mood="happy" uid={uid} />
            {/* spark */}
            <motion.g
              animate={reduce ? {} : { scale: [1, 1.15, 1], opacity: [0.85, 1, 0.85] }}
              transition={withDur(1.5)}
              style={{ transformOrigin: '92px 28px' }}
            >
              <path
                d="M 92 22 L 94 28 L 100 28 L 95 32 L 97 38 L 92 34 L 87 38 L 89 32 L 84 28 L 90 28 Z"
                fill="#fbbf24"
              />
            </motion.g>
          </MascotSvg>
        )
      case 'on_my_way':
        return (
          <MascotSvg>
            <Face mood="walk" uid={uid} />
            {/* motion lines */}
            <g stroke="#0d9488" strokeWidth="2.5" strokeLinecap="round" opacity={0.55}>
              <line x1="14" y1="72" x2="4" y2="72" />
              <line x1="16" y1="82" x2="6" y2="82" />
              <line x1="14" y1="92" x2="4" y2="92" />
            </g>
          </MascotSvg>
        )
      case 'arrived':
        return (
          <MascotSvg>
            <Face mood="focus" uid={uid} />
            {/* clinic roof */}
            <path d="M 88 78 L 108 62 L 108 92 L 88 92 Z" fill="#fed7aa" stroke="#ea580c" strokeWidth="1.5" />
            <path d="M 86 62 L 108 62 L 97 52 Z" fill="#fb923c" />
          </MascotSvg>
        )
      case 'pill_given':
        return (
          <MascotSvg>
            <Face mood="relief" uid={uid} />
            <motion.g
              animate={reduce ? {} : { scale: [1, 1.12, 1] }}
              transition={withDur(1.2)}
              style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
            >
              <circle cx="88" cy="72" r="12" fill="#fff7ed" stroke="#f97316" strokeWidth="2.5" />
              <circle cx="88" cy="72" r="5" fill="#fb923c" />
            </motion.g>
          </MascotSvg>
        )
      case 'completed':
        return (
          <MascotSvg>
            <Face mood="celebrate" uid={uid} />
            <motion.g
              animate={reduce ? {} : { y: [0, -3, 0], opacity: [0.7, 1, 0.7] }}
              transition={withDur(1.3)}
            >
              <path
                d="M 22 18 L 24 24 L 30 24 L 25 28 L 27 34 L 22 30 L 17 34 L 19 28 L 14 24 L 20 24 Z"
                fill="#fbbf24"
              />
              <path
                d="M 100 14 L 101 18 L 105 18 L 102 21 L 103 25 L 100 23 L 97 25 L 98 21 L 95 18 L 99 18 Z"
                fill="#fcd34d"
              />
            </motion.g>
          </MascotSvg>
        )
      case 'cancelled':
        return (
          <MascotSvg>
            <Face mood="sad" uid={uid} />
            <path
              d="M 24 24 Q 40 10 60 14 Q 80 10 96 24"
              fill="none"
              stroke="#7dd3fc"
              strokeWidth="3"
              strokeLinecap="round"
              opacity={0.85}
            />
            <ellipse cx="34" cy="30" rx="2" ry="5" fill="#38bdf8" opacity={0.7} />
            <ellipse cx="50" cy="26" rx="2" ry="6" fill="#38bdf8" opacity={0.7} />
            <ellipse cx="70" cy="28" rx="2" ry="5" fill="#38bdf8" opacity={0.7} />
          </MascotSvg>
        )
      default:
        return null
    }
  })()

  const anim =
    s === 'on_my_way'
      ? walk
      : s === 'pill_given'
        ? pulse
        : s === 'cancelled'
          ? wobble
          : bob

  return (
    <div
      role="img"
      aria-label={ariaLabel}
      className={`shrink-0 rounded-3xl border border-teal-100/80 bg-gradient-to-b from-orange-50/90 to-white shadow-inner shadow-teal-900/5 ${className}`}
      style={{ width: size, height: size }}
    >
      <motion.div
        className="flex h-full w-full items-center justify-center p-2"
        animate={anim}
        initial={false}
      >
        {extras}
      </motion.div>
    </div>
  )
}
