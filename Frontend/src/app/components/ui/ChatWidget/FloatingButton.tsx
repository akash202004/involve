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
        .final-blue-button {
          position: fixed;
          bottom: 24px;
          right: 24px;
          height: 64px;
          width: 64px;
          /* THE DEEPER BLUE COLOR YOU REQUESTED */
          background-color: #1D4ED8; 
          border-radius: 9999px;
          border: none;
          /* A shadow that matches the new, deeper blue */
          box-shadow: 0 10px 25px -5px rgba(29, 78, 216, 0.5), 0 8px 10px -6px rgba(29, 78, 216, 0.3);
          cursor: pointer;
          outline: none;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease-out;
        }
        .final-blue-button:hover {
          transform: scale(1.1);
          /* A slightly lighter blue on hover for a nice effect */
          background-color: #2563EB;
        }
      `}</style>
      <button
        onClick={onClick}
        className="final-blue-button"
        aria-label="Open AI Assistant"
      >
        <VoiceIcon />
      </button>
    </>
  );
};

export default FloatingButton;