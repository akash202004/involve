"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface PestControlPopupProps {
  onClose: () => void;
}

interface PestControlService {
  name: string;
  icon: string;
}

const PestControlPopup: React.FC<PestControlPopupProps> = ({ onClose }) => {
  const router = useRouter();
  const [selectedService, setSelectedService] = useState<string | null>(null);

  const pestControlServices: PestControlService[] = [
    { name: "General Pest Control", icon: "/Assets/spraying-svgrepo-com.svg" },
    { name: "Termite Control", icon: "/Assets/spraying-svgrepo-com.svg" },
    { name: "Cockroach Control", icon: "/Assets/spraying-svgrepo-com.svg" },
    { name: "Rodent Control", icon: "/Assets/spraying-svgrepo-com.svg" },
    { name: "Bed Bug Control", icon: "/Assets/spraying-svgrepo-com.svg" },
    { name: "Mosquito Control", icon: "/Assets/spraying-svgrepo-com.svg" },
  ];

  const handleServiceClick = (serviceName: string) => {
    setSelectedService(serviceName);
    const category = "Pest Control Services";
    router.push(`/booking/services?service=${encodeURIComponent(serviceName)}&category=${encodeURIComponent(category)}`);
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
          <h3 className="text-xl font-semibold mb-4">Pest Control Services</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
            {pestControlServices.map((item, index) => (
              <div
                key={index}
                onClick={() => handleServiceClick(item.name)}
                className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg text-center cursor-pointer hover:bg-yellow-100 hover:border-yellow-400 transition-all duration-200 hover:scale-105"
              >
                <img src={item.icon} alt={item.name} className="w-10 h-10 mb-2" />
                <span className="text-sm font-medium text-gray-800">{item.name}</span>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 mt-3">
              Professional pest control experts for every need. Book your service now!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PestControlPopup; 