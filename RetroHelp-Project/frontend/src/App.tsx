import { Navigate, Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { AboutPage } from './pages/AboutPage'
import { CustomerSupportPage } from './pages/CustomerSupportPage'
import { FaqPage } from './pages/FaqPage'
import { FindClinicPage } from './pages/FindClinicPage'
import { HomePage } from './pages/HomePage'
import { LibraryPage } from './pages/LibraryPage'
import { ProfilePage } from './pages/ProfilePage'
import { AdminDashboardPage } from './pages/AdminDashboardPage'
import { StaffDashboardPage } from './pages/StaffDashboardPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/find-clinic" element={<FindClinicPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/customer-support" element={<CustomerSupportPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/staff" element={<StaffDashboardPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="/admin/staff-approvals" element={<Navigate to="/admin" replace />} />
      </Route>
    </Routes>
  )
}
