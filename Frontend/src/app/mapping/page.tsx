"use client"; // This is required because maps are interactive client-side components

import React from 'react';
// Import components from the react-leaflet library
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

// We must import the Leaflet CSS for the map to look correct
import "leaflet/dist/leaflet.css";

// Import the Icon type from the leaflet library itself
import { Icon } from 'leaflet';

// This is a common fix for an issue where default marker icons don't appear correctly.
const customMarkerIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});


// This is your Page component. It now contains all the map logic.
export default function MappingPage() {
  
  // 1. Define the position for the map's center (Latitude, Longitude)
  //    Let's use a central location in India, like Delhi.
  const position: [number, number] = [28.6139, 77.2090]; 

  return (
    // 2. Render the MapContainer. It MUST have a defined CSS height to be visible.
    <MapContainer 
      center={position} 
      zoom={13} 
      style={{ height: '100vh', width: '100%' }} // Fills the entire screen
    >
      {/* 3. Add the TileLayer, which provides the actual map images */}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* 4. Add a Marker at the specified position with a pop-up message */}
      <Marker position={position} icon={customMarkerIcon}>
        <Popup>
          India Gate, New Delhi.
        </Popup>
      </Marker>
    </MapContainer>
  );
}