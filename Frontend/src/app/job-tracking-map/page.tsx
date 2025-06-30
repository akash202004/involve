"use client";

import React, { useEffect, useRef, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useJobTracking } from "@/lib/jobTracking";
import { PageLoadAnimation, PulsingDots } from "@/components/LoadingAnimations";
import "leaflet/dist/leaflet.css";
import {
  FiMapPin,
  FiPhone,
  FiClock,
  FiUser,
  FiCheckCircle,
  FiAlertCircle,
  FiNavigation,
  FiRefreshCw,
  FiMaximize2,
  FiMinimize2,
} from "react-icons/fi";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMap,
  Polyline,
  CircleMarker,
  useMapEvent,
} from "react-leaflet";
import L, { LatLngExpression } from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";

// Map click handler component
function MapClickHandler({
  onMapClick,
}: {
  onMapClick: (latlng: { lat: number; lng: number }) => void;
}) {
  useMapEvent("click", (e) => {
    onMapClick({ lat: e.latlng.lat, lng: e.latlng.lng });
  });
  return null;
}

const JobTrackingMapPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const {
    currentJob,
    assignedWorker,
    isJobAccepted,
    isTrackingActive,
    workerLocation,
    lastLocationUpdate,
    isSocketConnected,
    connectSocket,
    error,
    clearError,
  } = useJobTracking();

  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [eta, setEta] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const jobId = searchParams.get("jobId");

  // Custom icons for markers
  const userIcon = useMemo(
    () =>
      L.divIcon({
        className: "user-location-icon",
        html: renderToStaticMarkup(
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "20px",
              height: "20px",
            }}
          >
            <div
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                background: "#3b82f6",
                border: "3px solid white",
                boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
              }}
            ></div>
          </div>
        ),
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      }),
    []
  );

  const workerIcon = useMemo(
    () =>
      L.divIcon({
        className: "worker-location-icon",
        html: renderToStaticMarkup(
          <div
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "24px",
              height: "24px",
            }}
          >
            <div
              style={{
                position: "absolute",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                background: "rgba(16, 185, 129, 0.25)",
                animation: "pulse-ring 2s ease-out infinite",
              }}
            ></div>
            <div
              style={{
                width: "12px",
                height: "12px",
                borderRadius: "50%",
                background: "#10b981",
                border: "2px solid #fff",
              }}
            ></div>
          </div>
        ),
        iconSize: [24, 24],
        iconAnchor: [12, 12],
      }),
    []
  );

  // Calculate route between user and worker
  const route = useMemo(() => {
    if (!userLocation || !workerLocation || !isTrackingActive) return null;
    
    return [
      [userLocation.lat, userLocation.lng] as [number, number],
      [workerLocation.lat, workerLocation.lng] as [number, number],
    ];
  }, [userLocation, workerLocation, isTrackingActive]);

  // Debug route data
  console.log("🗺️ TrackingMap received route:", route);
  console.log("🗺️ Route type:", typeof route);
  console.log("🗺️ Route length:", route?.length);
  if (route && route.length > 0) {
    console.log("🗺️ First route coordinate:", route[0]);
    console.log("🗺️ Last route coordinate:", route[route.length - 1]);
    console.log(
      "🗺️ Route coordinates format check:",
      route.every((coord) => Array.isArray(coord) && coord.length === 2)
    );
  }

  // Calculate route distance and ETA
  const routeInfo = useMemo(() => {
    if (!route || route.length < 2) return null;

    let totalDistance = 0;
    for (let i = 1; i < route.length; i++) {
      const prev = route[i - 1] as [number, number];
      const curr = route[i] as [number, number];
      const lat1 = (prev[0] * Math.PI) / 180;
      const lat2 = (curr[0] * Math.PI) / 180;
      const deltaLat = ((curr[0] - prev[0]) * Math.PI) / 180;
      const deltaLng = ((curr[1] - prev[1]) * Math.PI) / 180;

      const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) *
          Math.cos(lat2) *
          Math.sin(deltaLng / 2) *
          Math.sin(deltaLng / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      totalDistance += 6371 * c; // Earth's radius in km
    }

    const etaMinutes = Math.round(totalDistance * 3); // Assume 20 km/h average speed

    return {
      distance: totalDistance.toFixed(1),
      eta: etaMinutes,
    };
  }, [route]);

  // Validate route before rendering
  const validRoute =
    route &&
    route.length > 0 &&
    route.every(
      (coord) =>
        Array.isArray(coord) &&
        coord.length === 2 &&
        typeof coord[0] === "number" &&
        typeof coord[1] === "number"
    );

  console.log("🗺️ Valid route for rendering:", validRoute);
  if (validRoute) {
    console.log("🗺️ Rendering polyline with coordinates:", route);
  }

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    // Show loading animation for a short time
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 2000);

    // Connect to socket for real-time updates
    connectSocket();

    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error("Error getting user location:", error);
          // Use job location as fallback
          if (currentJob) {
            setUserLocation({ lat: currentJob.lat, lng: currentJob.lng });
          }
        }
      );
    }

    return () => clearTimeout(timer);
  }, [user, router, connectSocket, currentJob]);

  // Calculate distance and ETA
  useEffect(() => {
    if (!workerLocation || !userLocation) {
      setDistance(null);
      setEta(null);
      return;
    }

    // Haversine formula for accurate distance calculation
    const R = 6371; // Earth's radius in kilometers
    const lat1 = (userLocation.lat * Math.PI) / 180;
    const lat2 = (workerLocation.lat * Math.PI) / 180;
    const deltaLat = ((workerLocation.lat - userLocation.lat) * Math.PI) / 180;
    const deltaLng = ((workerLocation.lng - userLocation.lng) * Math.PI) / 180;

    const a =
      Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
      Math.cos(lat1) *
        Math.cos(lat2) *
        Math.sin(deltaLng / 2) *
        Math.sin(deltaLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const calculatedDistance = R * c;

    setDistance(calculatedDistance);

    // Calculate ETA (assuming average speed of 20 km/h in city)
    const averageSpeed = 20; // km/h
    const etaMinutes = Math.round((calculatedDistance / averageSpeed) * 60);
    setEta(etaMinutes);
  }, [workerLocation, userLocation]);

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Format duration
  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  // Handle map click
  const handleMapClick = (latlng: { lat: number; lng: number }) => {
    console.log("Map clicked at:", latlng);
  };

  // Show page loading animation
  if (isPageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <PageLoadAnimation />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600">Please sign in to view tracking map.</p>
        </div>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiMapPin className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Active Job</h2>
          <p className="text-gray-600 mb-4">
            No active job found for tracking.
          </p>
          <button
            onClick={() => router.push("/booking/services")}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Book a Service
          </button>
        </div>
      </div>
    );
  }

  // Determine map center and zoom
  const mapCenter = userLocation || [22.5726, 88.3639]; // Default to Kolkata
  const mapZoom = userLocation && workerLocation ? 13 : 10;

  return (
    <div
      className={`min-h-screen bg-gray-50 ${
        isFullscreen ? "fixed inset-0 z-50" : ""
      }`}
    >
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiAlertCircle className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  Live Tracking Map
                </h1>
                <p className="text-gray-600">Real-time location tracking</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Connection Status */}
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isSocketConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-sm text-gray-600">
                  {isSocketConnected ? "Connected" : "Disconnected"}
                </span>
              </div>

              {/* Refresh Button */}
              <button
                onClick={connectSocket}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiRefreshCw className="w-5 h-5 text-gray-600" />
              </button>

              {/* Fullscreen Toggle */}
              <button
                onClick={toggleFullscreen}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                {isFullscreen ? (
                  <FiMinimize2 className="w-5 h-5 text-gray-600" />
                ) : (
                  <FiMaximize2 className="w-5 h-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <FiAlertCircle className="w-5 h-5 text-red-500" />
                <span className="text-red-700">{error}</span>
              </div>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Map Section */}
          <div className="lg:col-span-3 space-y-4">
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Live Map
              </h2>
              <div
                className="w-full h-[calc(100vh-300px)] rounded-lg"
                style={{ minHeight: "500px" }}
              >
                <MapContainer
                  center={mapCenter}
                  zoom={mapZoom}
                  style={{ height: "100%", width: "100%" }}
                >
                  <MapClickHandler onMapClick={handleMapClick} />
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  
                  {/* User location marker */}
                  {userLocation && (
                    <Marker position={userLocation} icon={userIcon}>
                      <Popup>
                        <div style={{ textAlign: "center" }}>
                          <h3 style={{ margin: "0 0 8px 0", color: "#3b82f6" }}>Your Location</h3>
                          <p style={{ margin: "0", fontSize: "14px" }}>You are here</p>
                          <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#666" }}>
                            {userLocation.lat.toFixed(6)}, {userLocation.lng.toFixed(6)}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {/* Worker location marker */}
                  {workerLocation && isTrackingActive && (
                    <Marker position={workerLocation} icon={workerIcon}>
                      <Popup>
                        <div style={{ textAlign: "center" }}>
                          <h3 style={{ margin: "0 0 8px 0", color: "#10b981" }}>Worker Location</h3>
                          {assignedWorker ? (
                            <>
                              <p style={{ margin: "0", fontSize: "14px" }}>
                                <strong>{assignedWorker.firstName} {assignedWorker.lastName}</strong>
                              </p>
                              <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#666" }}>
                                {assignedWorker.phoneNumber}
                              </p>
                            </>
                          ) : (
                            <p style={{ margin: "0", fontSize: "14px" }}>Worker en route</p>
                          )}
                          <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#666" }}>
                            {workerLocation.lat.toFixed(6)}, {workerLocation.lng.toFixed(6)}
                          </p>
                        </div>
                      </Popup>
                    </Marker>
                  )}

                  {/* Route polyline */}
                  {validRoute && (
                    <Polyline
                      positions={route}
                      color="#ef4444"
                      weight={3}
                      opacity={0.8}
                      dashArray="10, 5"
                    />
                  )}

                  {/* Route Info Overlay */}
                  {routeInfo && validRoute && (
                    <div
                      style={{
                        position: "absolute",
                        top: "20px",
                        left: "50%",
                        transform: "translateX(-50%)",
                        background: "white",
                        color: "#2563eb",
                        padding: "8px 18px",
                        borderRadius: "20px",
                        fontWeight: 600,
                        fontSize: "16px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        zIndex: 1000,
                        border: "2px solid #2563eb",
                      }}
                    >
                      🚗 {routeInfo.distance} km &nbsp; | &nbsp; ⏱ {routeInfo.eta} min
                    </div>
                  )}
                </MapContainer>
              </div>
            </div>
          </div>

          {/* Tracking Info Panel */}
          <div className="space-y-4">
            {/* Connection Status */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Connection Status
              </h3>
              <div className="flex items-center space-x-2 mb-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isSocketConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-sm">
                  {isSocketConnected
                    ? "Live Updates Active"
                    : "Connection Lost"}
                </span>
              </div>
              {lastLocationUpdate && (
                <p className="text-xs text-gray-500">
                  Last update:{" "}
                  {new Date(lastLocationUpdate).toLocaleTimeString()}
                </p>
              )}
            </div>

            {/* Distance & ETA */}
            {distance !== null && (
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Distance & ETA
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <FiNavigation className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold text-blue-600">
                        {distance.toFixed(1)} km
                      </p>
                      <p className="text-xs text-gray-500">
                        Distance to worker
                      </p>
                    </div>
                  </div>
                  {eta !== null && (
                    <div className="flex items-center space-x-2">
                      <FiClock className="w-5 h-5 text-green-600" />
                      <div>
                        <p className="text-2xl font-bold text-green-600">
                          {formatDuration(eta)}
                        </p>
                        <p className="text-xs text-gray-500">
                          Estimated arrival
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Job Details */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Job Details</h3>
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-gray-600">Service:</span>
                  <p className="font-medium">{currentJob.description}</p>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        currentJob.status === "completed"
                          ? "bg-green-500"
                          : currentJob.status === "in_progress"
                          ? "bg-blue-500"
                          : currentJob.status === "confirmed"
                          ? "bg-yellow-500"
                          : "bg-gray-500"
                      }`}
                    />
                    <span className="font-medium capitalize">
                      {currentJob.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
                <div>
                  <span className="text-gray-600">Location:</span>
                  <p className="font-medium">{currentJob.location}</p>
                </div>
              </div>
            </div>

            {/* Worker Info */}
            {assignedWorker && (
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3">
                  Assigned Worker
                </h3>
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiUser className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">
                      {assignedWorker.firstName} {assignedWorker.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {assignedWorker.experienceYears} years experience
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <FiPhone className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-600">
                    {assignedWorker.phoneNumber}
                  </span>
                </div>
              </div>
            )}

            {/* Tracking Status */}
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">
                Tracking Status
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Live Tracking</span>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        isTrackingActive ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    <span className="font-medium">
                      {isTrackingActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Worker Location</span>
                  <span className="font-medium">
                    {workerLocation ? "Available" : "Not available"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Your Location</span>
                  <span className="font-medium">
                    {userLocation ? "Available" : "Not available"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Real-time Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isSocketConnected ? "bg-green-500" : "bg-red-500"
                  }`}
                />
                <span className="text-gray-600">
                  {isSocketConnected
                    ? "Live Updates Active"
                    : "Connection Lost"}
                </span>
              </div>

              {distance !== null && (
                <div className="flex items-center space-x-2">
                  <FiNavigation className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-600">Distance:</span>
                  <span className="font-medium">{distance.toFixed(1)} km</span>
                </div>
              )}

              {eta !== null && (
                <div className="flex items-center space-x-2">
                  <FiClock className="w-4 h-4 text-green-600" />
                  <span className="text-gray-600">ETA:</span>
                  <span className="font-medium">{formatDuration(eta)}</span>
                </div>
              )}

              {isTrackingActive && (
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-gray-600">Live Tracking Active</span>
                </div>
              )}
            </div>

            <div className="text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* CSS Styles for Map */}
      <style jsx global>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(0.33);
            opacity: 1;
          }
          80%, 100% {
            opacity: 0;
          }
        }

        .worker-location-icon {
          animation: pulse-ring 2s ease-out infinite;
        }

        .user-location-icon {
          z-index: 1000;
        }

        .leaflet-popup-content-wrapper {
          border-radius: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .leaflet-popup-content {
          margin: 8px 12px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }

        .leaflet-popup-tip {
          background: white;
        }

        .leaflet-popup-close-button {
          color: #666;
          font-size: 18px;
          font-weight: bold;
        }

        .leaflet-popup-close-button:hover {
          color: #333;
        }
      `}</style>
    </div>
  );
};

export default JobTrackingMapPage;
