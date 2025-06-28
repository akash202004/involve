"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useJobTracking } from "@/lib/jobTracking";
import LiveTrackingMap from "../components/LiveTrackingMap";
import EnhancedTrackingDisplay from "../components/EnhancedTrackingDisplay";
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
import Image from "next/image";
import mockWorkers from "../booking/services/mockWorkers";

const JobTrackingPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
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

  const jobId = searchParams.get("jobId");
  const workerId = searchParams.get("workerId");

  useEffect(() => {
    // Connect to socket for real-time updates
    connectSocket();
    // Join user room for job updates (if needed)
  }, [connectSocket]);

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

  if (!currentJob && workerId) {
    return (
      <div className="min-h-screen bg-white pt-24">
        {/* Main Content: Map left, Details right */}
        <div className="max-w-6xl mx-auto px-2 sm:px-4 mt-8 mb-16 flex flex-col md:flex-row gap-8 min-h-[60vh]">
          {/* Map Section */}
          <div className="flex-1 bg-white rounded-xl shadow overflow-hidden flex items-stretch min-h-[300px] md:min-h-[400px]">
            <Image src="/Assets/mocks/map-mock.png" alt="Map" width={900} height={600} className="w-full h-60 md:h-full object-cover" />
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
                <div className="flex justify-between"><span>Provider</span><span className="font-semibold">{mockService.provider}</span></div>
                <div className="flex justify-between"><span>Booking Time</span><span className="font-semibold">{mockService.bookingTime}</span></div>
                <div className="flex justify-between"><span>Status</span><span className="font-semibold">{mockService.status}</span></div>
              </div>
            </div>
            {/* Real-Time Tracking Benefits */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <span>Real-Time Tracking Benefits</span>
              </h2>
              <div className="flex flex-col gap-4 text-sm text-gray-700">
                <div className="flex items-start gap-3">
                  <span className="inline-block bg-yellow-100 text-yellow-700 rounded-full p-2"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#fbbf24" strokeWidth="2" /><path d="M12 6v6l4 2" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
                  <div>
                    <span className="font-semibold">Stay Informed</span>
                    <p>Know exactly when your provider will arrive. No more guessing games.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <span className="inline-block bg-blue-100 text-blue-700 rounded-full p-2"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke="#3b82f6" strokeWidth="2"/><path d="M8 12h8M8 16h5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/></svg></span>
                  <div>
                    <span className="font-semibold">Plan Your Day</span>
                    <p>Accurate ETAs allow you to manage your time effectively.</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Payment Details */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <span>Payment Details</span>
              </h2>
              <div className="text-sm text-gray-700 space-y-2">
                <div className="flex justify-between"><span>Amount</span><span className="font-semibold">₹499</span></div>
                <div className="flex justify-between"><span>Payment Method</span><span className="font-semibold">Online (UPI)</span></div>
                <div className="flex justify-between"><span>Status</span><span className="font-semibold text-green-600">Paid</span></div>
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
          <Image src="/Assets/mocks/map-mock.png" alt="Map" width={900} height={300} className="w-full h-72 object-cover" />
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
            <div className="flex justify-between"><span>Provider</span><span className="font-semibold">{mockService.provider}</span></div>
            <div className="flex justify-between"><span>Booking Time</span><span className="font-semibold">{mockService.bookingTime}</span></div>
            <div className="flex justify-between"><span>Status</span><span className="font-semibold">{mockService.status}</span></div>
          </div>
        </div>
        {/* Real-Time Tracking Benefits */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span>Real-Time Tracking Benefits</span>
          </h2>
          <div className="flex flex-col gap-4 text-sm text-gray-700">
            <div className="flex items-start gap-3">
              <span className="inline-block bg-yellow-100 text-yellow-700 rounded-full p-2"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" stroke="#fbbf24" strokeWidth="2" /><path d="M12 6v6l4 2" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></span>
              <div>
                <span className="font-semibold">Stay Informed</span>
                <p>Know exactly when your provider will arrive. No more guessing games.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="inline-block bg-blue-100 text-blue-700 rounded-full p-2"><svg width="20" height="20" fill="none" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" stroke="#3b82f6" strokeWidth="2"/><path d="M8 12h8M8 16h5" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round"/></svg></span>
              <div>
                <span className="font-semibold">Plan Your Day</span>
                <p>Accurate ETAs allow you to manage your time effectively.</p>
              </div>
            </div>
          </div>
        </div>
        {/* Payment Details */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <span>Payment Details</span>
          </h2>
          <div className="text-sm text-gray-700 space-y-2">
            <div className="flex justify-between"><span>Amount</span><span className="font-semibold">₹499</span></div>
            <div className="flex justify-between"><span>Payment Method</span><span className="font-semibold">Online (UPI)</span></div>
            <div className="flex justify-between"><span>Status</span><span className="font-semibold text-green-600">Paid</span></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobTrackingPage;
