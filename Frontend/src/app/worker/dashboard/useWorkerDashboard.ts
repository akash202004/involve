import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import socketManager from "@/lib/socket";
import polyline from "@mapbox/polyline";

const OPENROUTESERVICE_API_KEY =
  "5b3ce3597851110001cf62481ff50d5207c04a54bed84f87a78c203f"; // <-- Set your OpenRouteService API key here

export const useWorkerDashboard = () => {
  const router = useRouter();
  const { user } = useUser();

  // State
  const [theme, setTheme] = useState("light");
  const [isLive, setIsLive] = useState(false);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [locationError, setLocationError] = useState<string | null>(null);
  const [jobStatus, setJobStatus] = useState<
    "idle" | "incoming" | "accepted" | "in_progress" | "completed"
  >("idle");
  const [jobRequest, setJobRequest] = useState<any>(null);
  const [jobHistory, setJobHistory] = useState<any[]>([]);
  const [route, setRoute] = useState<[number, number][] | null>(null);
  const [countdownTime, setCountdownTime] = useState(0);
  const [earnings, setEarnings] = useState(0);
  const [timeWorked, setTimeWorked] = useState(0);
  const [jobsCompleted, setJobsCompleted] = useState(0);
  const [performance] = useState({ rating: 4.8, successRate: 96 });
  const [weeklyGoal, setWeeklyGoal] = useState({ target: 2000 });
  const [goalInput, setGoalInput] = useState("2000");
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "Worker",
    imageUrl: null,
  });
  const [workerId, setWorkerId] = useState<string | null>(null);
  const [routeLoading, setRouteLoading] = useState(false);

  // Fetch worker profile
  const fetchWorkerProfile = useCallback(async (workerId: string) => {
    try {
      // Replace with your actual API call
      const response = await fetch(
        `http://localhost:5000/api/v1/workers/${workerId}`
      );
      const data = await response.json();
      setProfile({
        firstName: data.firstName || "Worker",
        imageUrl: data.profilePicture || null,
      });
    } catch (error) {
      console.error("Failed to fetch profile:", error);
    }
  }, []);

  const fetchWorkerId = useCallback(async (userEmail: string) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/v1/workers?email=${encodeURIComponent(
          userEmail
        )}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.data && data.data.length > 0) {
          return data.data[0].id; // Database worker ID
        }
      }
      throw new Error("Worker not found");
    } catch (error) {
      console.error("Failed to fetch worker ID:", error);
      return null;
    }
  }, []);

  // Toggle theme
  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("worker-theme", newTheme);
    document.documentElement.className =
      newTheme === "dark" ? "dark-theme" : "";
  }, [theme]);

  // Toggle live status
  const toggleLiveStatus = useCallback(async () => {
    if (!workerId) {
      console.error("Worker ID not available");
      return;
    }

    const newStatus = !isLive;
    try {
      // Get current location first
      if (newStatus) {
        setLocationError(null);
        const position = await new Promise<GeolocationPosition>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              enableHighAccuracy: true,
            });
          }
        );

        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        setLocation(newLocation);

        // Save location to liveLocations table
        try {
          await fetch(`http://localhost:5000/api/v1/live-locations`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              workerId: workerId,
              lat: newLocation.lat,
              lng: newLocation.lng,
            }),
          });
          console.log("✅ Location saved to database");
        } catch (locationError) {
          console.error("Failed to save location:", locationError);
        }
      }

      // API call to update availability
      const response = await fetch(
        `http://localhost:5000/api/v1/workers/${workerId}/availability`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            isActive: newStatus,
            lat: location?.lat,
            lng: location?.lng,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to update availability");

      setIsLive(newStatus);
    } catch (error: any) {
      console.error("Error updating availability:", error);
      if (error.message?.includes("getCurrentPosition")) {
        setLocationError(
          "Could not get location. Please enable location services."
        );
        setIsLive(false);
      }
    }
  }, [isLive, location, workerId]);

  // Handle incoming job
  const handleNewJobBroadcast = useCallback((jobData: any) => {
    const newJobRequest = {
      id: jobData.id,
      distance: `${jobData.workerDistance?.toFixed(1) || "2.5"} km`,
      fare: jobData.fare || 500,
      title: jobData.description,
      clientLocation: [jobData.lat, jobData.lng] as [number, number],
      description: jobData.description,
      location: jobData.address || "Client Location",
      lat: jobData.lat,
      lng: jobData.lng,
      userId: jobData.userId,
      durationMinutes: jobData.durationMinutes || 60,
    };

    setJobRequest(newJobRequest);
    setJobStatus("incoming");
    setCountdownTime(120); // 2 minutes countdown

    const timer = setInterval(() => {
      setCountdownTime((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setJobStatus("idle");
          setJobRequest(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Fetch route from OpenRouteService
  const fetchRoute = async (
    origin: [number, number],
    destination: [number, number]
  ) => {
    try {
      console.log("🗺️ Fetching route from OpenRouteService...");
      console.log("Origin:", origin);
      console.log("Destination:", destination);

      const response = await fetch(
        `https://api.openrouteservice.org/v2/directions/driving-car`,
        {
          method: "POST",
          headers: {
            Authorization: OPENROUTESERVICE_API_KEY,
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            coordinates: [
              [origin[1], origin[0]], // [lng, lat]
              [destination[1], destination[0]], // [lng, lat]
            ],
            format: "json",
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("🗺️ Route response:", data);

      if (data && data.routes && data.routes[0] && data.routes[0].geometry) {
        // Decode the polyline to get coordinates
        const polylineString = data.routes[0].geometry;
        const routeCoords = polyline.decode(polylineString);
        console.log("🗺️ Route coordinates count:", routeCoords.length);
        console.log("🗺️ First 3 coordinates:", routeCoords.slice(0, 3));
        console.log("🗺️ Last 3 coordinates:", routeCoords.slice(-3));

        // Validate coordinates before returning
        if (
          routeCoords.length > 0 &&
          routeCoords.every(
            (coord) =>
              Array.isArray(coord) &&
              coord.length === 2 &&
              typeof coord[0] === "number" &&
              typeof coord[1] === "number" &&
              coord[0] >= -90 &&
              coord[0] <= 90 &&
              coord[1] >= -180 &&
              coord[1] <= 180
          )
        ) {
          console.log(
            "🗺️ Route coordinates are valid, returning:",
            routeCoords
          );
          return routeCoords;
        } else {
          console.log("❌ Route coordinates are invalid:", routeCoords);
          return null;
        }
      }

      console.log("🗺️ No route found in response");
      return null;
    } catch (error) {
      console.error("❌ Failed to fetch route:", error);
      return null;
    }
  };

  // Accept job
  const handleAcceptJob = useCallback(async () => {
    if (!jobRequest || !workerId) return;

    const socket = socketManager.getSocket();
    if (socket) {
      socket.emit("accept_job", {
        jobId: jobRequest.id,
        workerId: workerId,
      });
    }

    setJobStatus("accepted");
    setRouteLoading(true);

    // Fetch the actual route from OpenRouteService
    if (
      location &&
      typeof location.lat === "number" &&
      typeof location.lng === "number" &&
      jobRequest &&
      Array.isArray(jobRequest.clientLocation) &&
      jobRequest.clientLocation.length === 2 &&
      typeof jobRequest.clientLocation[0] === "number" &&
      typeof jobRequest.clientLocation[1] === "number"
    ) {
      console.log("🗺️ Fetching route for job acceptance...");
      console.log("Worker location:", [location.lat, location.lng]);
      console.log("Job location:", jobRequest.clientLocation);

      try {
        const routeCoords = await fetchRoute(
          [location.lat, location.lng],
          [jobRequest.clientLocation[0], jobRequest.clientLocation[1]]
        );

        if (routeCoords && routeCoords.length > 0) {
          console.log(
            "🗺️ Route fetched successfully:",
            routeCoords.length,
            "coordinates"
          );
          setRoute(routeCoords as [number, number][]);
        } else {
          console.log("❌ No route coordinates received");
          setRoute(null);
        }
      } catch (error) {
        console.error("❌ Error fetching route:", error);
        setRoute(null);
      } finally {
        setRouteLoading(false);
      }
    } else {
      console.log("❌ Invalid coordinates for route fetching");
      setRoute(null);
      setRouteLoading(false);
    }
  }, [jobRequest, workerId, location, fetchRoute]);

  // Decline job
  const handleDeclineJob = useCallback(() => {
    if (!jobRequest || !workerId) return;

    const socket = socketManager.getSocket();
    if (socket) {
      socket.emit("decline_job", {
        jobId: jobRequest.id,
        workerId: workerId,
        reason: "Worker declined",
      });
    }

    setJobHistory((prev) => [{ ...jobRequest, status: "declined" }, ...prev]);
    setJobStatus("idle");
    setJobRequest(null);
    setRoute(null);
  }, [jobRequest, workerId]);

  // Complete job
  const handleCompleteJob = useCallback(() => {
    if (jobRequest) {
      setEarnings((prev) => prev + jobRequest.fare);
      setJobsCompleted((prev) => prev + 1);
      setJobHistory((prev) => [
        { ...jobRequest, status: "completed" },
        ...prev,
      ]);
    }
    setJobStatus("idle");
    setJobRequest(null);
    setRoute(null);
  }, [jobRequest]);

  // Goal management
  const handleSetGoal = useCallback(() => {
    const newTarget = parseInt(goalInput, 10);
    if (!isNaN(newTarget)) {
      setWeeklyGoal({ target: newTarget });
      setIsEditingGoal(false);
    }
  }, [goalInput]);

  // Initialize socket connection and event listeners
  useEffect(() => {
    if (!user?.id || !workerId) return;

    const socket = socketManager.getSocket();
    if (!socket) {
      console.log("❌ Socket not available for event listeners");
      return;
    }

    console.log("🔌 Setting up socket event listeners for worker:", workerId);

    // First, join the worker room
    console.log("🔌 Joining worker room:", workerId);
    socket.emit("join_worker_room", { workerId });
    console.log("✅ Worker room join request sent");

    // Then set up event listeners
    socket.on("new_job_broadcast", (jobData) => {
      console.log("📨 Received job broadcast:", jobData);
      console.log("📨 Current worker ID:", workerId);
      console.log("📨 Job worker distance:", jobData.workerDistance);
      handleNewJobBroadcast(jobData);
    });

    socket.on("job_accepted_success", () => {
      console.log("✅ Job accepted successfully");
      setJobStatus("accepted");
      setJobRequest(null);
    });

    // Add more debugging events
    socket.on("connect", () => {
      console.log("✅ Socket connected, ID:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("❌ Socket disconnected:", reason);
    });

    socket.on("error", (error) => {
      console.error("❌ Socket error:", error);
    });

    return () => {
      console.log("🔌 Cleaning up socket event listeners");
      socket.off("new_job_broadcast", handleNewJobBroadcast);
      socket.off("job_accepted_success");
      socket.off("connect");
      socket.off("disconnect");
      socket.off("error");
    };
  }, [user?.id, workerId, handleNewJobBroadcast]);

  // Time worked counter
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isLive) {
      timer = setInterval(() => {
        setTimeWorked((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLive]);

  // Logout
  const handleLogout = useCallback(() => {
    localStorage.removeItem("userProfile");
    router.push("/");
  }, [router]);

  // Initialize worker ID and profile
  useEffect(() => {
    if (!user?.primaryEmailAddress?.emailAddress) return;

    fetchWorkerId(user.primaryEmailAddress.emailAddress).then((dbWorkerId) => {
      if (dbWorkerId) {
        setWorkerId(dbWorkerId);
        fetchWorkerProfile(dbWorkerId);
      }
    });
  }, [
    user?.primaryEmailAddress?.emailAddress,
    fetchWorkerId,
    fetchWorkerProfile,
  ]);

  // Test job broadcast function for debugging
  const testJobBroadcast = useCallback(async () => {
    if (!workerId) {
      console.log("❌ [TEST] Worker ID not available");
      return;
    }

    console.log("🧪 [TEST] Testing job broadcast...");
    console.log("🧪 [TEST] Worker ID:", workerId);
    console.log("🧪 [TEST] Is Live:", isLive);
    console.log("🧪 [TEST] Location:", location);

    // Create a test job
    const testJob = {
      id: `test-${Date.now()}`,
      description: "Test Job - Plumbing Service",
      fare: 500,
      lat: location?.lat || 12.9716, // Default to Bangalore if no location
      lng: location?.lng || 77.5946,
      address: "Test Address",
      userId: "test-user",
      workerDistance: 1.5,
      durationMinutes: 60,
    };

    console.log("🧪 [TEST] Test job data:", testJob);
    handleNewJobBroadcast(testJob);
  }, [workerId, isLive, location, handleNewJobBroadcast]);

  // Check worker status function
  const checkWorkerStatus = useCallback(async () => {
    if (!workerId) {
      console.log("❌ [STATUS] Worker ID not available");
      return;
    }

    try {
      console.log("🔍 [STATUS] Checking worker status...");

      // Check worker details
      const workerResponse = await fetch(
        `http://localhost:5000/api/v1/workers/${workerId}`
      );
      if (workerResponse.ok) {
        const workerData = await workerResponse.json();
        console.log("✅ [STATUS] Worker details:", workerData);
        console.log("✅ [STATUS] Is Active:", workerData.isActive);
      } else {
        console.log("❌ [STATUS] Failed to fetch worker details");
      }

      // Check live location
      const locationResponse = await fetch(
        `http://localhost:5000/api/v1/live-locations?workerId=${workerId}`
      );
      if (locationResponse.ok) {
        const locationData = await locationResponse.json();
        console.log("✅ [STATUS] Live location:", locationData);
      } else {
        console.log("❌ [STATUS] Failed to fetch live location");
      }

      // Check socket connection
      const socket = socketManager.getSocket();
      if (socket) {
        console.log("✅ [STATUS] Socket connected:", socket.connected);
        console.log("✅ [STATUS] Socket ID:", socket.id);
      } else {
        console.log("❌ [STATUS] Socket not available");
      }
    } catch (error) {
      console.error("❌ [STATUS] Error checking worker status:", error);
    }
  }, [workerId]);

  return {
    // State
    theme,
    isLive,
    location,
    locationError,
    jobStatus,
    jobRequest,
    jobHistory,
    route,
    countdownTime,
    earnings,
    timeWorked,
    jobsCompleted,
    performance,
    weeklyGoal,
    isEditingGoal,
    goalInput,
    profile,
    workerId,
    routeLoading,

    // Handlers
    toggleTheme,
    toggleLiveStatus,
    handleAcceptJob,
    handleDeclineJob,
    handleCompleteJob,
    handleSetGoal,
    setGoalInput,
    setIsEditingGoal,
    handleLogout,
    fetchWorkerProfile,
    fetchWorkerId,
    testJobBroadcast,
    checkWorkerStatus,
  };
};
