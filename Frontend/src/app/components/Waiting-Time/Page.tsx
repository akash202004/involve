'use client';

import React, { useEffect, useRef, useState } from "react";

// --- Constants for clock dimensions ---
const CLOCK_SIZE = 320; // px
const ARC_RADIUS = 140; // px
const ARC_STROKE = 12; // px
const HAND_LENGTH = 110; // px
const HAND_WIDTH = 4; // px

// --- Helper functions for SVG arc creation ---
function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
const a = ((angle - 90) * Math.PI) / 180.0;
return {
x: cx + r * Math.cos(a),
 y: cy + r * Math.sin(a),
 };
}

function describeArc(
cx: number,
 cy: number,
 r: number,
 startAngle: number,
 endAngle: number
) {
 const start = polarToCartesian(cx, cy, r, endAngle);
 const end = polarToCartesian(cx, cy, r, startAngle);
 const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
 const d = [
 "M", start.x, start.y,
 "A", r, r, 0, largeArcFlag, 0, end.x, end.y
 ].join(" ");
 return d;
}

export default function WaitingTime() {
 // --- Refs for SVG elements ---
 const blueArcRef = useRef<SVGPathElement>(null);
 const orangeArcRef = useRef<SVGPathElement>(null);
 const borderCircleRef = useRef<SVGCircleElement>(null);

 // --- State for hand rotations (can be used for debugging or other UI elements) ---
const [minuteRotation, setMinuteRotation] = useState(0);
 const [hourRotation, setHourRotation] = useState(0);

 // --- Refs for animation state ---
 const virtualElapsedRef = useRef(0);
 const lastTimestampRef = useRef(0);

 // --- Animation Loop ---
 useEffect(() => {
 let animationFrameId: number;
 const startTime = performance.now();
 lastTimestampRef.current = startTime;

 function animate(now: number) {
 // Calculate delta time since last frame for smooth animation
 const delta = (now - lastTimestampRef.current) / 1000; // in seconds
 lastTimestampRef.current = now;

 // --- Constant Speed Logic ---
 const speed = 100; // Much faster speed for a 'light speed' effect
 
// Increment virtual time smoothly
 virtualElapsedRef.current += delta * speed;

 const newVirtualElapsed = virtualElapsedRef.current;
 
 // --- Rotation Calculation ---
      // The arcs are the fastest, based on a 60-second cycle. The modulo keeps them repeating.
 const arcRotation = (newVirtualElapsed % 60) / 60 * 360;

      // To match the ring speed, the minute hand now completes a full rotation every 60 virtual seconds.
      // The modulo operator is still omitted for continuous, infinite rotation.
 const minuteRot = (newVirtualElapsed / 60) * 360;

 // The "hour" hand moves 12 times slower than the "minute" hand.
 const hourRot = minuteRot / 12;

 setMinuteRotation(minuteRot);
 setHourRotation(hourRot);

 // --- Update SVG element transforms directly for performance ---
      if (blueArcRef.current) {
        // The blue arc follows the main arc rotation
        blueArcRef.current.setAttribute("transform", `rotate(${arcRotation} ${CLOCK_SIZE / 2} ${CLOCK_SIZE / 2})`);
      }
      if (orangeArcRef.current) {
        // The orange arc is offset by 180 degrees
        const orangeArcRotation = (arcRotation + 180) % 360;
        orangeArcRef.current.setAttribute("transform", `rotate(${orangeArcRotation} ${CLOCK_SIZE / 2} ${CLOCK_SIZE / 2})`);
      }
      if (borderCircleRef.current) {
        // *** MODIFICATION: Rotate the black border in the SAME direction as the yellow rings ***
        borderCircleRef.current.setAttribute("transform", `rotate(${arcRotation} ${CLOCK_SIZE / 2} ${CLOCK_SIZE / 2})`);
      }

 animationFrameId = requestAnimationFrame(animate);
 }

 animationFrameId = requestAnimationFrame(animate);

 // Cleanup function to stop the animation when the component is unmounted
 return () => cancelAnimationFrame(animationFrameId);
 }, []); // Empty dependency array ensures this effect runs only once on mount

 // --- Pre-calculate static SVG arc paths ---
 const blueArcPath = describeArc(CLOCK_SIZE / 2, CLOCK_SIZE / 2, ARC_RADIUS, 120, 300); const orangeArcPath = describeArc(CLOCK_SIZE / 2, CLOCK_SIZE / 2, ARC_RADIUS, 300, 120);

 return (
 <div className="w-full min-h-screen flex items-center justify-center bg-white py-8 md:py-16">
 <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 w-full max-w-5xl px-4">
 {/* --- Clock Face --- */}
 <div
 className="relative flex items-center justify-center w-full max-w-xs md:max-w-md lg:max-w-lg"
  style={{ width: '100%', height: 'auto', minWidth: 0, border: 'none', boxShadow: 'none', background: 'transparent' }} >
 {/* --- SVG Clock --- */}
<svg
 width={CLOCK_SIZE}
 height={CLOCK_SIZE}
 viewBox={`0 0 ${CLOCK_SIZE} ${CLOCK_SIZE}`}
 className="relative z-10 w-full h-auto"
 style={{ maxWidth: CLOCK_SIZE, maxHeight: CLOCK_SIZE }}
 >
 {/* --- SVG Definitions (Gradients, Patterns) --- */}
 <defs>
 <pattern id="dots" x="0" y="0" width="6" height="6" patternUnits="userSpaceOnUse">
 <circle cx="1.5" cy="1.5" r="1" fill="#e0e0e0" />
 </pattern>
 <radialGradient id="faceGlow" cx="50%" cy="50%" r="50%">
 <stop offset="0%" stopColor="#f5f5f5" stopOpacity="0.7" />
 <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
 </radialGradient>
 <linearGradient id="blueArcGradient" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stopColor="#fdc700" stopOpacity="0.95" />
 <stop offset="100%" stopColor="#fdc700" stopOpacity="0.85" />
 </linearGradient>
 <linearGradient id="orangeArcGradient" x1="1" y1="0" x2="0" y2="1">
 <stop offset="0%" stopColor="#fdc700" stopOpacity="0.95" />
<stop offset="100%" stopColor="#fdc700" stopOpacity="0.85" />
 </linearGradient>
</defs>

 {/* --- Clock Layers --- */}
{/* <circle ref={borderCircleRef} cx={CLOCK_SIZE / 2} cy={CLOCK_SIZE / 2} r={CLOCK_SIZE / 2 - 8} fill="url(#faceGlow)" stroke="#000" strokeWidth="3" strokeDasharray="20 10" /> */}
<circle cx={CLOCK_SIZE / 2} cy={CLOCK_SIZE / 2} r={CLOCK_SIZE / 2 - 16} fill="url(#dots)" opacity="0.25" />
 
 <path ref={blueArcRef} d={blueArcPath} stroke="url(#blueArcGradient)" strokeWidth={ARC_STROKE} strokeLinecap="round" fill="none" />
 <path ref={orangeArcRef} d={orangeArcPath} stroke="url(#orangeArcGradient)" strokeWidth={ARC_STROKE} strokeLinecap="round" fill="none" />
 <circle cx={CLOCK_SIZE / 2} cy={CLOCK_SIZE / 2} r={18} fill="#fff" opacity="0.12" />
<rect
              x={CLOCK_SIZE / 2 - HAND_WIDTH / 2}
              y={CLOCK_SIZE / 2 - HAND_LENGTH + 30}
              width={HAND_WIDTH}
              height={HAND_LENGTH - 30}
              rx={HAND_WIDTH / 2}
              fill="#000"
              opacity="0.85"
              style={{ filter: "none" }}
              transform={`rotate(${hourRotation} ${CLOCK_SIZE / 2} ${CLOCK_SIZE / 2})`}
            />
            <rect
              x={CLOCK_SIZE / 2 - HAND_WIDTH / 2}
              y={CLOCK_SIZE / 2 - HAND_LENGTH}
              width={HAND_WIDTH}
              height={HAND_LENGTH}
              rx={HAND_WIDTH / 2}
              fill="#fdc700"
              opacity="0.95"
              transform={`rotate(${minuteRotation} ${CLOCK_SIZE / 2} ${CLOCK_SIZE / 2})`}
            />
<circle cx={CLOCK_SIZE / 2} cy={CLOCK_SIZE / 2} r={8} fill="#000" opacity="0.95" style={{ filter: "none" }} />
</svg>
 </div>

 {/* --- Text Content --- */}
 <div className="flex flex-col items-center md:items-start text-center md:text-left w-full max-w-lg">
<h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
Tired of Waiting for That "One Known Guy"?
</h1>
 <p className="text-base md:text-lg text-gray-600 mb-8 max-w-xl">
 Skip the endless calls and no-shows. With Go-Fix-O, you can find verified workers nearby — plumbers, electricians, carpenters & more — and get help at your doorstep, instantly.<br /><br />
 Track their arrival in real-time with our animated clock.<br />
 No more guessing. No more delays.
 </p>
 <button
 className="px-8 py-3 rounded-lg border-2 border-black bg-white text-black font-semibold text-lg transition-colors duration-200 hover:bg-[#fdc700] focus:outline-none focus:ring-2 focus:ring-black"
 >
 Get Things Fixed. Fast
 </button>
 </div>
 </div>
 </div>
 );
}
