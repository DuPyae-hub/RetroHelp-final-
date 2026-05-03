import { Route, Routes } from 'react-router-dom'
import { Layout } from './components/Layout'
import { FindClinicPage } from './pages/FindClinicPage'
import { HomePage } from './pages/HomePage'
import { LibraryPage } from './pages/LibraryPage'
import { ProfilePage } from './pages/ProfilePage'
import { SearchPage } from './pages/SearchPage'
import { StaffDispensesPage } from './pages/StaffDispensesPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/find-clinic" element={<FindClinicPage />} />
        <Route path="/library" element={<LibraryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/staff" element={<StaffDispensesPage />} />
        <Route path="/search" element={<SearchPage />} />
      </Route>
    </Routes>
  )
}
