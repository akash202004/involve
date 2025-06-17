'use client';

import React, { useState } from 'react';

interface ApplianceRepairPopupProps {
  onClose: () => void;
}

interface ApplianceItem {
  name: string;
  icon: string;
  description?: string;
}

const ApplianceRepairPopup: React.FC<ApplianceRepairPopupProps> = ({ onClose }) => {
  const [selectedAppliance, setSelectedAppliance] = useState<string | null>(null);

  const homeAppliances: ApplianceItem[] = [
    { name: 'AC', icon: '❄️' },
    { name: 'Washing Machine', icon: '🧺' },
    { name: 'Television', icon: '📺' },
    { name: 'Laptop', icon: '💻' },
    { name: 'Air Purifier', icon: '🌬️' },
    { name: 'Air Cooler', icon: '🌪️' },
    { name: 'Geyser', icon: '🔥' },
  ];

  const kitchenAppliances: ApplianceItem[] = [
    { name: 'Water Purifier', icon: '💧' },
    { name: 'Refrigerator', icon: '🧊' },
    { name: 'Microwave', icon: '🍽️' },
    { name: 'Chimney', icon: '🏠' },
  ];

  const handleApplianceClick = (applianceName: string) => {
    setSelectedAppliance(applianceName);
    // Here you can add navigation logic or booking functionality
    console.log(`Selected appliance: ${applianceName}`);
  };

  const handleClose = () => {
    setSelectedAppliance(null);
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
          {/* Home Appliances Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">
              Home Appliances
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {homeAppliances.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleApplianceClick(item.name)}
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg text-center cursor-pointer hover:bg-yellow-100 hover:border-yellow-400 transition-all duration-200 hover:scale-105"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <span className="text-sm font-medium text-gray-800">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Kitchen Appliances Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold mb-4">
              Kitchen Appliances
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {kitchenAppliances.map((item, index) => (
                <div
                  key={index}
                  onClick={() => handleApplianceClick(item.name)}
                  className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-lg text-center cursor-pointer hover:bg-yellow-100 hover:border-yellow-400 transition-all duration-200 hover:scale-105"
                >
                  <div className="text-3xl mb-2">{item.icon}</div>
                  <span className="text-sm font-medium text-gray-800">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Native Products Section */}
          <div className="mb-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center">
              <span className="mr-2">🛒</span>
              Buy Native Products
            </h3>
            <div className="p-6 border-2 border-dashed border-gray-300 rounded-lg text-center bg-gray-50">
              <div className="text-4xl mb-3">🚧</div>
              <p className="text-gray-600 font-medium">Native Products Coming Soon!</p>
              <p className="text-sm text-gray-500 mt-2">We're working on bringing you the best native products</p>
            </div>
          </div>

          {/* Call to Action */}
          <div className="text-center mt-8">
            
            <p className="text-sm text-gray-500 mt-3">
              Professional technicians available 24/7
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplianceRepairPopup;
