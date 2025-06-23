"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@civic/auth/react";
import { useJobTracking } from "@/lib/jobTracking";
import { PageLoadAnimation, PulsingDots } from "@/components/LoadingAnimations";
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

  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [polyline, setPolyline] = useState<any>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [eta, setEta] = useState<number | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isPageLoading, setIsPageLoading] = useState(true);

  const jobId = searchParams.get("jobId");

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

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || map) return;

    const initMap = async () => {
      try {
        // Load Leaflet dynamically
        const L = await import("leaflet");
        await import("leaflet/dist/leaflet.css");

        // Set default location (Kolkata)
        const defaultLat = 22.5726;
        const defaultLng = 88.3639;

        const mapInstance = L.map(mapRef.current!).setView(
          [defaultLat, defaultLng],
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

  // Update map markers and polyline
  useEffect(() => {
    if (!map) return;

    // Clear existing markers and polyline
    markers.forEach((marker) => map.removeLayer(marker));
    if (polyline) map.removeLayer(polyline);

    const newMarkers: any[] = [];
    const L = require("leaflet");

    // Add user location marker
    if (userLocation) {
      const userMarker = L.marker([userLocation.lat, userLocation.lng], {
        icon: L.divIcon({
          className: "custom-div-icon",
          html: `<div style="background-color: #3b82f6; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        }),
      }).addTo(map);

      userMarker.bindPopup(`
        <div style="text-align: center;">
          <h3 style="margin: 0 0 8px 0; color: #3b82f6;">Your Location</h3>
          <p style="margin: 0; font-size: 14px;">You are here</p>
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">${userLocation.lat.toFixed(
            6
          )}, ${userLocation.lng.toFixed(6)}</p>
        </div>
      `);

      newMarkers.push(userMarker);
    }

    // Add worker location marker
    if (workerLocation && isTrackingActive) {
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
          <p style="margin: 4px 0 0 0; font-size: 12px; color: #666;">${workerLocation.lat.toFixed(
            6
          )}, ${workerLocation.lng.toFixed(6)}</p>
        </div>
      `);

      newMarkers.push(workerMarker);

      // Draw line between user and worker
      if (userLocation) {
        const line = L.polyline(
          [
            [userLocation.lat, userLocation.lng],
            [workerLocation.lat, workerLocation.lng],
          ],
          {
            color: "#ef4444",
            weight: 3,
            opacity: 0.8,
            dashArray: "10, 5",
          }
        ).addTo(map);

        setPolyline(line);

        // Fit map to show both markers
        const bounds = L.latLngBounds([
          [userLocation.lat, userLocation.lng],
          [workerLocation.lat, workerLocation.lng],
        ]);
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }

    setMarkers(newMarkers);
  }, [map, workerLocation, userLocation, isTrackingActive, assignedWorker]);

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
                ref={mapRef}
                className="w-full h-[calc(100vh-300px)] rounded-lg"
                style={{ minHeight: "500px" }}
              />
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
    </div>
  );
};

export default JobTrackingMapPage;
