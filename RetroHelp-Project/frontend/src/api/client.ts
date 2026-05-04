import axios, { type AxiosError } from 'axios'

const TOKEN_KEY = 'retrohelp_token'

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '',
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
    return 'Bad gateway: the API server is not reachable from the dev proxy. Start Laravel (e.g. php artisan serve), match its port to VITE_API_PROXY_TARGET in frontend/.env, or set VITE_API_BASE_URL to the running API URL.'
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
