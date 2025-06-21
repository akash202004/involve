"use client";
import React, { useState, useEffect, useRef } from "react";
import { UserButton, useUser } from "@civic/auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from '../../booking/cart/cartContext';

// --- SVG Icon Components (Replaces @tabler/icons-react) ---
const IconMapPin = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M12 22s-8-4.5-8-11.5a8 8 0 0 1 16 0c0 7-8 11.5-8 11.5z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconChevronDown = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="6 9 12 15 18 9" />
  </svg>
);

const IconSearch = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconShoppingCart = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="9" cy="21" r="1" />
    <circle cx="20" cy="21" r="1" />
    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
  </svg>
);

const IconUser = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const IconX = ({ size = 24, className = "" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);


// Main Navbar Component
export default function App() {
  // Removed usePathname as it's a Next.js specific hook.
  // The logic to hide the navbar is removed for this standalone component.

  // --- STATE MANAGEMENT ---
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isLocationOpen, setIsLocationOpen] = useState(false);
  const [location, setLocation] = useState("");
  const [autoLocation, setAutoLocation] = useState<string>("");
  const [isLocationPopupOpen, setIsLocationPopupOpen] = useState(false);

  // --- REFS for Click Outside Logic ---
  const profileMenuRef = useRef<HTMLDivElement | null>(null);
  const locationRef = useRef<HTMLDivElement | null>(null);

  // --- NAVIGATION ITEMS ---
  const navItems = [
    { name: "Home", link: "/" },
    { name: "About Us", link: "/about" },
    { name: "Worker", link: "/worker" },
  ];

  // --- EVENT HANDLERS & EFFECTS ---
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setIsProfileMenuOpen(false);
      }
      if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
        setIsLocationOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [profileMenuRef, locationRef]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            if (data.display_name) {
              setAutoLocation(data.display_name);
              setLocation(data.display_name);
            }
          } catch (e) {}
        },
        () => {}
      );
    }
  }, []);

  const { user, signOut } = useUser();
  const router = useRouter();
  const { cart } = useCart();

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white font-sans border-b border-gray-200">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center h-20">

          {/* ====== Left Section: Logo and Main Navigation ====== */}
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex-shrink-0 font-bold text-2xl text-gray-800">
              Go-Fix-O
            </Link>
            <div className="hidden md:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  className="text-gray-600 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200"
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>

          {/* ====== Right Section: Actions and User Controls ====== */}
          <div className="flex items-center space-x-4">
            {/* Location Selector (Desktop) */}
            <div className="hidden lg:flex relative" ref={locationRef}>
              <button
                className="flex items-center space-x-2 border rounded-lg px-4 py-2 hover:bg-transparent transition w-64"
                onClick={() => setIsLocationOpen((v) => !v)}
                type="button"
              >
                <IconMapPin size={20} className="text-gray-500" />
                <span className="truncate text-gray-700 text-sm font-medium">
                  {location ? location : autoLocation ? autoLocation : "Select Location"}
                </span>
                <IconChevronDown size={18} className="text-gray-400" />
              </button>
              {isLocationOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border rounded-lg shadow-lg z-50 p-4">
                  <input
                    type="text"
                    className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    autoFocus
                    onClick={() => setIsLocationPopupOpen(true)}
                  />
                  {/* Optionally, add a list of suggestions here */}
                </div>
              )}
              {isLocationPopupOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                  <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-[90vw] min-w-[350px] mx-4 relative animate-fadeIn">
                    <button
                      className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                      onClick={() => setIsLocationPopupOpen(false)}
                      aria-label="Close"
                    >
                      &times;
                    </button>
                    <h2 className="text-xl font-bold mb-4 text-center text-gray-800">Your Current Location</h2>
                    {autoLocation ? (
                      <div className="text-gray-700 text-center break-words text-base font-medium whitespace-pre-line">{autoLocation}</div>
                    ) : (
                      <div className="text-gray-400 text-center">Location not available</div>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="hidden md:flex">
              <div className="flex items-center border rounded-lg px-3 py-2 w-56">
                <IconSearch size={20} className="text-gray-400 mr-2" />
                <input
                  type="text"
                  placeholder="Search for services..."
                  className="w-full outline-none bg-transparent text-gray-700 text-sm"
                />
              </div>
            </div>
            <div className="relative">
              <button className="p-2 rounded-full hover:bg-transparent transition-colors" onClick={() => router.push('/booking/cart')}>
                <IconShoppingCart size={24} className="text-gray-700" />
              </button>
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </div>
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                className="p-2 rounded-full hover:bg-transparent transition-colors focus:outline-none"
                aria-label="User Profile"
              >
                <IconUser size={24} className="text-gray-700" />
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-3 min-w-[12rem] bg-white rounded-md shadow-xl border border-gray-200 z-50 py-2 px-3 ring-1 ring-black ring-opacity-5 transition-all duration-150">
                  <div className="px-4 py-2">
                    {user ? (
                      <p className="text-sm text-gray-700">Hello, {user.name || 'User'}!</p>
                    ) : (
                      <p className="text-sm text-gray-700">Welcome, Guest!</p>
                    )}
                  </div>
                  <div className="border-t border-gray-100"></div>
                  {user ? (
                    <>
                      <button
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          router.push('/profile');
                        }}
                      >
                        Profile
                      </button>
                      <button
                        className="block w-full text-left px-4 py-2 mt-1 text-sm font-semibold text-white bg-yellow-500 rounded-md hover:bg-yellow-400 transition-colors duration-200"
                        onClick={() => {
                          setIsProfileMenuOpen(false);
                          signOut();
                        }}
                      >
                        Log Out
                      </button>
                      <div className="border-t border-gray-100"></div>
                    </>
                  ) : (
                    <div className="p-2">
                      <UserButton />
                    </div>
                  )}
                </div>
              )}
            </div>
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-600 hover:bg-transparent focus:outline-none"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <IconX size={24} />
                ) : (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ====== Mobile Navigation Menu (Dropdown) ====== */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 pt-4 pb-3 space-y-3">
            {/* Mobile Location Selector (input) */}
            <div className="flex items-center w-full border border-transparent rounded-lg px-3 py-2.5">
              <IconMapPin size={20} className="text-gray-500 mr-3 flex-shrink-0" />
              <input
                type="text"
                className="w-full outline-none bg-transparent text-gray-700 text-sm"
                placeholder="Enter your location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
              <IconChevronDown size={18} className="text-gray-400 ml-2 flex-shrink-0" />
            </div>

            {/* Mobile Search Bar */}
            <div className="flex items-center rounded-lg px-3 py-2.5 w-full">
              <IconSearch size={20} className="text-gray-400 mr-3 flex-shrink-0" />
              <input type="text" placeholder="Search for services..." className="w-full outline-none bg-transparent text-gray-700 text-sm" />
            </div>

            {/* Divider */}
            <div className="border-t border-gray-200 !my-3"></div>
            
            {/* Mobile Nav Links */}
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.link}
                  className="block text-gray-600 hover:bg-gray-100 hover:text-blue-600 px-3 py-2 rounded-md text-base font-medium transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
