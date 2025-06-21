"use client";

import React, { useEffect, useRef, useState } from "react";
import { useJobTracking } from "@/lib/jobTracking";

interface LiveTrackingMapProps {
  jobId: string;
  className?: string;
}

const LiveTrackingMap: React.FC<LiveTrackingMapProps> = ({
  jobId,
  className = "",
}) => {
  const { workerLocation, currentJob, assignedWorker, isTrackingActive } =
    useJobTracking();
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || map) return;

    const initMap = async () => {
      try {
        // Load Leaflet dynamically
        const L = await import("leaflet");
        await import("leaflet/dist/leaflet.css");

        const mapInstance = L.map(mapRef.current!).setView(
          [22.5726, 88.3639],
          13
        );

        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: "© OpenStreetMap contributors",
        }).addTo(mapInstance);

        setMap(mapInstance);
      } catch (error) {
        console.error("Failed to initialize map:", error);
      }
    };

    initMap();
  }, [map]);

  // Update markers when location changes
  useEffect(() => {
    if (!map) return;

    // Clear existing markers
    markers.forEach((marker) => map.removeLayer(marker));
    const newMarkers: any[] = [];

    // Add job location marker
    if (currentJob) {
      const L = require("leaflet");
      const jobMarker = L.marker([currentJob.lat, currentJob.lng], {
        icon: L.divIcon({
          className: "custom-div-icon",
          html: `<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        }),
      }).addTo(map);

      jobMarker.bindPopup(`
        <div style="text-align: center;">
          <h3 style="margin: 0 0 8px 0; color: #3b82f6;">Job Location</h3>
          <p style="margin: 0; font-size: 14px;">${currentJob.description}</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">${currentJob.address}</p>
        </div>
      `);

      newMarkers.push(jobMarker);
    }

    // Add worker location marker
    if (workerLocation && isTrackingActive) {
      const L = require("leaflet");
      const workerMarker = L.marker([workerLocation.lat, workerLocation.lng], {
        icon: L.divIcon({
          className: "custom-div-icon",
          html: `<div style="background-color: #10b981; width: 24px; height: 24px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;">
            <div style="width: 8px; height: 8px; background-color: white; border-radius: 50%;"></div>
          </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        }),
      }).addTo(map);

      workerMarker.bindPopup(`
        <div style="text-align: center;">
          <h3 style="margin: 0 0 8px 0; color: #10b981;">Worker Location</h3>
          ${
            assignedWorker
              ? `
            <p style="margin: 0; font-size: 14px;"><strong>${assignedWorker.firstName} ${assignedWorker.lastName}</strong></p>
            <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">${assignedWorker.phoneNumber}</p>
          `
              : '<p style="margin: 0; font-size: 14px;">Worker en route</p>'
          }
        </div>
      `);

      newMarkers.push(workerMarker);

      // Fit map to show both markers
      if (currentJob) {
        const bounds = L.latLngBounds([
          [currentJob.lat, currentJob.lng],
          [workerLocation.lat, workerLocation.lng],
        ]);
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }

    setMarkers(newMarkers);
  }, [map, workerLocation, currentJob, assignedWorker, isTrackingActive]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (map) {
        map.remove();
      }
    };
  }, [map]);

  return (
    <div className={`relative ${className}`}>
      <div
        ref={mapRef}
        className="w-full h-96 rounded-lg shadow-lg"
        style={{ minHeight: "400px" }}
      />

      {/* Status overlay */}
      <div className="absolute top-4 left-4 bg-white rounded-lg shadow-md p-3">
        <div className="flex items-center space-x-2">
          <div
            className={`w-3 h-3 rounded-full ${
              isTrackingActive ? "bg-green-500" : "bg-gray-400"
            }`}
          ></div>
          <span className="text-sm font-medium">
            {isTrackingActive ? "Live Tracking Active" : "Waiting for Worker"}
          </span>
        </div>
        {assignedWorker && (
          <p className="text-xs text-gray-600 mt-1">
            {assignedWorker.firstName} {assignedWorker.lastName}
          </p>
        )}
      </div>

      {/* Connection status */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-md p-2">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          <span className="text-xs text-gray-600">Connected</span>
        </div>
      </div>
    </div>
  );
};

export default LiveTrackingMap;
