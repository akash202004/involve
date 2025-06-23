'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

// Mock Worker Data
const mockWorkers = [
  { id: 1, name: 'Suresh Kumar', distance: '1.2km away', rating: 4.8, image: '/Assets/men-in-suits-to-guide-svgrepo-com.svg' },
  { id: 2, name: 'Rajesh Verma', distance: '2.5km away', rating: 4.9, image: '/Assets/men-in-suits-to-guide-svgrepo-com.svg' },
  { id: 3, name: 'Amit Singh', distance: '3.1km away', rating: 4.7, image: '/Assets/men-in-suits-to-guide-svgrepo-com.svg' },
];

const MappingPage = () => {
  const router = useRouter();
  const [status, setStatus] = useState('finding'); // 'finding', 'assigning', 'assigned'
  const [assignedWorker, setAssignedWorker] = useState<any>(null);

  useEffect(() => {
    // Simulate finding and assigning a worker
    const findingTimer = setTimeout(() => {
      setStatus('assigning');
    }, 3000); // Time to find workers

    const assigningTimer = setTimeout(() => {
      const worker = mockWorkers[Math.floor(Math.random() * mockWorkers.length)];
      setAssignedWorker(worker);
      setStatus('assigned');
    }, 6000); // Time to assign a worker

    return () => {
      clearTimeout(findingTimer);
      clearTimeout(assigningTimer);
    };
  }, []);

  const renderStatus = () => {
    switch (status) {
      case 'finding':
        return 'Finding workers near you...';
      case 'assigning':
        return 'Assigning the best worker for you...';
      case 'assigned':
        return `Worker Assigned!`;
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">{renderStatus()}</h1>

        {status === 'assigned' && assignedWorker ? (
          <div className="mt-6 animate-fadeIn">
            <img src={assignedWorker.image} alt={assignedWorker.name} className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-yellow-400" />
            <h2 className="text-xl font-semibold">{assignedWorker.name}</h2>
            <p className="text-gray-600">{assignedWorker.distance}</p>
            <p className="text-yellow-500">{'★'.repeat(Math.round(assignedWorker.rating)) + '☆'.repeat(5 - Math.round(assignedWorker.rating))}</p>
            <button
              onClick={() => router.push('/tracking')}
              className="mt-6 w-full py-3 bg-yellow-500 text-white rounded-lg font-semibold hover:bg-yellow-600 transition"
            >
              Track Worker
            </button>
          </div>
        ) : (
          <div className="mt-8">
            <div className="relative w-40 h-40 mx-auto">
              <div className="absolute inset-0 border-8 border-yellow-200 rounded-full"></div>
              <div className="absolute inset-0 border-8 border-t-yellow-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                 <span className="text-yellow-500 text-4xl">🛠️</span>
              </div>
            </div>
             <p className="text-gray-600 mt-6">Please wait, this will only take a moment.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MappingPage; 