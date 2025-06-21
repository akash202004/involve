"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@civic/auth/react";
import { useJobTracking } from "@/lib/jobTracking";
import LiveTrackingMap from "../components/LiveTrackingMap";
import {
  FiMapPin,
  FiPhone,
  FiClock,
  FiUser,
  FiCheckCircle,
  FiAlertCircle,
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
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Job Tracking</h1>
              <p className="text-gray-600">Monitor your service request</p>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isSocketConnected ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <span className="text-sm text-gray-600">
                {isSocketConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
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

        {/* Job Status Card */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Job Details
              </h2>
              <div
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentJob.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : currentJob.status === "in_progress"
                    ? "bg-blue-100 text-blue-800"
                    : currentJob.status === "confirmed"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {currentJob.status.replace("_", " ").toUpperCase()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Service Description
                </h3>
                <p className="text-gray-600">{currentJob.description}</p>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Location</h3>
                <div className="flex items-center text-gray-600">
                  <FiMapPin className="w-4 h-4 mr-2" />
                  {currentJob.address}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">
                  Scheduled Time
                </h3>
                <div className="flex items-center text-gray-600">
                  <FiClock className="w-4 h-4 mr-2" />
                  {currentJob.bookedFor
                    ? formatTime(currentJob.bookedFor)
                    : "Not scheduled"}
                </div>
              </div>
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Duration</h3>
                <p className="text-gray-600">
                  {currentJob.durationMinutes
                    ? `${currentJob.durationMinutes} minutes`
                    : "Not specified"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Worker Information */}
        {assignedWorker && (
          <div className="bg-white rounded-lg shadow-sm border mb-6">
            <div className="p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Assigned Worker
              </h2>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiUser className="w-8 h-8 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-medium text-gray-900">
                    {assignedWorker.firstName} {assignedWorker.lastName}
                  </h3>
                  <p className="text-gray-600">
                    {assignedWorker.experienceYears} years experience
                  </p>
                  <div className="flex items-center mt-2">
                    <FiPhone className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-gray-600">
                      {assignedWorker.phoneNumber}
                    </span>
                  </div>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Call Worker
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Live Tracking Map */}
        <div className="bg-white rounded-lg shadow-sm border mb-6">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Live Tracking
            </h2>
            <LiveTrackingMap jobId={currentJob.id} />
          </div>
        </div>

        {/* Status Updates */}
        <div className="bg-white rounded-lg shadow-sm border">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Status Updates
            </h2>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <FiCheckCircle className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">Job Created</p>
                  <p className="text-sm text-gray-600">
                    {formatTime(currentJob.createdAt)}
                  </p>
                </div>
              </div>

              {isJobAccepted && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <FiCheckCircle className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Worker Assigned</p>
                    <p className="text-sm text-gray-600">
                      {assignedWorker
                        ? `${assignedWorker.firstName} ${assignedWorker.lastName}`
                        : "Worker assigned"}
                    </p>
                  </div>
                </div>
              )}

              {isTrackingActive && workerLocation && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse"></div>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      Live Tracking Active
                    </p>
                    <p className="text-sm text-gray-600">
                      Last update:{" "}
                      {lastLocationUpdate
                        ? formatTime(lastLocationUpdate)
                        : "Just now"}
                      {calculateETA() && ` • ETA: ~${calculateETA()} minutes`}
                    </p>
                  </div>
                </div>
              )}

              {currentJob.status === "completed" && (
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <FiCheckCircle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">Job Completed</p>
                    <p className="text-sm text-gray-600">
                      Service has been completed successfully
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobTrackingPage;
