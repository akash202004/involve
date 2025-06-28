"use client";
import { useSearchParams, useRouter } from "next/navigation";
import mockWorkers from "../services/mockWorkers";
import React, { useEffect, useState } from "react";

export default function WorkerAssignedPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const workerId = searchParams.get("id");
  const [progress, setProgress] = useState(0);
  const worker = mockWorkers.find(w => String(w.id) === String(workerId));

  useEffect(() => {
    if (progress < 100) {
      const timer = setTimeout(() => setProgress(progress + 2), 200);
      return () => clearTimeout(timer);
    }
  }, [progress]);

  useEffect(() => {
    if (workerId) {
      router.replace(`/job-tracking?workerId=${workerId}`);
    }
  }, [workerId, router]);

  if (!worker) {
    return <div className="min-h-screen flex items-center justify-center text-2xl text-red-500">Worker not found.</div>;
  }

  const eta = Math.max(1, Math.ceil((100 - progress) / 10));

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <span className="text-gray-500 text-lg">Redirecting to tracking...</span>
    </div>
  );
} 