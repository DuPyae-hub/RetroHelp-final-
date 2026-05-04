export type SafeUser = {
  id: number
  role_id: number
  is_verified: boolean
  nickname: string | null
  full_name?: string | null
  art_center_id?: number | null
  art_center?: {
    id: number
    name: string
    nickname: string | null
  } | null
  role: { id: number; role_name: string } | null
}
