/** Driving route from OSRM (OpenStreetMap) — free, no API key. */

export type RouteStep = {
  instruction: string
  distanceM: number
}

export type DrivingRoute = {
  /** Leaflet positions [lat, lng] */
  positions: [number, number][]
  distanceMeters: number
  durationSeconds: number
  steps: RouteStep[]
}

type OsrmManeuver = {
  type?: string
  modifier?: string
}

type OsrmStep = {
  distance?: number
  duration?: number
  name?: string
  maneuver?: OsrmManeuver
}

type OsrmRouteResponse = {
  code?: string
  routes?: Array<{
    distance?: number
    duration?: number
    geometry?: { coordinates?: [number, number][] }
    legs?: Array<{ steps?: OsrmStep[] }>
  }>
}

function formatManeuver(step: OsrmStep): string {
  const m = step.maneuver ?? {}
  const street = (step.name ?? '').trim()
  const streetPart = street ? ` onto ${street}` : ''

  switch (m.type) {
    case 'arrive':
      return 'Arrive at the clinic'
    case 'depart':
      return `Start${streetPart || ' on your route'}`
    case 'roundabout':
      return `Take the roundabout${streetPart}`
    case 'rotary':
      return `Enter the rotary${streetPart}`
    case 'merge':
      return `Merge${streetPart}`
    case 'fork':
      return `${capitalize(m.modifier ?? 'Keep')} at the fork${streetPart}`
    case 'end of road':
      return `${capitalize(m.modifier ?? 'Turn')} at the end of the road${streetPart}`
    case 'turn':
      return `${capitalize(m.modifier ?? 'Turn')}${streetPart}`
    case 'continue':
    case 'new name':
      return street ? `Continue on ${street}` : 'Continue straight'
    default:
      return street ? `Continue on ${street}` : 'Continue on route'
  }
}

function capitalize(s: string): string {
  if (!s) return s
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function formatDistance(m: number): string {
  if (m >= 1000) return `${(m / 1000).toFixed(1)} km`
  return `${Math.round(m)} m`
}

export function formatRouteSummary(distanceMeters: number, durationSeconds: number): {
  distanceLabel: string
  durationLabel: string
} {
  const km = distanceMeters / 1000
  const distanceLabel = km >= 1 ? `${km.toFixed(1)} km` : `${Math.round(distanceMeters)} m`
  const minutes = Math.max(1, Math.round(durationSeconds / 60))
  const durationLabel = minutes < 60 ? `${minutes} min` : `${Math.floor(minutes / 60)} h ${minutes % 60} min`
  return { distanceLabel, durationLabel }
}

const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving'

export async function fetchDrivingRoute(
  from: { lat: number; lng: number },
  to: { lat: number; lng: number },
  signal?: AbortSignal,
): Promise<DrivingRoute | null> {
  const coords = `${from.lng},${from.lat};${to.lng},${to.lat}`
  const url = `${OSRM_BASE}/${coords}?overview=full&geometries=geojson&steps=true&alternatives=false`

  const res = await fetch(url, { signal })
  if (!res.ok) return null

  const data = (await res.json()) as OsrmRouteResponse
  if (data.code !== 'Ok' || !data.routes?.[0]) return null

  const route = data.routes[0]
  const rawCoords = route.geometry?.coordinates ?? []
  const positions: [number, number][] = rawCoords.map(([lng, lat]) => [lat, lng])

  const steps: RouteStep[] = []
  for (const leg of route.legs ?? []) {
    for (const step of leg.steps ?? []) {
      const distanceM = step.distance ?? 0
      if (distanceM < 3 && step.maneuver?.type !== 'arrive' && step.maneuver?.type !== 'depart') {
        continue
      }
      steps.push({
        instruction: formatManeuver(step),
        distanceM,
      })
    }
  }

  if (positions.length < 2) return null

  return {
    positions,
    distanceMeters: route.distance ?? 0,
    durationSeconds: route.duration ?? 0,
    steps: steps.length > 0 ? steps : [{ instruction: 'Follow the highlighted route', distanceM: route.distance ?? 0 }],
  }
}

export { formatDistance }
