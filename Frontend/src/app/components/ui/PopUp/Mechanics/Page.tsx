'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface PopupProps {
  onClose: () => void;
}

const SERVICE_PRICES: Record<string, number> = {
  'Car Service': 999,
  'Bike Service': 499,
  'Emergency Service': 799, // Not in SERVICE_DETAILS, set a reasonable price
  'Tire Leak': 399, // Maps to Tire Service
  'AC Service': 599,
  'Oil Change': 299,
};

const services = [
  { name: 'Car Service', icon: '🚗', price: SERVICE_PRICES['Car Service'] },
  { name: 'Bike Service', icon: '🏍️', price: SERVICE_PRICES['Bike Service'] },
  { name: 'Emergency Service', icon: '🚨', price: SERVICE_PRICES['Emergency Service'] },
  { name: 'Tire Leak', icon: '🛞', price: SERVICE_PRICES['Tire Leak'] },
  { name: 'AC Service', icon: '❄️', price: SERVICE_PRICES['AC Service'] },
  { name: 'Oil Change', icon: '🛢️', price: SERVICE_PRICES['Oil Change'] },
];

const MechanicsPopup: React.FC<PopupProps> = ({ onClose }) => {
  const router = useRouter();

  const handleServiceClick = (serviceName: string) => {
    router.push(`/booking/services?service=${encodeURIComponent(serviceName)}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Mechanic Services</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            &times;
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {services.map((service) => (
            <div
              key={service.name}
              onClick={() => handleServiceClick(service.name)}
              className="flex flex-col items-center p-4 bg-gray-100 rounded-lg cursor-pointer hover:bg-yellow-200 transition-colors"
            >
              <div className="text-3xl mb-2">{service.icon}</div>
              <span className="text-sm text-center">{service.name}</span>
              <span className="text-xs text-yellow-700 font-semibold mt-1">₹{service.price}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MechanicsPopup;
