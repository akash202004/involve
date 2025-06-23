import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiMapPin, FiClock, FiCheck, FiUsers, FiSearch } from "react-icons/fi";

interface BookingAnimationProps {
  isVisible: boolean;
  onComplete: (jobId?: string) => void;
  onWorkerFound: (workerCount: number) => void;
  jobData: any;
  userData: any;
}

const BookingAnimation: React.FC<BookingAnimationProps> = ({
  isVisible,
  onComplete,
  onWorkerFound,
  jobData,
  userData,
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [workerCount, setWorkerCount] = useState(0);
  const [searchProgress, setSearchProgress] = useState(0);
  const [foundWorker, setFoundWorker] = useState<any>(null);
  const [error, setError] = useState<string>("");

  const steps = [
    {
      title: "Finding nearby workers...",
      description: "Searching for available professionals in your area",
      icon: <FiSearch className="w-6 h-6" />,
      color: "bg-blue-500",
    },
    {
      title: "Workers found!",
      description: `${workerCount} professionals available nearby`,
      icon: <FiUsers className="w-6 h-6" />,
      color: "bg-green-500",
    },
    {
      title: "Assigning best worker...",
      description: "Selecting the most suitable professional for your service",
      icon: <FiMapPin className="w-6 h-6" />,
      color: "bg-yellow-500",
    },
    {
      title: "Worker assigned!",
      description: `${foundWorker?.name || "Professional"} is on the way`,
      icon: <FiCheck className="w-6 h-6" />,
      color: "bg-green-500",
    },
  ];

  // Sound effects
  const playSound = (type: "search" | "found" | "assigned" | "complete") => {
    if (typeof window !== "undefined") {
      const audio = new Audio();

      switch (type) {
        case "search":
        case "found":
        case "assigned":
        case "complete":
          audio.src =
            "data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT";
          break;
      }

      audio.volume = 0.3;
      audio.play().catch(() => {
        // Ignore audio errors
      });
    }
  };

  useEffect(() => {
    if (!isVisible) return;
    setError("");
    const animationSequence = async () => {
      // Step 1: Finding workers
      setCurrentStep(0);
      playSound("search");

      // Simulate search progress
      for (let i = 0; i <= 100; i += 10) {
        setSearchProgress(i);
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Step 2: Workers found
      await new Promise((resolve) => setTimeout(resolve, 500));
      const nearbyWorkers = Math.floor(Math.random() * 8) + 3; // 3-10 workers
      setWorkerCount(nearbyWorkers);
      setCurrentStep(1);
      playSound("found");
      onWorkerFound(nearbyWorkers);

      // Step 3: Assigning worker
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCurrentStep(2);
      playSound("assigned");

      // Step 4: Worker assigned
      await new Promise((resolve) => setTimeout(resolve, 800));
      setFoundWorker({
        name: "Rahul Kumar",
        rating: 4.8,
        experience: "5 years",
        distance: "0.8 km",
      });
      setCurrentStep(3);
      playSound("complete");

      // Step 5: Actually create the job
      try {
        console.log("🔍 [BOOKING] Starting job creation...");
        console.log("📝 [BOOKING] Job data:", jobData);
        console.log("👤 [BOOKING] User data:", userData);
        
        if (!jobData || !userData) {
          throw new Error("Missing job data or user data");
        }
        
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
        console.log("🌐 [BOOKING] Backend URL:", backendUrl);
        
        // Test backend connectivity first
        try {
          const healthCheck = await fetch(`${backendUrl}/api/v1/health`);
          console.log("🏥 [BOOKING] Backend health check:", healthCheck.status);
        } catch (healthError) {
          console.warn("⚠️ [BOOKING] Backend health check failed:", healthError);
        }
        
        // Prepare the job data for the API (only include schema-required fields)
        const apiJobData = {
          userId: jobData.userId,
          description: jobData.description,
          location: jobData.location,
          lat: jobData.lat,
          lng: jobData.lng,
          bookedFor: jobData.bookedFor,
          durationMinutes: jobData.durationMinutes,
          status: jobData.status,
        };
        
        console.log("📤 [BOOKING] Sending job data to API:", apiJobData);
        
        const response = await fetch(
          `${backendUrl}/api/v1/jobs`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(apiJobData),
          }
        );
        
        console.log("📡 [BOOKING] API response status:", response.status);
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ [BOOKING] API error response:", errorText);
          throw new Error(`Failed to create job: ${response.status} ${errorText}`);
        }
        
        const result = await response.json();
        console.log("✅ [BOOKING] Job created successfully:", result);
        const newJob = result.data;
        await new Promise((resolve) => setTimeout(resolve, 1000));
        onComplete(newJob.id);
      } catch (err) {
        console.error("❌ [BOOKING] Job creation failed:", err);
        setError(`Failed to create job: ${err instanceof Error ? err.message : 'Unknown error'}`);
        setTimeout(() => onComplete(undefined), 2000);
      }
    };

    animationSequence();
  }, [isVisible, onComplete, onWorkerFound, jobData, userData]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <FiMapPin className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Finding Your Perfect Match
          </h2>
          <p className="text-gray-600">
            We're connecting you with the best professionals
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded-xl mb-4 text-center font-semibold">
            {error}
          </div>
        )}

        {/* Progress Steps */}
        <div className="space-y-6">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{
                opacity: currentStep >= index ? 1 : 0.5,
                x: currentStep >= index ? 0 : -20,
              }}
              transition={{ delay: index * 0.1 }}
              className={`flex items-center space-x-4 p-4 rounded-xl transition-all duration-300 ${
                currentStep === index
                  ? "bg-yellow-50 border-2 border-yellow-200"
                  : currentStep > index
                  ? "bg-green-50 border-2 border-green-200"
                  : "bg-gray-50 border-2 border-gray-200"
              }`}
            >
              <motion.div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-white ${
                  currentStep > index ? "bg-green-500" : step.color
                }`}
                animate={currentStep === index ? { scale: [1, 1.1, 1] } : {}}
                transition={{
                  duration: 1,
                  repeat: currentStep === index ? Infinity : 0,
                }}
              >
                {currentStep > index ? (
                  <FiCheck className="w-6 h-6" />
                ) : (
                  step.icon
                )}
              </motion.div>
              <div className="flex-1">
                <h3
                  className={`font-semibold ${
                    currentStep === index
                      ? "text-yellow-800"
                      : currentStep > index
                      ? "text-green-800"
                      : "text-gray-600"
                  }`}
                >
                  {step.title}
                </h3>
                <p className="text-sm text-gray-500">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search Progress Bar */}
        {currentStep === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6"
          >
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Searching...</span>
              <span>{searchProgress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-yellow-500 h-2 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${searchProgress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </motion.div>
        )}

        {/* Worker Found Details */}
        {foundWorker && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-green-50 rounded-xl border border-green-200"
          >
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {foundWorker.name
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")}
                </span>
              </div>
              <div>
                <h4 className="font-semibold text-green-800">
                  {foundWorker.name}
                </h4>
                <div className="flex items-center space-x-4 text-sm text-green-600">
                  <span>⭐ {foundWorker.rating}</span>
                  <span>📅 {foundWorker.experience}</span>
                  <span>📍 {foundWorker.distance}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Loading Animation */}
        {currentStep < 3 && (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 border-4 border-yellow-200 border-t-yellow-500 rounded-full mx-auto mt-6"
          />
        )}
      </motion.div>
    </div>
  );
};

export default BookingAnimation;
