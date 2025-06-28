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
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Mechanic Services</h2>
            {/* See all button removed */}
          </div>
          <div className="flex gap-4 gap-x-6 overflow-x-auto pb-2 hide-scrollbar">
            {[
              { name: "Car Service", icon: "🚗" },
              { name: "Bike Service", icon: "🏍️" },
              { name: "Emergency Service", icon: "🚨" },
              { name: "Tire Leak", icon: "🛞" }
            ].map((item, idx) => (
              <div key={item.name} className="feature-card">
                <div className="icon">{item.icon}</div>
                <span className="font-medium text-gray-800 text-center">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Home repair & installation */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Home repair & installation</h2>
            {/* See all button removed */}
          </div>
          <div className="flex gap-4 gap-x-6 overflow-x-auto pb-2 hide-scrollbar">
            {[
              { name: "Tap repair", img: "/Assets/top_service/water-tap.png" },
              { name: "Electrician consultation", img: "/Assets/top_service/electrician.png" },
              { name: "Curtain rod installation", img: "/Assets/top_service/window.png" },
              { name: "Fan repair", img: "/Assets/top_service/fan.png" }
            ].map((item, idx) => (
              <div key={item.name} className="feature-card">
                <div className="icon">
                  <Image src={item.img} alt={item.name} width={48} height={48} />
                </div>
                <span className="font-medium text-gray-800 text-center">{item.name}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Massage & Salon for Men */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Massage & Salon for Men</h2>
            {/* See all button removed */}
          </div>
          
          <div className="flex gap-4 gap-x-6 overflow-x-auto pb-2 hide-scrollbar">
            {[
              { name: "Haircut", img: "/Assets/top_service/hair-cutting.png" },
              { name: "Beard Trim", img: "/Assets/top_service/hair-cutting.png" }, // No beard icon, using haircut as placeholder
              { name: "Pain relief", img: "/Assets/top_service/head-massage.png" },
              { name: "Stress relief", img: "/Assets/top_service/body-spa.png" }
            ].map((item, idx) => (
              <div key={item.name} className="feature-card">
                <div className="icon">
                  <Image src={item.img} alt={item.name} width={48} height={48} />
                </div>
                <span className="font-medium text-gray-800 text-center">{item.name}</span>
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
