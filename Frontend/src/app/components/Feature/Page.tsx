'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import WomenSalonPopup from '@/app/components/ui/PopUp/WomenSaloon/Page';
import MenSalonPopup from '@/app/components/ui/PopUp/MenSaloon/Page';
import ElectricianPopup from '@/app/components/ui/PopUp/Electrician/Page';
import PlumberPopup from '@/app/components/ui/PopUp/Plumber/Page';
import CarpenterPopup from '@/app/components/ui/PopUp/Carpenter/Page';
import MechanicsPopup from '@/app/components/ui/PopUp/Mechanics/Page';
import Image from 'next/image';
import FeatureImage from './FeatureImage';

interface ServiceItem {
  id: string;
  title: string;
  icon: string;
  isNew?: boolean;
  route: string;
}

const ServiceSelection: React.FC = () => {
  const router = useRouter();
  const [activePopup, setActivePopup] = useState<string | null>(null);

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
      id: 'mechanics',
      title: 'Mechanics',
      icon: '/Assets/spraying-svgrepo-com.svg',
      isNew: true,
      route: '',
    },
    {
      id: 'electrician',
      title: 'Electrician',
      icon: '/Assets/plumber-svgrepo-com.svg',
      route: '',
    },
    {
      id: 'plumber',
      title: 'Plumber',
      icon: '/Assets/plumber-svgrepo-com.svg',
      route: '',
    },
    {
      id: 'carpenter',
      title: 'Carpenter',
      icon: '/Assets/painting-brush-svgrepo-com.svg',
      route: '',
    },
  ];

  const handleServiceClick = (serviceId: string) => {
    setActivePopup(serviceId);
  };

  const closePopup = () => {
    setActivePopup(null);
  };

  return (
    <div className="w-full flex flex-col-reverse lg:flex-row items-stretch lg:items-center justify-center pt-36 pb-10 px-2 sm:px-4 gap-8">
      {/* Left: Feature selection */}
      <div className="flex-1 w-full max-w-2xl flex flex-col items-center justify-center">
        <div className="w-full max-w-xs sm:max-w-md md:max-w-2xl lg:max-w-4xl mx-auto p-2 sm:p-6 bg-white rounded-xl">
          <h2 className="text-xl sm:text-2xl font-bold text-center text-gray-800 mb-6">From Booking to Service in Under 10 Minutes</h2>
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                onClick={() => handleServiceClick(service.id)}
                className="relative flex flex-col items-center p-2 sm:p-3 bg-gray-50 rounded-xl cursor-pointer hover:bg-[#fdc700] transition-colors duration-200 border border-black min-h-[100px] sm:min-h-[120px]"
              >
                {service.isNew && (
                  <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center bg-yellow-400 text-xs font-bold text-white shadow">NEW</div>
                )}
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white rounded-full flex items-center justify-center mb-2 sm:mb-3 shadow-sm">
                  <Image src={service.icon} alt={service.title + ' Icon'} width={48} height={48} />
                </div>
                <span className="text-xs sm:text-sm text-gray-700 text-center leading-tight font-medium">
                  {service.title}
                </span>
              </div>
            ))}
          </div>
        </div>
        {activePopup === 'mechanics' && <MechanicsPopup onClose={closePopup} />}
        {activePopup === 'womens-salon' && <WomenSalonPopup onClose={closePopup} />}
        {activePopup === 'mens-salon' && <MenSalonPopup onClose={closePopup} />}
        {activePopup === 'electrician' && <ElectricianPopup onClose={closePopup} />}
        {activePopup === 'plumber' && <PlumberPopup onClose={closePopup} />}
        {activePopup === 'carpenter' && <CarpenterPopup onClose={closePopup} />}
      </div>
      {/* Right: Image */}
      <FeatureImage />
      
      {/* Preload booking services page */}
      <Link href="/booking/services" prefetch={true} className="hidden" />
    </div>
  );
};

export default ServiceSelection;



