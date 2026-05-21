/** External map apps — optional origin for real turn-by-turn in Google/Apple Maps. */

export function externalDirectionLinks(
  destLat: number,
  destLng: number,
  origin?: { lat: number; lng: number } | null,
) {
  const dest = `${destLat},${destLng}`
  const params = new URLSearchParams()
  params.set('api', '1')
  params.set('destination', dest)
  params.set('travelmode', 'driving')
  if (origin) {
    params.set('origin', `${origin.lat},${origin.lng}`)
  }

  const google = `https://www.google.com/maps/dir/?${params.toString()}`

  let apple = `https://maps.apple.com/?daddr=${encodeURIComponent(dest)}&dirflg=d`
  if (origin) {
    apple = `https://maps.apple.com/?saddr=${encodeURIComponent(`${origin.lat},${origin.lng}`)}&daddr=${encodeURIComponent(dest)}&dirflg=d`
  }

  return { google, apple }
}
