import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api, getApiErrorMessage, getStoredToken, setStoredToken } from '../api/client'
import { ROLE } from '../constants/roles'
import type { SafeUser } from '../types/auth'

type AuthContextValue = {
  user: SafeUser | null
  token: string | null
  loading: boolean
  loginCommunityMember: (nickname: string, password: string) => Promise<void>
  loginStaff: (fullName: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
  updateNickname: (nickname: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null)
  const [token, setToken] = useState<string | null>(() => getStoredToken())
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const t = getStoredToken()
    if (!t) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const { data } = await api.get<{ user: SafeUser }>('/api/auth/user')
      setUser(data.user)
    } catch {
      setStoredToken(null)
      setToken(null)
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refreshUser()
  }, [refreshUser])

  const loginCommunityMember = useCallback(async (nickname: string, password: string) => {
    const { data } = await api.post<{ token: string; user: SafeUser }>(
      '/api/auth/login/patient',
      { nickname, password },
    )
    setStoredToken(data.token)
    setToken(data.token)
    setUser(data.user)
  }, [])

  const loginStaff = useCallback(async (fullName: string, password: string) => {
    const { data } = await api.post<{ token: string; user: SafeUser }>(
      '/api/auth/login/staff',
      { full_name: fullName, password },
    )
    setStoredToken(data.token)
    setToken(data.token)
    setUser(data.user)
  }, [])

  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout')
    } catch {
      /* still clear locally */
    }
    setStoredToken(null)
    setToken(null)
    setUser(null)
  }, [])

  const updateNickname = useCallback(async (nickname: string) => {
    if (user?.role_id !== ROLE.communityMember) {
      throw new Error('Only community member accounts use nickname here.')
    }
    const { data } = await api.patch<{ message?: string; user: SafeUser }>(
      '/api/auth/profile',
      { nickname },
    )
    setUser(data.user)
  }, [user?.role_id])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      token,
      loading,
      loginCommunityMember,
      loginStaff,
      logout,
      refreshUser,
      updateNickname,
    }),
    [
      user,
      token,
      loading,
      loginCommunityMember,
      loginStaff,
      logout,
      refreshUser,
      updateNickname,
    ],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}

export { getApiErrorMessage }
