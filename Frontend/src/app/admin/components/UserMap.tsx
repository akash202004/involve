'use client';
import React from 'react';
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
  Line
} from 'react-simple-maps';
import { motion } from 'framer-motion';

const geoUrl = 'https://raw.githubusercontent.com/deldersveld/topojson/master/world-countries.json';

const markers = [
  { markerOffset: -15, name: 'Buenos Aires', coordinates: [-58.3816, -34.6037] },
  { markerOffset: -15, name: 'La Paz', coordinates: [-68.1193, -16.4897] },
  { markerOffset: 25, name: 'Brasilia', coordinates: [-47.8825, -15.7942] },
  { markerOffset: 25, name: 'Santiago', coordinates: [-70.6693, -33.4489] },
  { markerOffset: 25, name: 'Bogota', coordinates: [-74.0721, 4.7110] },
  { markerOffset: 25, name: 'Quito', coordinates: [-78.4678, -0.1807] },
  { markerOffset: -15, name: 'Georgetown', coordinates: [-58.1551, 6.8013] },
  { markerOffset: -15, name: 'Asuncion', coordinates: [-57.5759, -25.2637] },
  { markerOffset: 25, name: 'Paramaribo', coordinates: [-55.2038, 5.8520] },
  { markerOffset: 25, name: 'Montevideo', coordinates: [-56.1645, -34.9011] },
  { markerOffset: -15, name: 'Caracas', coordinates: [-66.9036, 10.4806] },
];

const UserMap = () => {
  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{
        scale: 120,
        center: [0, 20],
      }}
      style={{ width: '100%', height: '100%' }}
    >
      <Geographies 
        geography={geoUrl}
        fill="#1a202c"
        stroke="#4a5568"
        strokeWidth={0.5}
    >
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography key={geo.rsmKey} geography={geo} />
          ))
        }
      </Geographies>
      {markers.map(({ name, coordinates }) => (
        <Marker key={name} coordinates={coordinates}>
          <motion.g
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: Math.random() * 2,
            }}
          >
            <circle r={3} fill="#a855f7" stroke="#c084fc" strokeWidth={1} />
            <circle r={6} fill="#a855f7" stroke="transparent" strokeWidth={1}>
              <animate
                attributeName="r"
                from="3"
                to="10"
                dur="1.5s"
                begin="0s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                from="1"
                to="0"
                dur="1.5s"
                begin="0s"
                repeatCount="indefinite"
              />
            </circle>
          </motion.g>
        </Marker>
      ))}
      {markers.map(({ name, coordinates }) => (
        <Line
            key={`line-${name}`}
            from={[-58.3816, -34.6037]} // Central Point (Buenos Aires for demo)
            to={coordinates}
            stroke="url(#gradient)"
            strokeWidth={1}
            strokeLinecap="round"
        />
        ))}
        <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
                <stop offset="100%" stopColor="#a855f7" stopOpacity="1" />
            </linearGradient>
        </defs>
    </ComposableMap>
  );
};

export default UserMap; 