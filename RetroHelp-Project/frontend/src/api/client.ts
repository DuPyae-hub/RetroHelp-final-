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
  const data = ax.response.data
  if (data?.message) return data.message
  if (data?.errors) {
    const first = Object.values(data.errors).flat()[0]
    if (first) return first
  }
  return ax.response.statusText || 'Request failed'
}
