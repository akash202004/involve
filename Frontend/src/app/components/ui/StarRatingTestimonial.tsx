'use client';
import Image from 'next/image';
import React, { useState } from 'react';
import { motion } from 'framer-motion';

type Mode = 'light' | 'dark';

interface Testimonial {
  image: string;
  name: string;
  jobtitle: string;
  text: string;
  rating: number;
}

interface TestimonialProps {
  testimonials: Testimonial[];
  mode?: Mode;
}

const StarRatingTestimonial: React.FC<TestimonialProps> = ({ testimonials, mode = 'light' }) => {
  const [showAll, setShowAll] = useState(false);
  const maxDisplayedTestimonials = 6;

  const handleLoadMore = () => {
    setShowAll(true);
  };

  
  return (
    <div className="w-full">
      <div className='flex flex-col items-center justify-center pt-5'>
        <div className='flex flex-col gap-5 mb-8'>
          <span className='text-center text-4xl font-bold text-gray-800'>Read what people are saying</span>
        </div>
      </div>
      <div className='relative'>
        <div className={`flex justify-center items-center gap-5 flex-wrap overflow-hidden ${showAll || testimonials.length <= maxDisplayedTestimonials ? '' : 'max-h-[720px]'} relative`}>
          {testimonials.slice(0, showAll || testimonials.length <= maxDisplayedTestimonials ? testimonials.length : maxDisplayedTestimonials).map((testimonial, index) => (
            <motion.div
              key={index}
              className={`${mode === 'dark' ? 'bg-black' : 'bg-white'} border border-gray-200 w-96 h-auto rounded-2xl p-5 relative transition-colors duration-300 hover:border-yellow-500`}
              whileHover={{ scale: 1.05, boxShadow: "0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
              transition={{ duration: 0.3 }}
            >
              <div className='flex items-center'>
                {[...Array(testimonial.rating)].map((_, starIndex) => (
                  <svg
                    key={starIndex}
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className={`w-7 h-7 ${mode === 'dark' ? 'text-yellow-400' : 'text-yellow-500'}`}
                  >
                    <path
                      fillRule='evenodd'
                      d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z'
                      clipRule='evenodd'
                    />
                  </svg>
                ))}
                {[...Array(Math.max(0, 5 - testimonial.rating))].map((_, starIndex) => (
                  <svg
                    key={starIndex}
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 24 24'
                    fill='currentColor'
                    className='w-7 h-7 text-gray-300'
                  >
                    <path
                      fillRule='evenodd'
                      d='M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z'
                      clipRule='evenodd'
                    />
                  </svg>
                ))}
              </div>
              <div className='mt-5 mb-5'>
                <span className={`${mode === 'dark' ? 'text-slate-100' : 'text-gray-700'}`}>
                  {testimonial.text}
                </span>
              </div>
              <hr />
              <div className='flex items-center mt-5'>
                <div className='flex flex-col'>
                  <span className={`${mode === 'dark' ? 'text-white' : 'text-gray-800 font-semibold'}`}>
                    {testimonial.name}
                  </span>
                  <span className={`text-sm ${mode === 'dark' ? 'text-slate-400' : 'text-gray-500'}`}>
                    {testimonial.jobtitle}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        {testimonials.length > maxDisplayedTestimonials && !showAll && (
          <div className='absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20'>
            <button
              className='bg-white text-black px-4 py-2 rounded getstarted'
              onClick={handleLoadMore}
            >
              Load More
            </button>
          </div>
        )}
        {!showAll && (
          <div className='absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-black to-transparent hidden'></div>
        )}
      </div>
    </div>
  );
};

export default StarRatingTestimonial;