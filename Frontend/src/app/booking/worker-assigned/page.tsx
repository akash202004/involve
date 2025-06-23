"use client";
import { useSearchParams } from "next/navigation";
import mockWorkers from "../services/mockWorkers";
import React, { useEffect, useState } from "react";

export default function WorkerAssignedPage() {
  const searchParams = useSearchParams();
  const workerId = searchParams.get("id");
  const [progress, setProgress] = useState(0);
  const worker = mockWorkers.find(w => String(w.id) === String(workerId));

  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => setProgress(progress + 2), 200);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  if (!worker) {
    return <div className="min-h-screen flex items-center justify-center text-2xl text-red-500">Worker not found.</div>;
  }

  const eta = Math.max(1, Math.ceil((100 - progress) / 10));

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {/* Worker Card */}
      <div className="bg-white rounded-xl shadow-lg p-6 max-w-md w-full flex flex-col items-center mb-8">
        <img src={worker.avatar} alt={worker.name} className="w-20 h-20 rounded-full mb-2" />
        <h1 className="text-xl font-bold text-gray-800">{worker.name}</h1>
        <div className="text-gray-600 mb-2 text-center">{worker.description}</div>
        <div className="flex gap-4 items-center mb-2">
          <span className="text-gray-700">{worker.phoneNumber}</span>
          <a href={`tel:${worker.phoneNumber}`} className="bg-yellow-400 text-white px-3 py-1 rounded-lg font-semibold">Call</a>
        </div>
        <div className="text-gray-500 text-sm">{worker.address}</div>
      </div>
      {/* Map Placeholder */}
      <div className="w-full max-w-md h-56 bg-gray-200 rounded-xl shadow flex items-center justify-center mb-8">
        <span className="text-gray-500 font-semibold">Live Map (WebSocket)</span>
      </div>
    </div>
  );
} 