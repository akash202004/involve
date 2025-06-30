"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { useJobTracking } from "@/lib/jobTracking";
import "leaflet/dist/leaflet.css";
import {
  FiMapPin,
  FiPhone,
  FiClock,
  FiUser,
  FiCheckCircle,
  FiAlertCircle,
  FiRefreshCw,
  FiMaximize2,
} from "react-icons/fi";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMapEvent,
} from "react-leaflet";
import L from "leaflet";
import { renderToStaticMarkup } from "react-dom/server";
import Image from "next/image";
import mockWorkers from "../booking/services/mockWorkers";

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

const JobTrackingPage: React.FC = () => {
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

  const [viewMode, setViewMode] = useState<"map" | "details" | "both">("both");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const jobId = searchParams.get("jobId");
  const workerId = searchParams.get("workerId");
  const paymentMethod = searchParams.get("paymentMethod") || "online"; // Default to online if not specified

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

  // Determine payment details based on payment method
  const getPaymentDetails = () => {
    if (paymentMethod === "cash") {
      return {
        method: "Cash on Delivery",
        status: "Pending",
        statusColor: "text-orange-600"
      };
    } else {
      return {
        method: "Online (UPI)",
        status: "Paid",
        statusColor: "text-green-600"
      };
    }
  };

  const paymentDetails = getPaymentDetails();

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

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
  }, [user, router, connectSocket, currentJob]);

  // Handle map click
  const handleMapClick = (latlng: { lat: number; lng: number }) => {
    console.log("Map clicked at:", latlng);
  };

  // Determine map center and zoom
  const mapCenter = userLocation ? [userLocation.lat, userLocation.lng] as [number, number] : [22.5726, 88.3639] as [number, number]; // Default to Kolkata
  const mapZoom = userLocation && workerLocation ? 13 : 10;

  // Format time
  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  // Calculate ETA (simple calculation)
  const calculateETA = () => {
    if (!workerLocation || !currentJob) return null;

    // Simple distance calculation (Haversine formula would be better)
    const latDiff = Math.abs(workerLocation.lat - currentJob.lat);
    const lngDiff = Math.abs(workerLocation.lng - currentJob.lng);
    const distance = Math.sqrt(latDiff * latDiff + lngDiff * lngDiff) * 111; // Rough km conversion

    // Assume average speed of 20 km/h in city
    const etaMinutes = Math.round(distance * 3);
    return etaMinutes;
  };

  // --- MOCK DATA for UI DEMO (replace with real data as needed) ---
  const mockService = {
    name: "Plumbing Repair",
    provider: "Alex Johnson",
    bookingTime: "Today, 2:00 PM",
    status: "In Progress",
    eta: 15,
    orderId: "#65123456789",
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600">Please sign in to view tracking.</p>
        </div>
      </div>
    );
  }

  if (!currentJob && workerId) {
    return (
      <div className="min-h-screen bg-white pt-24">
        {/* Main Content: Map left, Details right */}
        <div className="max-w-6xl mx-auto px-2 sm:px-4 mt-8 mb-16 flex flex-col md:flex-row gap-8 min-h-[60vh]">
          {/* Map Section */}
          <div className="flex-1 bg-white rounded-xl shadow overflow-hidden flex items-stretch min-h-[300px] md:min-h-[400px]">
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
                    </div>
                  </Popup>
                </Marker>
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

          {/* Details Section */}
          <div className="flex-1 flex flex-col gap-6 min-w-0">
            {/* Status Card */}
            <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-lg">Service in Progress</span>
                <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">En Route</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: "70%" }} />
              </div>
              <span className="text-gray-600 text-sm">Estimated arrival <span className="text-blue-600 font-semibold">{mockService.eta} minutes</span></span>
            </div>
            {/* Service Details */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <span>Service Details</span>
              </h2>
              <div className="text-sm text-gray-700 space-y-2">
                <div className="flex justify-between"><span>Order ID</span><span className="font-mono font-semibold">{mockService.orderId}</span></div>
                <div className="flex justify-between"><span>Service</span><span className="font-semibold">{mockService.name}</span></div>
                <div className="flex justify-between"><span>Booking Time</span><span className="font-semibold">{mockService.bookingTime}</span></div>
                <div className="flex justify-between"><span>Status</span><span className="font-semibold">{mockService.status}</span></div>
              </div>
            </div>
            {/* Worker Details */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <FiUser className="w-5 h-5 text-gray-600" />
                <span>Worker Details</span>
              </h2>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                  <Image 
                    src={mockWorkers[0].avatar} 
                    alt={mockWorkers[0].name}
                    width={64}
                    height={64}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-800 text-lg">{mockWorkers[0].name}</h3>
                  <p className="text-gray-600 text-sm">{mockWorkers[0].description}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-yellow-500 text-sm">★★★★☆</span>
                    <span className="text-gray-500 text-sm">4.0 (120 reviews)</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button 
                  className="flex-1 flex items-center justify-center gap-1.5 bg-yellow-500 border border-black text-white py-1 px-2.5 rounded-md font-medium transition-colors duration-200 hover:bg-yellow-600 text-xs"
                  onClick={() => {
                    // Navigate to chat page
                    router.push(`/chat?workerId=${mockWorkers[0].id}&workerName=${encodeURIComponent(mockWorkers[0].name)}`);
                  }}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Message
                </button>
                <button 
                  className="flex-1 flex items-center justify-center gap-1.5 bg-yellow-500 border border-black text-white py-1 px-2.5 rounded-md font-medium transition-colors duration-200 hover:bg-yellow-600 text-xs"
                  onClick={() => {
                    // Initiate phone call
                    const phoneNumber = mockWorkers[0].phoneNumber || '+1234567890';
                    window.open(`tel:${phoneNumber}`, '_self');
                  }}
                >
                  <FiPhone className="w-3 h-3" />
                  Call
                </button>
              </div>
            </div>
            {/* Payment Details */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <span>Payment Details</span>
              </h2>
              <div className="text-sm text-gray-700 space-y-2">
                <div className="flex justify-between"><span>Amount</span><span className="font-semibold">₹499</span></div>
                <div className="flex justify-between"><span>Payment Method</span><span className="font-semibold">{paymentDetails.method}</span></div>
                <div className="flex justify-between"><span>Status</span><span className="font-semibold {paymentDetails.statusColor}">{paymentDetails.status}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-32">
      {/* Status Card */}
      <div className="max-w-2xl mx-auto px-4 mt-6">
        <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
          <div className="flex items-center justify-between mb-2">
            <span className="font-semibold text-lg">Service in Progress</span>
            <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">En Route</span>
          </div>
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
            <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: "70%" }} />
          </div>
          <span className="text-gray-600 text-sm">Estimated arrival <span className="text-blue-600 font-semibold">{mockService.eta} minutes</span></span>
        </div>
      </div>

      {/* Map Section */}
      <div className="max-w-4xl mx-auto px-4 mt-8">
        <div className="bg-white rounded-xl shadow overflow-hidden">
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
                  </div>
                </Popup>
              </Marker>
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

      {/* Details and Benefits */}
      <div className="max-w-4xl mx-auto px-4 mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Service Details */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span>Service Details</span>
          </h2>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex justify-between"><span>Order ID</span><span className="font-mono font-semibold">{mockService.orderId}</span></div>
            <div className="flex justify-between"><span>Service</span><span className="font-semibold">{mockService.name}</span></div>
            <div className="flex justify-between"><span>Booking Time</span><span className="font-semibold">{mockService.bookingTime}</span></div>
            <div className="flex justify-between"><span>Status</span><span className="font-semibold">{mockService.status}</span></div>
          </div>
        </div>
        {/* Worker Details */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <FiUser className="w-5 h-5 text-gray-600" />
            <span>Worker Details</span>
          </h2>
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
              <Image 
                src={mockWorkers[0].avatar} 
                alt={mockWorkers[0].name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 text-lg">{mockWorkers[0].name}</h3>
              <p className="text-gray-600 text-sm">{mockWorkers[0].description}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-yellow-500 text-sm">★★★★☆</span>
                <span className="text-gray-500 text-sm">4.0 (120 reviews)</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button 
              className="flex-1 flex items-center justify-center gap-1.5 bg-yellow-500 border border-black text-white py-1 px-2.5 rounded-md font-medium transition-colors duration-200 hover:bg-yellow-600 text-xs"
              onClick={() => {
                // Navigate to chat page
                router.push(`/chat?workerId=${mockWorkers[0].id}&workerName=${encodeURIComponent(mockWorkers[0].name)}`);
              }}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              Message
            </button>
            <button 
              className="flex-1 flex items-center justify-center gap-1.5 bg-yellow-500 border border-black text-white py-1 px-2.5 rounded-md font-medium transition-colors duration-200 hover:bg-yellow-600 text-xs"
              onClick={() => {
                // Initiate phone call
                const phoneNumber = mockWorkers[0].phoneNumber || '+1234567890';
                window.open(`tel:${phoneNumber}`, '_self');
              }}
            >
              <FiPhone className="w-3 h-3" />
              Call
            </button>
          </div>
        </div>
        {/* Payment Details */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span>Payment Details</span>
          </h2>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex justify-between"><span>Amount</span><span className="font-semibold">₹499</span></div>
            <div className="flex justify-between"><span>Payment Method</span><span className="font-semibold">{paymentDetails.method}</span></div>
            <div className="flex justify-between"><span>Status</span><span className="font-semibold {paymentDetails.statusColor}">{paymentDetails.status}</span></div>
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

export default JobTrackingPage;
