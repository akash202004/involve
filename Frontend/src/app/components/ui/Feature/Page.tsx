'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

interface ServiceItem {
  id: string;
  title: string;
  icon: string;
  isNew?: boolean;
  route: string;
}

const ServiceSelection: React.FC = () => {
  const router = useRouter();
  
  const services: ServiceItem[] = [
    {
      id: 'womens-salon',
      title: "Women's Salon & Spa",
      icon: '👩‍💼',
      route: '/services/womens-salon',
    },
    {
      id: 'mens-salon',
      title: "Men's Salon & Massage",
      icon: '👨‍💼',
      route: '/services/mens-salon',
    },
    {
      id: 'appliance-repair',
      title: 'AC & Appliance Repair',
      icon: '❄️',
      isNew: true,
      route: '/services/appliance-repair',
    },
    {
      id: 'cleaning',
      title: 'Cleaning',
      icon: '🧹',
      route: '/services/cleaning',
    },
    {
      id: 'electrician',
      title: 'Electrician, Plumber & Carpenter',
      icon: '🔧',
      route: '/services/electrician',
    },
    {
      id: 'water-purifier',
      title: 'Native Water Purifier',
      icon: '💧',
      route: '/services/water-purifier',
    },
    {
      id: 'smart-locks',
      title: 'Native Smart Locks',
      icon: '🔐',
      route: '/services/smart-locks',
    },
    {
      id: 'home-painting',
      title: 'Full home painting',
      icon: '🎨',
      route: '/services/home-painting',
    },
    {
      id: 'pest-control',
      title: 'Pest Control',
      icon: '🐛',
      route: '/services/pest-control',
    },
  ];

  const handleServiceClick = (route: string) => {
    router.push(route);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center pt-8 pb-8">
      <h2 className="text-4xl font-bold mb-8 passion-one-black bg-yellow-400 block px-4 py-2 leading-none align-baseline border-4 border-black">
        What Service We Provide
      </h2>
      <div className="w-250 mx-auto p-6 bg-white">
        <div className="grid grid-cols-3 gap-4">
          {services.map((service) => (
            <div
              key={service.id}
              onClick={() => handleServiceClick(service.id)}
              className="relative flex flex-col items-center p-4 bg-gray-50 rounded-xl cursor-pointer hover:bg-[#fdc700] transition-colors duration-200 border border-black"
            >
              {service.isNew && (
                <div className="absolute -top-2 -right-2 w-6 h-6  rounded-full flex items-center justify-center">
                  
                </div>
              )}
              
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm">
                <span className="text-2xl">{service.icon}</span>
              </div>
              
              <span className="text-xs text-gray-700 text-center leading-tight font-medium">
                {service.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ServiceSelection;