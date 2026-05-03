export type SafeUser = {
  id: number
  role_id: number
  is_verified: boolean
  nickname: string | null
  full_name?: string | null
  role: { id: number; role_name: string } | null
}
