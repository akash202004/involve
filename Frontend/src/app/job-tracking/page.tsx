"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@civic/auth/react";
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

  const jobId = searchParams.get("jobId");

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    // Connect to socket for real-time updates
    connectSocket();

    // Join user room for job updates
    if (user.id) {
      // This will be handled by the socket manager
    }
  }, [user, router, connectSocket]);

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

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">
            Authentication Required
          </h2>
          <p className="text-gray-600">Please sign in to view job tracking.</p>
        </div>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <FiAlertCircle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
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
    <div className="min-h-screen bg-gray-50">
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
                  Job Tracking
                </h1>
                <p className="text-gray-600">Monitor your service request</p>
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

              {/* View Mode Toggle */}
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("both")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "both"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Both
                </button>
                <button
                  onClick={() => setViewMode("map")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "map"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Map
                </button>
                <button
                  onClick={() => setViewMode("details")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "details"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Details
                </button>
              </div>

              {/* Refresh Button */}
              <button
                onClick={connectSocket}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiRefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Error Alert */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <FiAlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <span className="text-red-700">{error}</span>
              <button
                onClick={clearError}
                className="ml-auto text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Main Content */}
        {viewMode === "both" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Live Map</h2>
              <LiveTrackingMap jobId={currentJob.id} className="h-96" />
            </div>

            {/* Enhanced Tracking Display */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Tracking Details
              </h2>
              <div className="max-h-96 overflow-y-auto">
                <EnhancedTrackingDisplay />
              </div>
            </div>
          </div>
        )}

        {viewMode === "map" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Live Map</h2>
            <LiveTrackingMap
              jobId={currentJob.id}
              className="h-[calc(100vh-200px)]"
            />
          </div>
        )}

        {viewMode === "details" && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">
              Tracking Details
            </h2>
            <EnhancedTrackingDisplay />
          </div>
        )}

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

                {currentJob && (
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-600">Job ID:</span>
                    <span className="font-mono text-gray-900">
                      {currentJob.id}
                    </span>
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
    </div>
  );
};

export default JobTrackingPage;
