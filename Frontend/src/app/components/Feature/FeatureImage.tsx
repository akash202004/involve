import React from 'react';
import Image from 'next/image';

const FeatureImage: React.FC = () => (
  <div className="hidden lg:flex flex-1 h-full w-full max-w-xs sm:max-w-md md:max-w-xl items-center justify-center mb-6 lg:mb-0 mt-22">
    <Image
      src="/Assets/Home/LandingImage.png"
      alt="Home services at your doorstep"
      className="rounded-lg object-cover w-full h-auto max-h-[320px] sm:max-h-[400px] md:max-h-[600px] shadow-lg"
      priority
      width={600}
      height={400}
    />
  </div>
);

export default FeatureImage; 