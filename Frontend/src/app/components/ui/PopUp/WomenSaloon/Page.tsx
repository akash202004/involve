'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface PopupProps {
  onClose: () => void;
}

const SERVICE_PRICES: Record<string, number> = {
  'Hair Color': 899,
  'Waxing': 199,
  'Nails': 299, // Maps to Manicure
  'Hair Cut': 299, // Maps to Haircut
};

const services = [
  { name: 'Hair Color', icon: '🎨', price: SERVICE_PRICES['Hair Color'] },
  { name: 'Waxing', icon: '🧴', price: SERVICE_PRICES['Waxing'] },
  { name: 'Nails', icon: '💅', price: SERVICE_PRICES['Nails'] },
  { name: 'Hair Cut', icon: '✂️', price: SERVICE_PRICES['Hair Cut'] },
];

const WomenSalonPopup: React.FC<PopupProps> = ({ onClose }) => {
  const router = useRouter();

  const handleServiceClick = (serviceName: string) => {
    router.push(`/booking/services?service=${encodeURIComponent(serviceName)}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/30 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-sm mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Women's Salon & Spa</h2>
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

export default WomenSalonPopup;
