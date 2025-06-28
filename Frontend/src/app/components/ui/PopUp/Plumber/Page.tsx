'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface PlumberPopupProps {
  onClose: () => void;
}

interface PlumberService {
  name: string;
  icon: string;
  price: number;
}

const SERVICE_PRICES: Record<string, number> = {
  'Tap Repair': 299,
  'Leak Fixing': 349, // Not in SERVICE_DETAILS, set a reasonable price
  'Pipe Installation': 399, // Maps to Pipe Repair
  'Drain Cleaning': 499,
  'Toilet Repair': 399,
  'Water Heater': 599,
};

const PlumberPopup: React.FC<PlumberPopupProps> = ({ onClose }) => {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const plumberServices: PlumberService[] = [
    { name: 'Tap Repair', icon: '🚰', price: SERVICE_PRICES['Tap Repair'] },
    { name: 'Leak Fixing', icon: '💧', price: SERVICE_PRICES['Leak Fixing'] },
    { name: 'Pipe Installation', icon: '🛠️', price: SERVICE_PRICES['Pipe Installation'] },
    { name: 'Drain Cleaning', icon: '🛁', price: SERVICE_PRICES['Drain Cleaning'] },
    { name: 'Toilet Repair', icon: '🚽', price: SERVICE_PRICES['Toilet Repair'] },
    { name: 'Water Heater', icon: '🔥', price: SERVICE_PRICES['Water Heater'] },
  ];

  const handleServiceClick = (serviceName: string) => {
    setSelectedService(serviceName);
    router.push(`/booking/services?service=${encodeURIComponent(serviceName)}&category=Plumber`);
    onClose();
  };

  const handleClose = () => {
    setSelectedService(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-md bg-white/20 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl relative max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition-colors z-10"
          aria-label="Close"
        >
          <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <div className="p-6">
          <h3 className="text-xl font-semibold mb-4">Plumber Services</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
            {plumberServices.map((item, index) => (
              <div
                key={index}
                onClick={() => handleServiceClick(item.name)}
                className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg text-center cursor-pointer hover:bg-yellow-100 hover:border-yellow-400 transition-all duration-200 hover:scale-105"
              >
                <div className="text-3xl mb-2">{item.icon}</div>
                <span className="text-sm font-medium text-gray-800">{item.name}</span>
                <span className="text-xs text-yellow-700 font-semibold mt-1">₹{item.price}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 mt-3">
              Professional plumbers available
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlumberPopup;
