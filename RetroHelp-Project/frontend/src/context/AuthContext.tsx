import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { api, getStoredToken, setStoredToken } from '../api/client'
import { ROLE } from '../constants/roles'
import type { SafeUser } from '../types/auth'

export type RegisterPatientInput = {
  accountType: 'patient'
  nickname: string
  password: string
  passwordConfirmation: string
}

export type RegisterStaffNewCenter = {
  name: string
  township: string
  area: string
  contactNo: string
  image?: string
  latitude?: string
  longitude?: string
}

export type RegisterStaffInput = {
  accountType: 'clinic_staff'
  fullName: string
  /** Optional display handle; must be unique if provided. */
  nickname?: string | null
  password: string
  passwordConfirmation: string
  /** Join an existing directory clinic. */
  artCenterId?: number | null
  /** If set, creates a pending clinic listing (admin can verify later). */
  newCenter?: RegisterStaffNewCenter | null
}

export type RegisterInput = RegisterPatientInput | RegisterStaffInput

type AuthContextValue = {
  user: SafeUser | null
  token: string | null
  loading: boolean
  register: (input: RegisterInput) => Promise<{ pendingApproval: boolean }>
  loginCommunityMember: (nickname: string, password: string) => Promise<void>
  loginStaff: (
    fullName: string,
    password: string,
    artCenterId: number | null,
    adminLogin?: boolean,
  ) => Promise<void>
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

  const register = useCallback(async (input: RegisterInput) => {
    if (input.accountType === 'patient') {
      const { data } = await api.post<{ token: string; user: SafeUser }>(
        '/api/auth/register',
        {
          account_type: 'patient',
          nickname: input.nickname,
          password: input.password,
          password_confirmation: input.passwordConfirmation,
        },
      )
      setStoredToken(data.token)
      setToken(data.token)
      setUser(data.user)
      return { pendingApproval: false }
    }

    const staffBody: Record<string, string | number | Record<string, unknown>> = {
      account_type: 'clinic_staff',
      full_name: input.fullName.trim(),
      password: input.password,
      password_confirmation: input.passwordConfirmation,
    }
    const nick = input.nickname?.trim()
    if (nick) {
      staffBody.nickname = nick
    }
    if (input.artCenterId != null && input.artCenterId > 0) {
      staffBody.art_center_id = input.artCenterId
    }
    if (input.newCenter) {
      staffBody.new_center = {
        name: input.newCenter.name.trim(),
        township: input.newCenter.township.trim(),
        area: input.newCenter.area.trim(),
        contact_no: input.newCenter.contactNo.trim(),
        image: input.newCenter.image?.trim() || undefined,
        latitude: input.newCenter.latitude
          ? Number.parseFloat(input.newCenter.latitude)
          : undefined,
        longitude: input.newCenter.longitude
          ? Number.parseFloat(input.newCenter.longitude)
          : undefined,
      }
    }
    await api.post('/api/auth/register', staffBody)
    return { pendingApproval: true }
  }, [])

  const loginCommunityMember = useCallback(async (nickname: string, password: string) => {
    const { data } = await api.post<{ token: string; user: SafeUser }>(
      '/api/auth/login/patient',
      { nickname, password },
    )
    setStoredToken(data.token)
    setToken(data.token)
    setUser(data.user)
  }, [])

  const loginStaff = useCallback(
    async (
      fullName: string,
      password: string,
      artCenterId: number | null,
      adminLogin = false,
    ) => {
      const body: Record<string, string | number | boolean> = {
        full_name: fullName,
        password,
      }
      if (artCenterId != null && artCenterId > 0) {
        body.art_center_id = artCenterId
      }
      if (adminLogin) {
        body.admin_login = true
      }
      const { data } = await api.post<{ token: string; user: SafeUser }>(
        '/api/auth/login/staff',
        body,
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
      register,
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
      register,
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
