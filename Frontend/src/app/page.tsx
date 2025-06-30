"use client"

import ChatModal from '@/app/components/ui/ChatWidget/ChatModal';
import Image from "next/image";
import ServiceSelection from '@/app/components/Feature/Page';
import WaitingTime from "@/app/components/Waiting-Time/Page";
import FAQ from "@/app/components/FAQ/Page";
import Testimonial from "@/app/components/Testimonial/page";
import { useState } from 'react';
import FloatingButton from './components/ui/ChatWidget/FloatingButton';
export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false);

  return (
    <div className="w-full max-w-4xl mx-auto">
      <ServiceSelection />
      {/* New Section: Car Struck Banner */}
      <div className="w-full flex flex-col items-center justify-center pt-8 pb-8 px-2 sm:px-4 max-w-4xl mx-auto">
        <div className="w-full p-2 sm:p-6 bg-yellow-400 rounded-2xl border border-black">
          <span className="text-white text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight mb-6 block">
            you car struck in the<br className="hidden sm:block" />
            middle of road like this
          </span>
          <button className="mt-6 px-6 py-3 bg-black rounded-lg text-white font-semibold text-base sm:text-lg shadow-md hover:bg-gray-900 transition-colors duration-200">
            <span className="tracking-wider">Get help now</span>
          </button>
        </div>
      </div>
      {/* Feature Section */}
      <div className="w-full flex flex-col items-center justify-center px-2 sm:px-4 max-w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto py-8">
        {/* Mechanic Services */}
        <div className="mb-8 w-full">
          <div className="flex justify-between items-center mb-4 px-2 sm:px-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Mechanic Services</h2>
            {/* See all button removed */}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 overflow-x-auto pb-2 hide-scrollbar">
            {[
              { name: "Car Service", icon: "🚗" },
              { name: "Bike Service", icon: "🏍️" },
              { name: "Emergency Service", icon: "🚨" },
              { name: "Tire Leak", icon: "🛞" }
            ].map((item, idx) => (
              <div key={item.name} className="feature-card-mechanic">
                <div className="icon-mechanic">{item.icon}</div>
                <span className="font-medium text-gray-800 text-center text-xs sm:text-sm md:text-base leading-tight">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Home repair & installation */}
        <div className="mb-8 w-full">
          <div className="flex justify-between items-center mb-4 px-2 sm:px-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Home repair & installation</h2>
            {/* See all button removed */}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 overflow-x-auto pb-2 hide-scrollbar">
            {[
              { name: "Tap repair", img: "/Assets/top_service/water-tap.png" },
              { name: "Electrician consultation", img: "/Assets/top_service/electrician.png" },
              { name: "Curtain rod installation", img: "/Assets/top_service/window.png" },
              { name: "Fan repair", img: "/Assets/top_service/fan.png" }
            ].map((item, idx) => (
              <div key={item.name} className="feature-card-home-repair">
                <div className="icon-home-repair">
                  <Image src={item.img} alt={item.name} width={48} height={48} className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                </div>
                <span className="font-medium text-gray-800 text-center text-xs sm:text-sm md:text-base leading-tight">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Massage & Salon for Men */}
        <div className="mb-8 w-full">
          <div className="flex justify-between items-center mb-4 px-2 sm:px-0">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-800">Massage & Salon for Men</h2>
            {/* See all button removed */}
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6 overflow-x-auto pb-2 hide-scrollbar">
            {[
              { name: "Haircut", img: "/Assets/top_service/hair-cutting.png" },
              { name: "Beard Trim", img: "/Assets/top_service/hair-cutting.png" }, // No beard icon, using haircut as placeholder
              { name: "Pain relief", img: "/Assets/top_service/head-massage.png" },
              { name: "Stress relief", img: "/Assets/top_service/body-spa.png" }
            ].map((item, idx) => (
              <div key={item.name} className="feature-card-salon">
                <div className="icon-salon">
                  <Image src={item.img} alt={item.name} width={48} height={48} className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12" />
                </div>
                <span className="font-medium text-gray-800 text-center text-xs sm:text-sm md:text-base leading-tight">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style jsx global>{`
        .feature-card {
          min-width: 120px;
          max-width: 180px;
          min-height: 120px;
          max-height: 150px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #fff;
          border-radius: 1rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          border: 1px solid #e5e7eb;
          padding: 1.25rem;
          cursor: pointer;
          transition: box-shadow 0.2s, border-color 0.2s;
        }
        @media (min-width: 640px) {
          .feature-card { min-width: 150px; }
        }
        @media (min-width: 1024px) {
          .feature-card { min-width: 180px; }
        }
        .feature-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.10);
          border-color: #fdc700;
        }
        .feature-card .icon {
          width: 64px;
          height: 64px;
          background: #f3f4f6;
          border-radius: 0.75rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.75rem;
          font-size: 2.5rem;
        }
        
        /* Mechanic Services Specific Styles */
        .feature-card-mechanic {
          min-width: 100px;
          max-width: 160px;
          min-height: 100px;
          max-height: 140px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #fff;
          border-radius: 0.75rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          border: 1px solid #e5e7eb;
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        @media (min-width: 640px) {
          .feature-card-mechanic { 
            min-width: 120px; 
            min-height: 120px;
            padding: 1rem;
          }
        }
        @media (min-width: 768px) {
          .feature-card-mechanic { 
            min-width: 140px; 
            min-height: 130px;
            padding: 1.25rem;
          }
        }
        @media (min-width: 1024px) {
          .feature-card-mechanic { 
            min-width: 160px; 
            min-height: 140px;
          }
        }
        .feature-card-mechanic:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.10);
          border-color: #fdc700;
          transform: translateY(-2px);
        }
        .feature-card-mechanic .icon-mechanic {
          width: 48px;
          height: 48px;
          background: #f3f4f6;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
          font-size: 1.5rem;
        }
        @media (min-width: 640px) {
          .feature-card-mechanic .icon-mechanic {
            width: 56px;
            height: 56px;
            border-radius: 0.75rem;
            margin-bottom: 0.75rem;
            font-size: 2rem;
          }
        }
        @media (min-width: 768px) {
          .feature-card-mechanic .icon-mechanic {
            width: 64px;
            height: 64px;
            margin-bottom: 1rem;
            font-size: 2.5rem;
          }
        }
        
        /* Home Repair & Installation Specific Styles */
        .feature-card-home-repair {
          min-width: 100px;
          max-width: 160px;
          min-height: 100px;
          max-height: 140px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #fff;
          border-radius: 0.75rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          border: 1px solid #e5e7eb;
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        @media (min-width: 640px) {
          .feature-card-home-repair { 
            min-width: 120px; 
            min-height: 120px;
            padding: 1rem;
          }
        }
        @media (min-width: 768px) {
          .feature-card-home-repair { 
            min-width: 140px; 
            min-height: 130px;
            padding: 1.25rem;
          }
        }
        @media (min-width: 1024px) {
          .feature-card-home-repair { 
            min-width: 160px; 
            min-height: 140px;
          }
        }
        .feature-card-home-repair:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.10);
          border-color: #fdc700;
          transform: translateY(-2px);
        }
        .feature-card-home-repair .icon-home-repair {
          width: 48px;
          height: 48px;
          background: #f3f4f6;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }
        @media (min-width: 640px) {
          .feature-card-home-repair .icon-home-repair {
            width: 56px;
            height: 56px;
            border-radius: 0.75rem;
            margin-bottom: 0.75rem;
          }
        }
        @media (min-width: 768px) {
          .feature-card-home-repair .icon-home-repair {
            width: 64px;
            height: 64px;
            margin-bottom: 1rem;
          }
        }
        
        /* Salon & Massage Services Specific Styles */
        .feature-card-salon {
          min-width: 100px;
          max-width: 160px;
          min-height: 100px;
          max-height: 140px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: #fff;
          border-radius: 0.75rem;
          box-shadow: 0 2px 8px rgba(0,0,0,0.04);
          border: 1px solid #e5e7eb;
          padding: 0.75rem;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        @media (min-width: 640px) {
          .feature-card-salon { 
            min-width: 120px; 
            min-height: 120px;
            padding: 1rem;
          }
        }
        @media (min-width: 768px) {
          .feature-card-salon { 
            min-width: 140px; 
            min-height: 130px;
            padding: 1.25rem;
          }
        }
        @media (min-width: 1024px) {
          .feature-card-salon { 
            min-width: 160px; 
            min-height: 140px;
          }
        }
        .feature-card-salon:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.10);
          border-color: #fdc700;
          transform: translateY(-2px);
        }
        .feature-card-salon .icon-salon {
          width: 48px;
          height: 48px;
          background: #f3f4f6;
          border-radius: 0.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 0.5rem;
        }
        @media (min-width: 640px) {
          .feature-card-salon .icon-salon {
            width: 56px;
            height: 56px;
            border-radius: 0.75rem;
            margin-bottom: 0.75rem;
          }
        }
        @media (min-width: 768px) {
          .feature-card-salon .icon-salon {
            width: 64px;
            height: 64px;
            margin-bottom: 1rem;
          }
        }
        
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <FAQ />
      <Testimonial />
      <WaitingTime />
      <FloatingButton onClick={() => setIsChatOpen(true)} />
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </div>
  );
}
