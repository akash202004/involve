"use client";

import React, { useEffect, useState } from "react";
import { useJobTracking } from "@/lib/jobTracking";
import { useUser } from "@civic/auth/react";

const TestTrackingPage: React.FC = () => {
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
    createJob,
    acceptJob,
    updateLocation,
    completeJob,
    error,
    clearError,
  } = useJobTracking();

  const [testMode, setTestMode] = useState<"user" | "worker">("user");
  const [locationInterval, setLocationInterval] =
    useState<NodeJS.Timeout | null>(null);

  useEffect(() => {
    connectSocket();
  }, [connectSocket]);

  // Test job creation (for user mode)
  const handleCreateTestJob = async () => {
    if (!user) {
      alert("Please sign in first");
      return;
    }

    try {
      const jobData = {
        userId: "test-user-id",
        description: "Test job for tracking functionality",
        location: "Test Location, Kolkata",
        lat: 22.5726,
        lng: 88.3639,
        status: "pending",
        durationMinutes: 60,
      };

      const newJob = await createJob(jobData);
      console.log("Test job created:", newJob);
      alert("Test job created successfully!");
    } catch (error) {
      console.error("Failed to create test job:", error);
      alert("Failed to create test job");
    }
  };

  // Test job acceptance (for worker mode)
  const handleAcceptTestJob = () => {
    if (!currentJob || !user) {
      alert("No job available or user not signed in");
      return;
    }

    acceptJob(currentJob.id, user.id);
    alert("Job accepted!");
  };

  // Test location updates (for worker mode)
  const handleStartLocationUpdates = () => {
    if (!currentJob || !user) {
      alert("No active job or user not signed in");
      return;
    }

    if (locationInterval) {
      clearInterval(locationInterval);
      setLocationInterval(null);
      alert("Location updates stopped");
      return;
    }

    const interval = setInterval(() => {
      const lat = 22.5726 + (Math.random() - 0.5) * 0.001;
      const lng = 88.3639 + (Math.random() - 0.5) * 0.001;

      updateLocation(currentJob.id, user.id, lat, lng);
      console.log("Location updated:", { lat, lng });
    }, 3000);

    setLocationInterval(interval);
    alert("Location updates started (every 3 seconds)");
  };

  // Test job completion
  const handleCompleteTestJob = () => {
    if (!currentJob || !user) {
      alert("No active job or user not signed in");
      return;
    }

    completeJob(currentJob.id, user.id);
    alert("Job completed!");
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Live Tracking Test</h1>

        {/* Connection Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Connection Status</h2>
          <div className="flex items-center space-x-2 mb-4">
            <div
              className={`w-3 h-3 rounded-full ${
                isSocketConnected ? "bg-green-500" : "bg-red-500"
              }`}
            ></div>
            <span>{isSocketConnected ? "Connected" : "Disconnected"}</span>
          </div>
          <button
            onClick={connectSocket}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Reconnect
          </button>
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

        {/* Test Mode Selection */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Mode</h2>
          <div className="flex space-x-4">
            <button
              onClick={() => setTestMode("user")}
              className={`px-4 py-2 rounded ${
                testMode === "user" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              User Mode
            </button>
            <button
              onClick={() => setTestMode("worker")}
              className={`px-4 py-2 rounded ${
                testMode === "worker" ? "bg-blue-600 text-white" : "bg-gray-200"
              }`}
            >
              Worker Mode
            </button>
          </div>
        </div>

        {/* User Mode Tests */}
        {testMode === "user" && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">User Mode Tests</h2>
            <div className="space-y-4">
              <button
                onClick={handleCreateTestJob}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Create Test Job
              </button>
            </div>
          </div>
        )}

        {/* Worker Mode Tests */}
        {testMode === "worker" && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Worker Mode Tests</h2>
            <div className="space-y-4">
              <button
                onClick={handleAcceptTestJob}
                disabled={!currentJob || isJobAccepted}
                className={`px-4 py-2 rounded ${
                  !currentJob || isJobAccepted
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Accept Job
              </button>
              <button
                onClick={handleStartLocationUpdates}
                disabled={!isJobAccepted}
                className={`px-4 py-2 rounded ${
                  !isJobAccepted
                    ? "bg-gray-300 cursor-not-allowed"
                    : locationInterval
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {locationInterval
                  ? "Stop Location Updates"
                  : "Start Location Updates"}
              </button>
              <button
                onClick={handleCompleteTestJob}
                disabled={!isJobAccepted}
                className={`px-4 py-2 rounded ${
                  !isJobAccepted
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
              >
                Complete Job
              </button>
            </div>
          </div>
        )}

        {/* Current State Display */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Current State</h2>
          <div className="space-y-2 text-sm">
            <div>
              <strong>Current Job:</strong>{" "}
              {currentJob ? currentJob.description : "None"}
            </div>
            <div>
              <strong>Job Status:</strong> {currentJob?.status || "None"}
            </div>
            <div>
              <strong>Job Accepted:</strong> {isJobAccepted ? "Yes" : "No"}
            </div>
            <div>
              <strong>Tracking Active:</strong>{" "}
              {isTrackingActive ? "Yes" : "No"}
            </div>
            <div>
              <strong>Assigned Worker:</strong>{" "}
              {assignedWorker
                ? `${assignedWorker.firstName} ${assignedWorker.lastName}`
                : "None"}
            </div>
            <div>
              <strong>Worker Location:</strong>{" "}
              {workerLocation
                ? `${workerLocation.lat.toFixed(
                    6
                  )}, ${workerLocation.lng.toFixed(6)}`
                : "None"}
            </div>
            <div>
              <strong>Last Update:</strong> {lastLocationUpdate || "None"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestTrackingPage;
