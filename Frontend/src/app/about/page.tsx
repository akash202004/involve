"use client";

import React from "react";

const AboutPage: React.FC = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center pt-32 pb-16 px-0 min-h-[80vh]">
      {/* Full-width About Card, no yellow bar or border */}
      <div className="w-full p-0 sm:p-6 bg-white rounded-none sm:rounded-2xl relative">
        <div className="relative z-10 pt-6 px-4 sm:px-12 md:px-24 lg:px-32 xl:px-48">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 mb-4 text-center passion-one-black">About Track-n-Fix</h1>
          <p className="text-base sm:text-lg text-gray-700 mb-6 text-center">
            <span className="font-semibold">Track-n-Fix</span> is your trusted platform for booking home services with real-time tracking and transparent pricing. Our mission is to make your life easier by connecting you with skilled professionals for all your household needs—quickly, safely, and reliably.
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Our Mission</h2>
          <p className="text-gray-700 mb-4">
            We believe in empowering users with technology that brings convenience and peace of mind. From beauty and wellness to repairs and cleaning, we ensure every service is delivered with professionalism and care.
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">Why Choose Us?</h2>
          <ul className="list-disc pl-6 text-gray-700 mb-4">
            <li>Real-time tracking of your service professional</li>
            <li>Verified and skilled workers</li>
            <li>Transparent, upfront pricing</li>
            <li>Wide range of services for every need</li>
            <li>Easy booking and secure payment options</li>
          </ul>
          <p className="text-gray-700">
            Whether you need a quick fix, a deep clean, or a relaxing spa day at home, Track-n-Fix is here to help—anytime, anywhere.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutPage; 