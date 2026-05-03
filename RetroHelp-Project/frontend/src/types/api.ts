export type ResourceLibraryItem = {
  id: number
  title: string
  content: string | null
  category: string | null
  created_at: string | null
  updated_at: string | null
}

export type ArtCenterSearchItem = {
  id: number
  name: string
  township: string | null
  area: string | null
  is_verified: boolean
  rating_avg: string | number | null
  total_reviews: number | null
  completed_dispenses_count?: number
}

export type ArtCenterDetail = {
  id: number
  name: string
  township: string | null
  area: string | null
  latitude: string | number | null
  longitude: string | number | null
  is_verified: boolean
}

export type PendingDispenseItem = {
  dispense_id: number
  status: string
  created_at: string | null
  community_member_display: string
  art_center_name: string | null
}

export type AwaitingReceiptItem = {
  dispense_id: number
  status: string
  dispense_date: string | null
  art_center_name: string | null
}
