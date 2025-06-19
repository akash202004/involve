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
import FullHomePaintingPopup from '@/app/components/ui/PopUp/FullHomePainting/Page';
import PestControlPopup from '@/app/components/ui/PopUp/PestControl/Page';
import Image from 'next/image';

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
  const [isFullHomePaintingPopupOpen, setIsFullHomePaintingPopupOpen] = useState(false);
  const [isPestControlPopupOpen, setIsPestControlPopupOpen] = useState(false);
  const services: ServiceItem[] = [
    {
      id: 'womens-salon',
      title: "Women's Salon & Spa",
      icon: '/Assets/female-svgrepo-com.svg',
      route: '',
    },
    {
      id: 'mens-salon',
      title: "Men's Salon & Massage",
      icon: '/Assets/men-in-suits-to-guide-svgrepo-com.svg',
      route: '',
    },
    {
      id: 'appliance-repair',
      title: 'AC & Appliance Repair',
      icon: '/Assets/air-conditioner-air-conditioning-svgrepo-com.svg',
      isNew: true,
      route: '',
    },
    {
      id: 'cleaning',
      title: 'Cleaning',
      icon: '/Assets/cleaning-mop-svgrepo-com.svg',
      route: '',
    },
    {
      id: 'electrician',
      title: 'Electrician, Plumber & Carpenter',
      icon: '/Assets/plumber-svgrepo-com.svg',
      route: '',
    },
    {
      id: 'water-purifier',
      title: 'Native Water Purifier',
      icon: '/Assets/air-conditioner-air-conditioning-svgrepo-com.svg',
      route: '',
    },
    {
      id: 'smart-locks',
      title: 'Native Smart Locks',
      icon: '/Assets/lock-svgrepo-com.svg',
      route: '',
    },
    {
      id: 'home-painting',
      title: 'Full home painting',
      icon: '/Assets/painting-brush-svgrepo-com.svg',
      route: '',
    },
    {
      id: 'pest-control',
      title: 'Pest Control',
      icon: '/Assets/spraying-svgrepo-com.svg',
      route: '',
    },
  ];

  const handleServiceClick = (serviceId: string) => {
    switch (serviceId) {
      case 'appliance-repair':
        setIsPopupOpen(true);
        break;
      case 'womens-salon':
        setIsWomenSalonPopupOpen(true);
        break;
      case 'mens-salon':
        setIsMenSalonPopupOpen(true);
        break;
      case 'cleaning':
        setIsCleaningPopupOpen(true);
        break;
      case 'electrician':
        setIsElectricianPopupOpen(true);
        break;
      case 'water-purifier':
        setIsWaterPurifierPopupOpen(true);
        break;
      case 'smart-locks':
        setIsSmartLockPopupOpen(true);
        break;
      case 'home-painting':
        setIsFullHomePaintingPopupOpen(true);
        break;
      case 'pest-control':
        setIsPestControlPopupOpen(true);
        break;
      default:
        break;
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
  const closeFullHomePaintingPopup = () => setIsFullHomePaintingPopupOpen(false);
  const closePestControlPopup = () => setIsPestControlPopupOpen(false);

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
                <Image src={service.icon} alt={service.title + ' Icon'} width={48} height={48} />
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
      {isFullHomePaintingPopupOpen && <FullHomePaintingPopup onClose={closeFullHomePaintingPopup} />}
      {isPestControlPopupOpen && <PestControlPopup onClose={closePestControlPopup} />}

    </div>
  );
};

export default ServiceSelection;


