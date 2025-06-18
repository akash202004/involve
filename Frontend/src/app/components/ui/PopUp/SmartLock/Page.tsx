'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

interface SmartLockPopupProps {
  onClose: () => void;
}

interface SmartLockService {
  name: string;
  icon: string;
}

const SmartLockPopup: React.FC<SmartLockPopupProps> = ({ onClose }) => {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const smartLockServices: SmartLockService[] = [
    { name: 'Smart Lock Installation', icon: '🔐' },
    { name: 'Smart Lock Repair', icon: '🔧' },
    { name: 'Smart Lock Setup', icon: '📱' },
    { name: 'Smart Lock Maintenance', icon: '🔧' },
    { name: 'Smart Lock Upgrade', icon: '⬆️' },
    { name: 'Smart Lock Consultation', icon: '💡' },
  ];

  const securityServices: SmartLockService[] = [
    { name: 'Security System Installation', icon: '🏠' },
    { name: 'CCTV Installation', icon: '📹' },
    { name: 'Access Control System', icon: '🚪' },
    { name: 'Biometric Lock Installation', icon: '👆' },
    { name: 'Digital Lock Installation', icon: '🔢' },
    { name: 'Security Audit', icon: '🔍' },
  ];

  const maintenanceServices: SmartLockService[] = [
    { name: 'Battery Replacement', icon: '🔋' },
    { name: 'Software Update', icon: '💻' },
    { name: 'Key Programming', icon: '🔑' },
    { name: 'Emergency Unlock', icon: '🚨' },
    { name: 'Warranty Service', icon: '📋' },
    { name: 'Remote Support', icon: '🌐' },
  ];

  const handleServiceClick = (serviceName: string) => {
    setSelectedService(serviceName);
    // Navigate to booking page with service details
    const category = smartLockServices.find(s => s.name === serviceName) ? 'Smart Lock Services' :
                    securityServices.find(s => s.name === serviceName) ? 'Security Services' :
                    maintenanceServices.find(s => s.name === serviceName) ? 'Maintenance Services' : 'Smart Lock Services';
    
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
          {/* Smart Lock Services Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">
              Smart Lock Services
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
              {smartLockServices.map((item, index) => (
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

          {/* Security Services Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">
              Security Services
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
              {securityServices.map((item, index) => (
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
              Professional smart lock experts available 24/7
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SmartLockPopup;
