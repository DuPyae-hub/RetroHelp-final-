export type ResourceLibraryItem = {
  id: number
  title: string
  content: string | null
  category: string | null
  created_at: string | null
  updated_at: string | null
}

export type TopRankedClinic = {
  id: number
  name: string
  nickname?: string | null
  image?: string | null
  township: string | null
  area: string | null
  rating_avg: string | number | null
  total_reviews: number | null
  is_verified: boolean
  art_pills_available?: boolean
  art_pills_count?: number | null
  art_three_month_people_count?: number | null
  booking_pill_given_count?: number
}

export type HomeOverviewStats = {
  users_count: number
  pill_given_count: number
  clinics_count: number
}

export type ArtCenterSearchItem = {
  id: number
  name: string
  nickname?: string | null
  image?: string | null
  township: string | null
  area: string | null
  is_verified: boolean
  rating_avg: string | number | null
  total_reviews: number | null
  art_pills_available?: boolean
  art_pills_count?: number | null
  art_three_month_people_count?: number | null
  completed_bookings_count?: number
}

export type ArtCenterDetail = {
  id: number
  name: string
  township: string | null
  area: string | null
  image?: string | null
  latitude: string | number | null
  longitude: string | number | null
  is_verified: boolean
  art_pills_available?: boolean
  art_pills_count?: number | null
  art_three_month_people_count?: number | null
}

export type NavigationLogItem = {
  navigation_id: number
  start_location: string | null
  destination: string | null
  art_center_id: number | null
  created_at: string | null
  art_center?: {
    id: number
    name: string
    township: string | null
    area: string | null
  } | null
}

export type PatientBookingRow = {
  id: number
  user_id: number
  art_center_id: number
  staff_id: number | null
  navigation_id: number | null
  status: string
  patient_note: string | null
  accepted_at: string | null
  respond_by_at: string | null
  cancelled_at: string | null
  cancellation_reason: string | null
  created_at: string | null
  updated_at: string | null
  art_center?: {
    id: number
    name: string
    township: string | null
    area: string | null
    latitude?: string | number | null
    longitude?: string | number | null
  } | null
}
