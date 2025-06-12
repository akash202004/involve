'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface Video {
  id: number;
  title: string;
  src: string;
  srcLow: string; // Low quality video source
  description: string;
}

interface VideoCarouselProps {
  videos: Video[];
}

const VideoCarousel: React.FC<VideoCarouselProps> = ({ videos }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const videoRefs = useRef<HTMLVideoElement[]>([]);

  const handleResize = useCallback(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize]);

  useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (video && !video.src.includes('youtube')) {
        if (index === currentIndex) {
          // Try to play the video, but handle autoplay restrictions gracefully
          const playPromise = video.play();
          if (playPromise !== undefined) {
            playPromise.catch((error) => {
              // Autoplay was prevented, this is normal behavior
              console.log('Autoplay prevented:', error);
            });
          }
        } else {
          video.pause();
          video.currentTime = 0;
        }
      }
    });
  }, [currentIndex]);

  const nextVideo = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % videos.length);
  };

  const prevVideo = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + videos.length) % videos.length);
  };

  const isYouTubeVideo = (src: string) => {
    return src.includes('youtube.com/embed');
  };

  return (
    <div className="relative w-full h-[400px] rounded-lg bg-transparent flex items-center justify-center overflow-hidden">
      <AnimatePresence initial={false}>
        {videos.map((video, index) => (
          <motion.div
            key={video.id}
            className={`absolute w-[50%] h-[90%] rounded-2xl flex items-center justify-center overflow-hidden
                        ${index === currentIndex ? 'z-20' : 'z-10'} 
                        ${index === (currentIndex + 1) % videos.length ? 'z-0' : ''} 
                        ${index === (currentIndex - 1 + videos.length) % videos.length ? 'z-0' : ''}`}
            initial={{ scale: 0.8, x: index > currentIndex ? '100%' : '-100%', opacity: 0, rotateY: index > currentIndex ? 45 : -45 }}
            animate={{ 
              scale: index === currentIndex ? 1 : 0.8, 
              x: index === currentIndex ? 0 : index > currentIndex ? '100%' : '-100%', 
              opacity: index === currentIndex ? 1 : 0.3,
              rotateY: index === currentIndex ? 0 : index > currentIndex ? 45 : -45
            }}
            exit={{ scale: 0.8, x: index < currentIndex ? '-100%' : '100%', opacity: 0, rotateY: index < currentIndex ? -45 : 45 }}
            transition={{ duration: 0.7, ease: "easeInOut" }}
          >
            <div className="relative w-full h-full group">
              {isYouTubeVideo(video.src) ? (
                <iframe
                  src={`${video.src}?autoplay=${index === currentIndex ? 1 : 0}&mute=1&loop=1&playlist=${video.src.split('/').pop()}`}
                  className="w-full h-full object-cover"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <video
                  ref={(el) => {
                    videoRefs.current[index] = el!;
                  }}
                  src={isMobile ? video.srcLow : video.src}
                  className="w-full h-full object-cover"
                  autoPlay={index === currentIndex}
                  loop
                  muted
                  playsInline
                  preload="metadata"
                />
              )}
              <div className={`absolute max-w-96 bg-transparent backdrop-blur-none bottom-0 left-0 right-0 p-6 text-white transform ${
                isMobile ? '' : 'translate-y-full group-hover:translate-y-0'
              } transition-transform duration-300 ease-in-out`}>
                <span className="text-3xl font-bold">{video.title}</span>
                <p className="text-sm opacity-80 mt-1">{video.description}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
      <button 
        onClick={prevVideo} 
        aria-label="Previous video"
        className="absolute left-3 sm:left-8 z-30 text-white text-6xl opacity-50 hover:opacity-100 transition-opacity duration-300"
      >
        &#8249;
      </button>
      <button 
        onClick={nextVideo} 
        aria-label="Next video"
        className="absolute right-3 sm:right-8 z-30 text-white text-6xl opacity-50 hover:opacity-100 transition-opacity duration-300"
      >
        &#8250;
      </button>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {videos.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-3 h-3 rounded-full ${index === currentIndex ? 'bg-white' : 'bg-gray-400'} transition-colors duration-300`}
            aria-label={`Go to video ${index + 1}`}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default VideoCarousel;
