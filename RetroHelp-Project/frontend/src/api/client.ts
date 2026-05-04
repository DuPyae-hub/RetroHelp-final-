import axios, { type AxiosError } from 'axios'

const TOKEN_KEY = 'retrohelp_token'

function normalizeApiBase(raw: string | undefined): string {
  if (raw == null) return ''
  const t = String(raw).trim()
  if (!t) return ''
  return t.replace(/\/+$/, '')
}

function devArtisanPort(): number {
  const raw = import.meta.env.VITE_API_PORT as string | undefined
  if (raw == null || String(raw).trim() === '') return 8000
  const n = Number.parseInt(String(raw), 10)
  return Number.isFinite(n) && n > 0 && n < 65536 ? n : 8000
}

/**
 * When VITE_API_BASE_URL is unset, pick a Laravel URL that matches how you opened the app
 * (localhost vs LAN IP vs Herd *.test). Avoids unreachable 127.0.0.1 from another device.
 */
function inferDevApiBaseFromWindow(): string {
  const port = devArtisanPort()
  if (typeof window === 'undefined') {
    return `http://127.0.0.1:${port}`
  }
  const { hostname, protocol } = window.location
  if (hostname === 'localhost') return `http://localhost:${port}`
  if (hostname === '127.0.0.1') return `http://127.0.0.1:${port}`
  if (/^192\.168\.\d{1,3}\.\d{1,3}$/.test(hostname) || /^10\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(hostname)) {
    return `http://${hostname}:${port}`
  }
  if (hostname.endsWith('.test')) {
    const proto = protocol === 'https:' ? 'https' : 'http'
    return `${proto}://${hostname}`
  }
  return `http://127.0.0.1:${port}`
}

function resolveApiBaseURL(): string {
  const fromEnv = normalizeApiBase(import.meta.env.VITE_API_BASE_URL as string | undefined)
  if (fromEnv) return fromEnv
  if (import.meta.env.DEV) return inferDevApiBaseFromWindow()
  return ''
}

export const api = axios.create({
  baseURL: resolveApiBaseURL(),
  headers: {
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
})

export function getStoredToken(): string | null {
  try {
    return sessionStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function setStoredToken(token: string | null): void {
  try {
    if (token) sessionStorage.setItem(TOKEN_KEY, token)
    else sessionStorage.removeItem(TOKEN_KEY)
  } catch {
    /* ignore */
  }
}

api.interceptors.request.use((config) => {
  const token = getStoredToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export function getApiErrorMessage(err: unknown): string {
  const ax = err as AxiosError<{ message?: string; errors?: Record<string, string[]> }>
  if (!ax.response) {
    if (import.meta.env.DEV) {
      const base = resolveApiBaseURL()
      return `${ax.message || 'Network error'} (dev API base: ${base || '(empty)'}). If you opened this app from another device, run: php artisan serve --host=0.0.0.0 --port=${devArtisanPort()} and npm run dev -- --host. Or set VITE_API_BASE_URL in frontend/.env.development.`
    }
    return ax.message || 'Network error'
  }
  if (ax.response.status === 502) {
    return 'Bad gateway: the Vite /api proxy could not reach PHP. Start Laravel (php artisan serve, default port 8000), or set VITE_API_BASE_URL in frontend/.env.development to your API URL, then restart npm run dev.'
  }
  const data = ax.response.data as unknown
  if (typeof data === 'string' && data.includes('<!DOCTYPE')) {
    return 'API returned a web page instead of JSON. Check Vite proxy VITE_API_PROXY_TARGET matches your php artisan serve port, or set VITE_API_BASE_URL to your Laravel URL.'
  }
  const body = data as { message?: string; errors?: Record<string, string[]> }
  if (body?.message) return body.message
  if (body?.errors) {
    const first = Object.values(body.errors).flat()[0]
    if (first) return first
  }
  return ax.response.statusText || 'Request failed'
}
