import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import './index.css'
import App from './App.tsx'
import { ScrollToTop } from './components/ScrollToTop.tsx'
import { AuthProvider } from './context/AuthContext.tsx'
import { SupportOpenerProvider } from './context/SupportOpenerContext.tsx'
import { LanguageProvider } from './i18n/LanguageContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <ScrollToTop />
        <SupportOpenerProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </SupportOpenerProvider>
      </BrowserRouter>
    </LanguageProvider>
  </StrictMode>,
)
