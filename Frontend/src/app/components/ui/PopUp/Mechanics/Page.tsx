'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface PopupProps {
  onClose: () => void;
}

const services = [
  { name: 'Car Service', icon: '🚗' },
  { name: 'Bike Service', icon: '🏍️' },
  { name: 'Emergency Service', icon: '🚨' },
  { name: 'Tire Leak', icon: '🛞' },
  { name: 'AC Service', icon: '❄️' },
  { name: 'Oil Change', icon: '🛢️' },
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MechanicsPopup;
