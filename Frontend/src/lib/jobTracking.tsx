"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import socketManager from "./socket";

export interface Job {
  id: string;
  userId: string;
  workerId?: string;
  description: string;
  location: string;
  lat: number;
  lng: number;
  status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled";
  bookedFor?: string;
  durationMinutes?: number;
  createdAt: string;
}

export interface Worker {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  experienceYears: number;
}

export interface LocationUpdate {
  jobId: string;
  workerId: string;
  lat: number;
  lng: number;
  timestamp: string;
}

interface JobTrackingContextType {
  // Current job state
  currentJob: Job | null;
  assignedWorker: Worker | null;
  isJobAccepted: boolean;
  isTrackingActive: boolean;

  // Location tracking
  workerLocation: { lat: number; lng: number } | null;
  lastLocationUpdate: string | null;

  // Job actions
  createJob: (
    jobData: Omit<Job, "id" | "createdAt" | "status">
  ) => Promise<Job>;
  acceptJob: (jobId: string, workerId: string) => void;
  updateLocation: (
    jobId: string,
    workerId: string,
    lat: number,
    lng: number
  ) => void;
  completeJob: (jobId: string, workerId: string) => void;

  // Socket connection
  isSocketConnected: boolean;
  connectSocket: () => void;
  disconnectSocket: () => void;

  // Error handling
  error: string | null;
  clearError: () => void;
}

const JobTrackingContext = createContext<JobTrackingContextType | undefined>(
  undefined
);

export const JobTrackingProvider = ({ children }: { children: ReactNode }) => {
  const [currentJob, setCurrentJob] = useState<Job | null>(null);
  const [assignedWorker, setAssignedWorker] = useState<Worker | null>(null);
  const [isJobAccepted, setIsJobAccepted] = useState(false);
  const [isTrackingActive, setIsTrackingActive] = useState(false);
  const [workerLocation, setWorkerLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [lastLocationUpdate, setLastLocationUpdate] = useState<string | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  // Socket event handlers
  useEffect(() => {
    const socket = socketManager.getSocket();
    if (!socket) return;

    // Job accepted by worker
    socket.on(
      "job_accepted",
      (data: { job: Job; worker: Worker; trackingEnabled: boolean }) => {
        console.log("✅ Job accepted by worker:", data);
        setCurrentJob(data.job);
        setAssignedWorker(data.worker);
        setIsJobAccepted(true);
        setIsTrackingActive(data.trackingEnabled);
        setError(null);
      }
    );

    // Worker location updates
    socket.on("worker_location_update", (data: LocationUpdate) => {
      console.log("📍 Worker location update:", data);
      setWorkerLocation({ lat: data.lat, lng: data.lng });
      setLastLocationUpdate(data.timestamp);
    });

    // Job completed
    socket.on(
      "job_completed_success",
      (data: { job: Job; trackingStopped: boolean }) => {
        console.log("✅ Job completed:", data);
        setCurrentJob(data.job);
        setIsTrackingActive(!data.trackingStopped);
        if (data.trackingStopped) {
          setWorkerLocation(null);
          setLastLocationUpdate(null);
        }
      }
    );

    // Job errors
    socket.on("job_error", (data: { message: string }) => {
      console.error("❌ Job error:", data.message);
      setError(data.message);
    });

    // Location errors
    socket.on("location_error", (data: { message: string }) => {
      console.error("❌ Location error:", data.message);
      setError(data.message);
    });

    // Tracking stopped
    socket.on("tracking_stopped", (data: { message: string }) => {
      console.log("📍 Tracking stopped:", data.message);
      setIsTrackingActive(false);
      setWorkerLocation(null);
      setLastLocationUpdate(null);
    });

    return () => {
      socket.off("job_accepted");
      socket.off("worker_location_update");
      socket.off("job_completed_success");
      socket.off("job_error");
      socket.off("location_error");
      socket.off("tracking_stopped");
    };
  }, []);

  // Create a new job
  const createJob = async (
    jobData: Omit<Job, "id" | "createdAt" | "status">
  ): Promise<Job> => {
    try {
      const response = await fetch(
        `${
          process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"
        }/api/v1/jobs`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jobData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to create job");
      }

      const result = await response.json();
      const newJob = result.data;

      setCurrentJob(newJob);
      setIsJobAccepted(false);
      setIsTrackingActive(false);
      setAssignedWorker(null);
      setWorkerLocation(null);
      setLastLocationUpdate(null);
      setError(null);

      return newJob;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to create job";
      setError(errorMessage);
      throw err;
    }
  };

  // Accept a job (for workers)
  const acceptJob = (jobId: string, workerId: string) => {
    socketManager.emit("accept_job", { jobId, workerId });
  };

  // Update worker location
  const updateLocation = (
    jobId: string,
    workerId: string,
    lat: number,
    lng: number
  ) => {
    socketManager.emit("update_location", { jobId, workerId, lat, lng });
  };

  // Complete a job
  const completeJob = (jobId: string, workerId: string) => {
    socketManager.emit("complete_job", { jobId, workerId });
  };

  // Socket connection management
  const connectSocket = () => {
    socketManager.connect();
  };

  const disconnectSocket = () => {
    socketManager.disconnect();
  };

  const clearError = () => {
    setError(null);
  };

  const contextValue: JobTrackingContextType = {
    currentJob,
    assignedWorker,
    isJobAccepted,
    isTrackingActive,
    workerLocation,
    lastLocationUpdate,
    createJob,
    acceptJob,
    updateLocation,
    completeJob,
    isSocketConnected: socketManager.isSocketConnected(),
    connectSocket,
    disconnectSocket,
    error,
    clearError,
  };

  return (
    <JobTrackingContext.Provider value={contextValue}>
      {children}
    </JobTrackingContext.Provider>
  );
};

export const useJobTracking = () => {
  const context = useContext(JobTrackingContext);
  if (!context) {
    throw new Error("useJobTracking must be used within a JobTrackingProvider");
  }
  return context;
};
