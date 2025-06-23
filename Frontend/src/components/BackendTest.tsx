"use client";

import React, { useState, useEffect } from "react";

const BackendTest: React.FC = () => {
  const [status, setStatus] = useState<"idle" | "testing" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [backendUrl, setBackendUrl] = useState("");

  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000";
    setBackendUrl(url);
  }, []);

  const testBackend = async () => {
    setStatus("testing");
    setMessage("Testing backend connection...");

    try {
      // Test health endpoint
      const healthResponse = await fetch(`${backendUrl}/api/v1/health`);
      console.log("Health check status:", healthResponse.status);
      
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        console.log("Health check data:", healthData);
        setStatus("success");
        setMessage(`✅ Backend is running! Health: ${JSON.stringify(healthData)}`);
      } else {
        setStatus("error");
        setMessage(`❌ Health check failed: ${healthResponse.status}`);
      }
    } catch (error) {
      console.error("Backend test error:", error);
      setStatus("error");
      setMessage(`❌ Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const testJobCreation = async () => {
    setStatus("testing");
    setMessage("Testing job creation...");

    try {
      const testJobData = {
        userId: "test-user-id",
        description: "Test job for backend testing",
        location: "Test location",
        lat: 12.9716,
        lng: 77.5946,
        bookedFor: new Date(Date.now() + 3600000).toISOString(),
        durationMinutes: 60,
        status: "pending",
      };

      const response = await fetch(`${backendUrl}/api/v1/jobs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testJobData),
      });

      console.log("Job creation test status:", response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log("Job creation test result:", result);
        setStatus("success");
        setMessage(`✅ Job creation test successful! Job ID: ${result.data?.id}`);
      } else {
        const errorText = await response.text();
        setStatus("error");
        setMessage(`❌ Job creation test failed: ${response.status} - ${errorText}`);
      }
    } catch (error) {
      console.error("Job creation test error:", error);
      setStatus("error");
      setMessage(`❌ Job creation test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white border border-gray-300 rounded-lg p-4 shadow-lg z-50 max-w-sm">
      <h3 className="font-semibold text-gray-800 mb-2">Backend Test</h3>
      <p className="text-xs text-gray-600 mb-3">URL: {backendUrl}</p>
      
      <div className="space-y-2">
        <button
          onClick={testBackend}
          disabled={status === "testing"}
          className="w-full px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          Test Health
        </button>
        
        <button
          onClick={testJobCreation}
          disabled={status === "testing"}
          className="w-full px-3 py-1 text-xs bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          Test Job Creation
        </button>
      </div>

      {status !== "idle" && (
        <div className={`mt-3 p-2 rounded text-xs ${
          status === "success" ? "bg-green-100 text-green-800" :
          status === "error" ? "bg-red-100 text-red-800" :
          "bg-yellow-100 text-yellow-800"
        }`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default BackendTest;
