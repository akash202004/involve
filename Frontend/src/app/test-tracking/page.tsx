"use client";

import React, { useEffect, useState } from "react";
import { useJobTracking } from "@/lib/jobTracking";
import LiveTrackingMap from "../components/LiveTrackingMap";
import EnhancedTrackingDisplay from "../components/EnhancedTrackingDisplay";
import {
  FiPlay,
  FiSquare,
  FiRefreshCw,
  FiMap,
  FiList,
  FiMaximize2,
} from "react-icons/fi";

const TestTrackingPage: React.FC = () => {
  const {
    currentJob,
    assignedWorker,
    isJobAccepted,
    isTrackingActive,
    workerLocation,
    lastLocationUpdate,
    isSocketConnected,
    connectSocket,
    disconnectSocket,
    createJob,
    acceptJob,
    updateLocation,
    completeJob,
    error,
    clearError,
  } = useJobTracking();

  const [testMode, setTestMode] = useState<"simulate" | "manual">("simulate");
  const [viewMode, setViewMode] = useState<"split" | "map" | "details">(
    "split"
  );
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationInterval, setSimulationInterval] =
    useState<NodeJS.Timeout | null>(null);

  // Test job data
  const testJobData = {
    userId: "test-user-123",
    description: "Test Service - Plumbing Repair",
    location: "123 Test Street, Test City",
    lat: 22.5726,
    lng: 88.3639,
    bookedFor: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
    durationMinutes: 120,
  };

  // Simulate location updates
  const simulateLocationUpdates = () => {
    if (!currentJob) return;

    const startLat = 22.5726;
    const startLng = 88.3639;
    const endLat = currentJob.lat;
    const endLng = currentJob.lng;

    let progress = 0;
    const interval = setInterval(() => {
      progress += 0.02; // Move 2% closer each update

      if (progress >= 1) {
        clearInterval(interval);
        setIsSimulating(false);
        setSimulationInterval(null);
        return;
      }

      const currentLat = startLat + (endLat - startLat) * progress;
      const currentLng = startLng + (endLng - startLng) * progress;

      // Use a real worker ID if available, otherwise use a test ID
      const workerId = assignedWorker?.id || "test-worker-456";
      updateLocation(currentJob.id, workerId, currentLat, currentLng);
    }, 2000); // Update every 2 seconds

    setSimulationInterval(interval);
  };

  // Start simulation
  const startSimulation = async () => {
    try {
      // Create a test job
      const job = await createJob(testJobData);
      console.log("Test job created:", job);

      // Accept the job with a test worker ID
      const testWorkerId = "test-worker-456";
      acceptJob(job.id, testWorkerId);
      console.log("Job accepted by test worker");

      // Start location simulation
      setIsSimulating(true);
      simulateLocationUpdates();
    } catch (err) {
      console.error("Simulation failed:", err);
    }
  };

  // Stop simulation
  const stopSimulation = () => {
    if (simulationInterval) {
      clearInterval(simulationInterval);
      setSimulationInterval(null);
    }
    setIsSimulating(false);

    if (currentJob) {
      const workerId = assignedWorker?.id || "test-worker-456";
      completeJob(currentJob.id, workerId);
    }
  };

  // Manual location update
  const updateManualLocation = () => {
    if (!currentJob) return;

    const lat = 22.5726 + (Math.random() - 0.5) * 0.01;
    const lng = 88.3639 + (Math.random() - 0.5) * 0.01;

    const workerId = assignedWorker?.id || "test-worker-456";
    updateLocation(currentJob.id, workerId, lat, lng);
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (simulationInterval) {
        clearInterval(simulationInterval);
      }
    };
  }, [simulationInterval]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Live Tracking Test</h1>

        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="flex items-center space-x-2 mb-4">
            <div
              className={`w-3 h-3 rounded-full ${
                isSocketConnected ? "bg-green-500" : "bg-red-500"
              }`}
            />
            <span>{isSocketConnected ? "Connected" : "Disconnected"}</span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={connectSocket}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Connect
            </button>
            <button
              onClick={disconnectSocket}
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Disconnect
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <span className="text-red-700">{error}</span>
              <button
                onClick={clearError}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          </div>
        )}

        {/* Test Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Controls</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Simulation Mode */}
            <div>
              <h3 className="font-medium mb-3">Simulation Mode</h3>
              <div className="space-y-2">
                <button
                  onClick={startSimulation}
                  disabled={isSimulating}
                  className={`w-full px-4 py-2 rounded flex items-center justify-center space-x-2 ${
                    isSimulating
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-green-600 text-white hover:bg-green-700"
                  }`}
                >
                  <FiPlay className="w-4 h-4" />
                  <span>
                    {isSimulating ? "Simulating..." : "Start Simulation"}
                  </span>
                </button>
                <button
                  onClick={stopSimulation}
                  disabled={!isSimulating}
                  className={`w-full px-4 py-2 rounded flex items-center justify-center space-x-2 ${
                    !isSimulating
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  <FiSquare className="w-4 h-4" />
                  <span>Stop Simulation</span>
                </button>
              </div>
            </div>

            {/* Manual Mode */}
            <div>
              <h3 className="font-medium mb-3">Manual Mode</h3>
              <div className="space-y-2">
                <button
                  onClick={updateManualLocation}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Update Location
                </button>
                <button
                  onClick={() => {
                    if (currentJob) {
                      acceptJob(currentJob.id, "test-worker-456");
                    }
                  }}
                  className="w-full px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700"
                >
                  Accept Job
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">View Mode</h2>
            <div className="flex items-center bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode("split")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "split"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Split
              </button>
              <button
                onClick={() => setViewMode("map")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "map"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FiMap className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("details")}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  viewMode === "details"
                    ? "bg-white text-gray-900 shadow-sm"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Content */}
        {viewMode === "split" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Map Section */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-gray-900">Live Map</h2>
              <LiveTrackingMap
                jobId={currentJob?.id || "test-job"}
                className="h-96"
              />
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
              jobId={currentJob?.id || "test-job"}
              className="h-[calc(100vh-400px)]"
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

        {/* Status Information */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Status Information</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Job Status:</span>
              <p className="font-medium">{currentJob?.status || "No job"}</p>
            </div>
            <div>
              <span className="text-gray-600">Tracking Active:</span>
              <p className="font-medium">{isTrackingActive ? "Yes" : "No"}</p>
            </div>
            <div>
              <span className="text-gray-600">Worker Assigned:</span>
              <p className="font-medium">{assignedWorker ? "Yes" : "No"}</p>
            </div>
            <div>
              <span className="text-gray-600">Last Update:</span>
              <p className="font-medium">
                {lastLocationUpdate
                  ? new Date(lastLocationUpdate).toLocaleTimeString()
                  : "Never"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestTrackingPage;
