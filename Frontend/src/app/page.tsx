'use client';
import { useState } from 'react';
import FloatingButton from '@/app/components/ui/ChatWidget/FloatingButton';
import ChatModal from '@/app/components/ui/ChatWidget/ChatModal';
import WaitingTime from '@/app/components/Waiting-Time/Page';

export default function Home() {
  const [isChatOpen, setIsChatOpen] = useState(false); //added
  return (  
    <>
    
      <div className="min-h-screen flex flex-col items-center justify-center px-4 sm:px-8 pt-32 sm:pt-40 md:pt-48 pb-8">
        <div className="relative w-full bg-transparent flex items-center justify-center overflow-hidden">
          
        </div>
        <div className="w-full flex items-center justify-center">
        
        </div>
        <div className="w-full flex items-center justify-center">
        
        </div>
        <div className="w-full flex items-center justify-center">
          <WaitingTime/>
        </div>
      </div>
       <FloatingButton onClick={() => setIsChatOpen(true)} />
      <ChatModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  );
}
