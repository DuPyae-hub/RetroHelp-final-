import L from 'leaflet'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
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

const FALLBACK_CENTER: [number, number] = [21.9162, 95.956]

type Props = {
  name: string
  latitude: number | null
  longitude: number | null
  noCoordsLabel: string
}

export function ClinicMapPanel({ name, latitude, longitude, noCoordsLabel }: Props) {
  const hasCoords =
    latitude !== null &&
    longitude !== null &&
    !Number.isNaN(latitude) &&
    !Number.isNaN(longitude)

  const center: [number, number] = hasCoords
    ? [latitude as number, longitude as number]
    : FALLBACK_CENTER

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
          {hasCoords && (
            <Marker position={[latitude as number, longitude as number]}>
              <Popup>{name}</Popup>
            </Marker>
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
