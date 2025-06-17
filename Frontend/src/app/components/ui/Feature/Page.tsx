'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import ApplianceRepairPopup from '@/app/components/ui/PopUp/ApplianceRepairPopup/Page';
import WomenSalonPopup from '@/app/components/ui/PopUp/WomenSaloon/Page';
import MenSalonPopup from '@/app/components/ui/PopUp/MenSaloon/Page';
import CleaningPopup from '@/app/components/ui/PopUp/Cleaning/Page';
import ElectricianPopup from '@/app/components/ui/PopUp/ElectricianPlumber/Page';
import WaterPurifierPopup from '@/app/components/ui/PopUp/WaterPurifier/Page';
import SmartLockPopup from '@/app/components/ui/PopUp/SmartLock/Page';
interface ServiceItem {
  id: string;
  title: string;
  icon: string;
  isNew?: boolean;
  route: string;
}

const ServiceSelection: React.FC = () => {
  const router = useRouter();
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isWomenSalonPopupOpen, setIsWomenSalonPopupOpen] = useState(false);
  const [isMenSalonPopupOpen, setIsMenSalonPopupOpen] = useState(false);
  const [isCleaningPopupOpen, setIsCleaningPopupOpen] = useState(false);
  const [isElectricianPopupOpen, setIsElectricianPopupOpen] = useState(false);
  const [isWaterPurifierPopupOpen, setIsWaterPurifierPopupOpen] = useState(false);
  const [isSmartLockPopupOpen, setIsSmartLockPopupOpen] = useState(false);
  const services: ServiceItem[] = [
    {
      id: 'womens-salon',
      title: "Women's Salon & Spa",
      icon: '👩‍💼',
      route: '', // No direct route, will open popup
    },
    {
      id: 'mens-salon',
      title: "Men's Salon & Massage",
      icon: '👨‍💼',
      route: '', // No direct route, will open popup
    },
    {
      id: 'appliance-repair',
      title: 'AC & Appliance Repair',
      icon: '❄️',
      isNew: true,
      route: '', // No direct route, will open popup
    },
    {
      id: 'cleaning',
      title: 'Cleaning',
      icon: '🧹',
      route: '',
    },
    {
      id: 'electrician',
      title: 'Electrician, Plumber & Carpenter',
      icon: '🔧',
      route: '',
    },
    {
      id: 'water-purifier',
      title: 'Native Water Purifier',
      icon: '💧',
      route: '',
    },
    {
      id: 'smart-locks',
      title: 'Native Smart Locks',
      icon: '🔐',
      route: '',
    },
    {
      id: 'home-painting',
      title: 'Full home painting',
      icon: '🎨',
      route: '',
    },
    {
      id: 'pest-control',
      title: 'Pest Control',
      icon: '🐛',
      route: '',
    },
  ];

  const handleServiceClick = (serviceId: string) => {
    if (serviceId === 'appliance-repair') {
      setIsPopupOpen(true);
    } else if (serviceId === 'womens-salon') {
      setIsWomenSalonPopupOpen(true);
    } else if (serviceId === 'mens-salon') {
      setIsMenSalonPopupOpen(true);
    } else if (serviceId === 'cleaning') {
      setIsCleaningPopupOpen(true);
    } else if (serviceId === 'electrician') {
      setIsElectricianPopupOpen(true);
    } else if (serviceId === 'water-purifier') {
      setIsWaterPurifierPopupOpen(true);
    } 
    else if (serviceId === 'smart-locks') {
      setIsSmartLockPopupOpen(true);
    }
    else {
      const service = services.find(s => s.id === serviceId);
      if (service && service.route) {
        router.push(service.route);
      }
    }
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const closeWomenSalonPopup = () => {
    setIsWomenSalonPopupOpen(false);
  };

  const closeMenSalonPopup = () => {
    setIsMenSalonPopupOpen(false);
  };
  const closeCleaningPopup = () => {
    setIsCleaningPopupOpen(false);
  };
  const closeElectricianPopup = () => {
    setIsElectricianPopupOpen(false);
  };
  const closeWaterPurifierPopup = () => {
    setIsWaterPurifierPopupOpen(false);
  };
  const closeSmartLockPopup = () => {
    setIsSmartLockPopupOpen(false);
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
      {isPopupOpen && <ApplianceRepairPopup onClose={closePopup} />}
      {isWomenSalonPopupOpen && <WomenSalonPopup onClose={closeWomenSalonPopup} />}
      {isMenSalonPopupOpen && <MenSalonPopup onClose={closeMenSalonPopup} />}
      {isCleaningPopupOpen && <CleaningPopup onClose={closeCleaningPopup} />}
      {isElectricianPopupOpen && <ElectricianPopup onClose={closeElectricianPopup} />}
      {isWaterPurifierPopupOpen && <WaterPurifierPopup onClose={closeWaterPurifierPopup} />}
      {isSmartLockPopupOpen && <SmartLockPopup onClose={closeSmartLockPopup} />}

    </div>
  );
};

export default ServiceSelection;


