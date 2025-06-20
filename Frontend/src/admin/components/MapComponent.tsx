'use client'

import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api'

const containerStyle = {
  width: '100%',
  height: '400px'
}

interface Location {
  lat: number
  lng: number
  count: number
}

interface MapComponentProps {
  locations: Location[]
}

export default function MapComponent({ locations }: MapComponentProps) {
  // Calculate center based on locations
  const center = locations.length > 0 
    ? { 
        lat: locations.reduce((sum, loc) => sum + loc.lat, 0) / locations.length,
        lng: locations.reduce((sum, loc) => sum + loc.lng, 0) / locations.length
      }
    : { lat: 20.5937, lng: 78.9629 } // Default to India center

  return (
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={locations.length > 0 ? 10 : 5}
      >
        {locations.map((location, index) => (
          <Marker
            key={index}
            position={{ lat: location.lat, lng: location.lng }}
            label={{
              text: location.count.toString(),
              color: 'white',
              fontWeight: 'bold',
            }}
            icon={{
              url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
              labelOrigin: new google.maps.Point(11, 11),
            }}
          />
        ))}
      </GoogleMap>
    </LoadScript>
  )
}