'use client';

import React from 'react';

const VoiceIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <line x1="8" y1="23" x2="16" y2="23" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

interface FloatingButtonProps {
  onClick: () => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ onClick }) => {
  return (
    <>
      <style>{`
        .final-yellow-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          height: 64px;
          width: 64px;
          background-color: #FACC15; /* Yellow */
          border-radius: 9999px;
          border: none;
          box-shadow: 0 10px 25px -5px rgba(250, 204, 21, 0.5), 0 8px 10px -6px rgba(250, 204, 21, 0.3);
          cursor: pointer;
          outline: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease-out;
        }
        .final-yellow-button:hover {
          transform: scale(1.1);
          background-color: #fde047; /* Lighter yellow on hover */
        }
      `}</style>
      <button
        onClick={onClick}
        className="final-yellow-button"
        aria-label="Open AI Assistant"
      >
        <VoiceIcon />
      </button>
    </>
  );
};

export default FloatingButton;