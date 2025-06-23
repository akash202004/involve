"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@civic/auth/react";
import { useJobTracking } from "@/lib/jobTracking";
import LiveTrackingMap from "../components/LiveTrackingMap";
import EnhancedTrackingDisplay from "../components/EnhancedTrackingDisplay";
import {
  FiArrowLeft,
  FiRefreshCw,
  FiMaximize2,
  FiMinimize2,
  FiMap,
  FiList,
} from "react-icons/fi";

const TrackingDashboard: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useUser();
  const {
    currentJob,
    isSocketConnected,
    connectSocket,
    error,
    clearError,
  } = useJobTracking();

  const [viewMode, setViewMode] = useState<"split" | "map" | "details">("split");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const jobId = searchParams.get("jobId");

  useEffect(() => {
    if (!user) {
      router.push("/");
      return;
    }

    // Connect to socket for real-time updates
    connectSocket();
  }, [user, router, connectSocket]);

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

  // Handle view mode changes
  const handleViewModeChange = (mode: "split" | "map" | "details") => {
    setViewMode(mode);
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiArrowLeft className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-semibold mb-2">Authentication Required</h2>
          <p className="text-gray-600">Please sign in to view tracking dashboard.</p>
        </div>
      </div>
    );
  }

  if (!currentJob) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiMap className="w-8 h-8 text-yellow-500" />
          </div>
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
    <div className={`min-h-screen bg-gray-50 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <FiArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Live Tracking Dashboard</h1>
                <p className="text-gray-600">Real-time job monitoring</p>
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
                  onClick={() => handleViewModeChange("split")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "split"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Split
                </button>
                <button
                  onClick={() => handleViewModeChange("map")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "map"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FiMap className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleViewModeChange("details")}
                  className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                    viewMode === "details"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>

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

      {/* Error Alert */}
      {error && (
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
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
        {viewMode === "split" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Live Map</h2>
              <LiveTrackingMap
                jobId={currentJob.id}
                className="h-96"
              />
            </div>
            
            {/* Details Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Tracking Details</h2>
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
            <h2 className="text-lg font-semibold text-gray-900">Tracking Details</h2>
            <EnhancedTrackingDisplay />
          </div>
        )}
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
                  {isSocketConnected ? "Live Updates Active" : "Connection Lost"}
                </span>
              </div>
              
              {currentJob && (
                <div className="flex items-center space-x-2">
                  <span className="text-gray-600">Job ID:</span>
                  <span className="font-mono text-gray-900">{currentJob.id}</span>
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

export default TrackingDashboard;
