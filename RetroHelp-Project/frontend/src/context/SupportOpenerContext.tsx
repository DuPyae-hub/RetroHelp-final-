import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'

type SupportOpenerContextValue = {
  registerOpen: (fn: (() => void) | null) => void
  requestOpen: () => void
}

const SupportOpenerContext = createContext<SupportOpenerContextValue | null>(
  null,
)

export function SupportOpenerProvider({ children }: { children: ReactNode }) {
  const openerRef = useRef<(() => void) | null>(null)

  const registerOpen = useCallback((fn: (() => void) | null) => {
    openerRef.current = fn
  }, [])

  const requestOpen = useCallback(() => {
    openerRef.current?.()
  }, [])

  const value = useMemo(
    () => ({ registerOpen, requestOpen }),
    [registerOpen, requestOpen],
  )

  return (
    <SupportOpenerContext.Provider value={value}>
      {children}
    </SupportOpenerContext.Provider>
  )
}

export function useSupportOpener() {
  const ctx = useContext(SupportOpenerContext)
  if (!ctx) {
    throw new Error('useSupportOpener must be used within SupportOpenerProvider')
  }
  return ctx
}
