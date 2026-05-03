import { motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'
import { FloatingSupport } from './FloatingSupport'
import { Navbar } from './Navbar'

const pageVariants = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
}

export function Layout() {
  const location = useLocation()

  return (
    <div className="flex min-h-dvh flex-col bg-gradient-to-b from-orange-50 via-stone-50 to-teal-50/40">
      <Navbar />
      <motion.main
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex-1"
      >
        <Outlet />
      </motion.main>
      <FloatingSupport />
    </div>
  )
}
