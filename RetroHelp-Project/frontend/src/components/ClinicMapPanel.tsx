import L from 'leaflet'
import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Polyline, useMap } from 'react-leaflet'
import marker2x from 'leaflet/dist/images/marker-icon-2x.png'
import marker from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'
import type { DrivingRoute } from '../lib/drivingRoute'
import { formatDistance } from '../lib/drivingRoute'

const DefaultIcon = L.icon({
  iconUrl: marker,
  iconRetinaUrl: marker2x,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
})
L.Marker.prototype.options.icon = DefaultIcon

const RouteStartMascotIcon = L.divIcon({
  className: 'retrohelp-route-start-icon',
  html: `
    <div style="position:relative;width:38px;height:38px;display:flex;align-items:center;justify-content:center;">
      <div style="position:absolute;inset:0;border-radius:9999px;background:rgba(20,184,166,0.18);animation:rhPulse 1.8s ease-in-out infinite;"></div>
      <div style="position:relative;width:30px;height:30px;border-radius:9999px;background:#ffffff;border:2px solid #0d9488;display:flex;align-items:center;justify-content:center;font-size:17px;animation:rhBob 1.4s ease-in-out infinite;">📍</div>
    </div>
    <style>
      @keyframes rhBob { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-4px); } }
      @keyframes rhPulse { 0%,100% { transform: scale(1); opacity: .65; } 50% { transform: scale(1.2); opacity: .25; } }
    </style>
  `,
  iconSize: [38, 38],
  iconAnchor: [19, 19],
  popupAnchor: [0, -16],
})

const FALLBACK_CENTER: [number, number] = [21.9162, 95.956]

type Props = {
  name: string
  latitude: number | null
  longitude: number | null
  noCoordsLabel: string
  userLatitude?: number | null
  userLongitude?: number | null
  drivingRoute?: DrivingRoute | null
  routeLoading?: boolean
  routeLoadingLabel?: string
  routeSummary?: { distanceLabel: string; durationLabel: string } | null
  turnByTurnTitle?: string
  routeFailedLabel?: string
}

function FitMapToRoute({
  clinic,
  user,
  routePositions,
}: {
  clinic: [number, number] | null
  user: [number, number] | null
  routePositions: [number, number][] | null
}) {
  const map = useMap()
  useEffect(() => {
    if (routePositions && routePositions.length > 1) {
      const bounds = L.latLngBounds(routePositions)
      map.fitBounds(bounds, { padding: [32, 32] })
      return
    }
    if (clinic && user) {
      map.fitBounds([clinic, user], { padding: [28, 28] })
      return
    }
    if (clinic) {
      map.setView(clinic, 14)
    }
  }, [clinic, map, user, routePositions])
  return null
}

export function ClinicMapPanel({
  name,
  latitude,
  longitude,
  noCoordsLabel,
  userLatitude = null,
  userLongitude = null,
  drivingRoute = null,
  routeLoading = false,
  routeLoadingLabel = 'Loading route…',
  routeSummary = null,
  turnByTurnTitle = 'Turn-by-turn',
  routeFailedLabel,
}: Props) {
  const hasCoords =
    latitude !== null &&
    longitude !== null &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude)

  const center: [number, number] = hasCoords
    ? [latitude as number, longitude as number]
    : FALLBACK_CENTER
  const userCoords =
    userLatitude !== null &&
    userLongitude !== null &&
    !Number.isNaN(userLatitude) &&
    !Number.isNaN(userLongitude)
      ? ([userLatitude, userLongitude] as [number, number])
      : null
  const clinicCoords = hasCoords ? ([latitude as number, longitude as number] as [number, number]) : null

  const routeLine = drivingRoute?.positions ?? null
  const fallbackLine =
    !routeLine && clinicCoords && userCoords ? [userCoords, clinicCoords] : null
  const linePositions = routeLine ?? fallbackLine

  const showSteps = drivingRoute && drivingRoute.steps.length > 0 && userCoords

  return (
    <div className="overflow-hidden rounded-3xl border border-orange-100 shadow-inner shadow-stone-900/10">
      {routeSummary && userCoords ? (
        <div className="flex items-center justify-between gap-3 border-b border-teal-100/80 bg-gradient-to-r from-teal-600 to-teal-700 px-4 py-2.5 text-white">
          <span className="text-xs font-bold uppercase tracking-wide opacity-90">Driving route</span>
          <div className="flex gap-4 text-sm font-bold tabular-nums">
            <span>{routeSummary.distanceLabel}</span>
            <span className="opacity-80">·</span>
            <span>{routeSummary.durationLabel}</span>
          </div>
        </div>
      ) : null}
      <div className="relative h-[min(380px,58vh)] w-full [&_.leaflet-control-attribution]:text-[10px]">
        {routeLoading ? (
          <div className="absolute inset-0 z-[500] flex items-center justify-center bg-white/75 backdrop-blur-[2px]">
            <p className="rounded-full bg-teal-900 px-4 py-2 text-sm font-semibold text-white shadow-lg">
              {routeLoadingLabel}
            </p>
          </div>
        ) : null}
        <MapContainer
          center={center}
          zoom={hasCoords ? 14 : 6}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> · Route OSRM'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitMapToRoute
            clinic={clinicCoords}
            user={userCoords}
            routePositions={linePositions}
          />
          {hasCoords && (
            <Marker position={[latitude as number, longitude as number]}>
              <Popup>{name}</Popup>
            </Marker>
          )}
          {userCoords && (
            <Marker position={userCoords} icon={RouteStartMascotIcon}>
              <Popup>You are here</Popup>
            </Marker>
          )}
          {linePositions && linePositions.length >= 2 && (
            <Polyline
              positions={linePositions}
              pathOptions={{
                color: routeLine ? '#2563eb' : '#0d9488',
                weight: routeLine ? 5 : 3,
                opacity: 0.9,
                lineCap: 'round',
                lineJoin: 'round',
              }}
            />
          )}
        </MapContainer>
      </div>
      {routeFailedLabel && userCoords && !routeLoading && !drivingRoute ? (
        <p className="border-t border-amber-100 bg-amber-50/90 px-4 py-2 text-center text-xs text-amber-900">
          {routeFailedLabel}
        </p>
      ) : null}
      {showSteps ? (
        <div className="max-h-44 overflow-y-auto border-t border-orange-50 bg-stone-50/90">
          <p className="sticky top-0 border-b border-orange-100/80 bg-white/95 px-4 py-2 text-xs font-bold uppercase tracking-wide text-teal-800">
            {turnByTurnTitle}
          </p>
          <ol className="divide-y divide-orange-100/60 px-2 py-1">
            {drivingRoute.steps.map((step, i) => (
              <li key={`${i}-${step.instruction}`} className="flex gap-3 px-2 py-2 text-sm">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-600 text-[11px] font-bold text-white">
                  {i + 1}
                </span>
                <span className="min-w-0 flex-1 text-stone-800">
                  {step.instruction}
                  {step.distanceM > 0 ? (
                    <span className="mt-0.5 block text-xs text-stone-500">
                      {formatDistance(step.distanceM)}
                    </span>
                  ) : null}
                </span>
              </li>
            ))}
          </ol>
        </div>
      ) : null}
      {!hasCoords && (
        <p className="border-t border-orange-50 bg-orange-50/80 px-4 py-3 text-center text-xs text-stone-600">
          {noCoordsLabel}
        </p>
      )}
    </div>
  )
}
