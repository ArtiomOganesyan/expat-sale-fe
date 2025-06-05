import type React from "react"
import { useEffect, useState } from "react"

type Location = {
  lat: number
  lng: number
}

const UserLocationMap: React.FC = () => {
  const [location, setLocation] = useState<Location | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude })
      },
      err => {
        console.warn("Geolocation failed:", err.message)
        setError("Using fallback location.")
        setLocation({ lat: 16.0471, lng: 108.2068 }) // Fallback
      },
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0,
      },
    )
  }, [])

  if (!location) return <p>Loading map...</p>

  const { lat, lng } = location
  const iframeSrc = `https://maps.google.com/maps?q=${lat},${lng}&z=14&output=embed`

  return (
    <div>
      {error && <p>{error}</p>}
      <iframe
        title="user-location-map"
        width="100%"
        height="450"
        src={iframeSrc}
        allowFullScreen
      />
    </div>
  )
}

export default UserLocationMap
