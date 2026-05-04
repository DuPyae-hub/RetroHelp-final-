import axios, { type AxiosError } from 'axios'

const TOKEN_KEY = 'retrohelp_token'

function normalizeApiBase(raw: string | undefined): string {
  if (raw == null) return ''
  const t = String(raw).trim()
  if (!t) return ''
  return t.replace(/\/+$/, '')
}

/** In dev, default to Laravel on :8000 when VITE_API_BASE_URL is missing or blank (avoids Vite /api proxy 502). */
function resolveApiBaseURL(): string {
  const fromEnv = normalizeApiBase(import.meta.env.VITE_API_BASE_URL as string | undefined)
  if (fromEnv) return fromEnv
  if (import.meta.env.DEV) return 'http://127.0.0.1:8000'
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
  if (!ax.response) return ax.message || 'Network error'
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
