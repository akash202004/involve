'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface WaterPurifierPopupProps {
  onClose: () => void;
}

interface WaterPurifierService {
  name: string;
  icon: string;
}

const WaterPurifierPopup: React.FC<WaterPurifierPopupProps> = ({ onClose }) => {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const installationServices: WaterPurifierService[] = [
    { name: 'Water Purifier Installation', icon: '💧' },
    { name: 'RO Installation', icon: '🔧' },
    { name: 'UV Installation', icon: '☀️' },
    { name: 'UF Installation', icon: '🌊' },
    { name: 'Alkaline Installation', icon: '⚗️' },
    { name: 'Commercial Installation', icon: '🏢' },
  ];

  const repairServices: WaterPurifierService[] = [
    { name: 'Water Purifier Repair', icon: '🔧' },
    { name: 'RO Repair', icon: '🔧' },
    { name: 'UV Repair', icon: '🔧' },
    { name: 'UF Repair', icon: '🔧' },
    { name: 'Alkaline Repair', icon: '🔧' },
    { name: 'Commercial Repair', icon: '🔧' },
  ];

  const maintenanceServices: WaterPurifierService[] = [
    { name: 'Filter Replacement', icon: '🔄' },
    { name: 'Membrane Replacement', icon: '🔄' },
    { name: 'UV Bulb Replacement', icon: '💡' },
    { name: 'Tank Cleaning', icon: '🧽' },
    { name: 'Annual Maintenance', icon: '📋' },
    { name: 'Water Quality Test', icon: '🧪' },
  ];

  const handleServiceClick = (serviceName: string) => {
    setSelectedService(serviceName);
    // Navigate to booking page with service details
    const category = installationServices.find(s => s.name === serviceName) ? 'Water Purifier Services' :
                    repairServices.find(s => s.name === serviceName) ? 'Water Purifier Services' :
                    maintenanceServices.find(s => s.name === serviceName) ? 'Water Purifier Services' : 'Water Purifier Services';
    
    router.push(`/booking/services?service=${encodeURIComponent(serviceName)}&category=${encodeURIComponent(category)}`);
    onClose(); // Close the popup after navigation
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
          {/* Installation Services Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">
              Installation Services
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
              {installationServices.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleServiceClick(item.name)}
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg text-center cursor-pointer hover:bg-yellow-100 hover:border-yellow-400 transition-all duration-200 hover:scale-105"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <span className="text-sm font-medium text-gray-800">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Repair Services Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">
              Repair Services
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
              {repairServices.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleServiceClick(item.name)}
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg text-center cursor-pointer hover:bg-yellow-100 hover:border-yellow-400 transition-all duration-200 hover:scale-105"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <span className="text-sm font-medium text-gray-800">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Maintenance Services Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">
              Maintenance Services
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
              {maintenanceServices.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleServiceClick(item.name)}
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg text-center cursor-pointer hover:bg-yellow-100 hover:border-yellow-400 transition-all duration-200 hover:scale-105"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <span className="text-sm font-medium text-gray-800">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 mt-3">
              Professional water purifier experts available 24/7
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterPurifierPopup;
