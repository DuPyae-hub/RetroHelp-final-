import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

/** Scrolls to top when the route changes (footer links no longer leave you at the bottom). */
export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return null
}
