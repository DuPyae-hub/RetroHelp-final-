import L from 'leaflet'
import { useEffect } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import { Polyline, useMap } from 'react-leaflet'
import marker2x from 'leaflet/dist/images/marker-icon-2x.png'
import marker from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'

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
      <div style="position:relative;width:30px;height:30px;border-radius:9999px;background:#ffffff;border:2px solid #0d9488;display:flex;align-items:center;justify-content:center;font-size:17px;animation:rhBob 1.4s ease-in-out infinite;">🧭</div>
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
}

function FitMapToRoute({
  clinic,
  user,
}: {
  clinic: [number, number] | null
  user: [number, number] | null
}) {
  const map = useMap()
  useEffect(() => {
    if (clinic && user) {
      map.fitBounds([clinic, user], { padding: [28, 28] })
      return
    }
    if (clinic) {
      map.setView(clinic, 14)
    }
  }, [clinic, map, user])
  return null
}

export function ClinicMapPanel({
  name,
  latitude,
  longitude,
  noCoordsLabel,
  userLatitude = null,
  userLongitude = null,
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

  return (
    <div className="overflow-hidden rounded-3xl border border-orange-100 shadow-inner shadow-stone-900/10">
      <div className="h-[min(320px,55vh)] w-full [&_.leaflet-control-attribution]:text-[10px]">
        <MapContainer
          center={center}
          zoom={hasCoords ? 14 : 6}
          className="h-full w-full"
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <FitMapToRoute clinic={clinicCoords} user={userCoords} />
          {hasCoords && (
            <Marker position={[latitude as number, longitude as number]}>
              <Popup>{name}</Popup>
            </Marker>
          )}
          {userCoords && (
            <Marker position={userCoords} icon={RouteStartMascotIcon}>
              <Popup>Route start</Popup>
            </Marker>
          )}
          {clinicCoords && userCoords && (
            <Polyline positions={[userCoords, clinicCoords]} pathOptions={{ color: '#0d9488', weight: 4 }} />
          )}
        </MapContainer>
      </div>
      {!hasCoords && (
        <p className="border-t border-orange-50 bg-orange-50/80 px-4 py-3 text-center text-xs text-stone-600">
          {noCoordsLabel}
        </p>
      )}
    </div>
  )
}
