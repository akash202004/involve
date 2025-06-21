'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useUser } from '@civic/auth/react';
import { useCart } from '../cart/cartContext';

interface ServiceDetails {
  name: string;
  description: string;
  price: number;
  duration: string;
  icon: string;
  category: string;
}

const ServiceBookingPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceName = searchParams.get('service') || 'Haircut';
  const category = searchParams.get('category') || 'Hair Services';
  const { user, signIn } = useUser();
  const { cart, addToCart } = useCart();

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedWorker, setSelectedWorker] = useState<string>('');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('cod');
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);
  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Comprehensive service details mapping
  const serviceDetails: Record<string, ServiceDetails> = {
    // MenSaloon & WomenSaloon
    'Haircut': { name: 'Haircut', description: 'Professional haircut service', price: 299, duration: '30-45 min', icon: '✂️', category: 'Hair Services' },
    'Hair Color': { name: 'Hair Color', description: 'Professional hair coloring', price: 899, duration: '1-2 hours', icon: '🎨', category: 'Hair Services' },
    'Hair Styling': { name: 'Hair Styling', description: 'Creative hair styling', price: 499, duration: '45-60 min', icon: '💇‍♂️', category: 'Hair Services' },
    'Hair Treatment': { name: 'Hair Treatment', description: 'Deep conditioning and repair', price: 599, duration: '45-60 min', icon: '💆‍♂️', category: 'Hair Services' },
    'Hair Spa': { name: 'Hair Spa', description: 'Relaxing hair spa', price: 799, duration: '60-90 min', icon: '🧖‍♂️', category: 'Hair Services' },
    'Beard Trim': { name: 'Beard Trim', description: 'Beard trimming and shaping', price: 199, duration: '20-30 min', icon: '🪒', category: 'Grooming Services' },
    'Shave': { name: 'Shave', description: 'Traditional hot towel shave', price: 299, duration: '30-45 min', icon: '🪒', category: 'Grooming Services' },
    'Beard Styling': { name: 'Beard Styling', description: 'Beard styling and grooming', price: 399, duration: '30-45 min', icon: '🧔', category: 'Grooming Services' },
    'Facial': { name: 'Facial', description: 'Rejuvenating facial treatment', price: 399, duration: '45-60 min', icon: '✨', category: 'Grooming Services' },
    'Threading': { name: 'Threading', description: 'Eyebrow and face threading', price: 99, duration: '15-20 min', icon: '🧵', category: 'Grooming Services' },
    'Waxing': { name: 'Waxing', description: 'Professional waxing', price: 199, duration: '20-30 min', icon: '🪒', category: 'Grooming Services' },
    'Manicure': { name: 'Manicure', description: 'Nail care and polish', price: 299, duration: '30-45 min', icon: '💅', category: 'Grooming Services' },
    'Pedicure': { name: 'Pedicure', description: 'Foot care and polish', price: 399, duration: '45-60 min', icon: '🦶', category: 'Grooming Services' },
    'Makeup': { name: 'Makeup', description: 'Professional makeup', price: 899, duration: '60-90 min', icon: '💄', category: 'Beauty Services' },
    'Hair Extensions': { name: 'Hair Extensions', description: 'Hair extension service', price: 1499, duration: '2-3 hours', icon: '👩‍🦱', category: 'Hair Services' },
    // Massage
    'Head Massage': { name: 'Head Massage', description: 'Relaxing head massage', price: 299, duration: '30-45 min', icon: '💆‍♂️', category: 'Massage Services' },
    'Body Massage': { name: 'Body Massage', description: 'Full body massage', price: 799, duration: '60-90 min', icon: '💆‍♂️', category: 'Massage Services' },
    'Foot Massage': { name: 'Foot Massage', description: 'Therapeutic foot massage', price: 399, duration: '30-45 min', icon: '🦶', category: 'Massage Services' },
    'Thai Massage': { name: 'Thai Massage', description: 'Traditional Thai massage', price: 999, duration: '90-120 min', icon: '🧘‍♂️', category: 'Massage Services' },
    'Deep Tissue': { name: 'Deep Tissue', description: 'Deep tissue massage', price: 899, duration: '60-90 min', icon: '💪', category: 'Massage Services' },
    'Relaxation': { name: 'Relaxation', description: 'Gentle relaxation massage', price: 599, duration: '45-60 min', icon: '😌', category: 'Massage Services' },
    // Cleaning
    'Home Cleaning': { name: 'Home Cleaning', description: 'Complete home cleaning', price: 599, duration: '2-3 hours', icon: '🏠', category: 'Cleaning Services' },
    'Kitchen Cleaning': { name: 'Kitchen Cleaning', description: 'Deep kitchen cleaning', price: 399, duration: '1-2 hours', icon: '🍳', category: 'Cleaning Services' },
    'Bathroom Cleaning': { name: 'Bathroom Cleaning', description: 'Thorough bathroom cleaning', price: 299, duration: '1 hour', icon: '🚿', category: 'Cleaning Services' },
    'Living Room Cleaning': { name: 'Living Room Cleaning', description: 'Living room cleaning', price: 399, duration: '1-2 hours', icon: '🛋️', category: 'Cleaning Services' },
    'Bedroom Cleaning': { name: 'Bedroom Cleaning', description: 'Bedroom cleaning', price: 399, duration: '1-2 hours', icon: '🛏️', category: 'Cleaning Services' },
    'Balcony Cleaning': { name: 'Balcony Cleaning', description: 'Balcony cleaning', price: 299, duration: '1 hour', icon: '🌿', category: 'Cleaning Services' },
    'Carpet Cleaning': { name: 'Carpet Cleaning', description: 'Carpet cleaning', price: 499, duration: '1-2 hours', icon: '🟫', category: 'Cleaning Services' },
    'Sofa Cleaning': { name: 'Sofa Cleaning', description: 'Sofa cleaning', price: 499, duration: '1-2 hours', icon: '🛋️', category: 'Cleaning Services' },
    'Curtain Cleaning': { name: 'Curtain Cleaning', description: 'Curtain cleaning', price: 299, duration: '1 hour', icon: '🪟', category: 'Cleaning Services' },
    'Window Cleaning': { name: 'Window Cleaning', description: 'Window cleaning', price: 299, duration: '1 hour', icon: '🪟', category: 'Cleaning Services' },
    'Deep Cleaning': { name: 'Deep Cleaning', description: 'Deep cleaning service', price: 999, duration: '3-4 hours', icon: '🧹', category: 'Cleaning Services' },
    'Move-in/Move-out Cleaning': { name: 'Move-in/Move-out Cleaning', description: 'Move-in/out cleaning', price: 1299, duration: '4-5 hours', icon: '📦', category: 'Cleaning Services' },
    'Office Cleaning': { name: 'Office Cleaning', description: 'Office cleaning', price: 999, duration: '2-3 hours', icon: '🏢', category: 'Cleaning Services' },
    'Shop Cleaning': { name: 'Shop Cleaning', description: 'Shop cleaning', price: 799, duration: '2 hours', icon: '🏪', category: 'Cleaning Services' },
    'Restaurant Cleaning': { name: 'Restaurant Cleaning', description: 'Restaurant cleaning', price: 999, duration: '2-3 hours', icon: '🍽️', category: 'Cleaning Services' },
    'Warehouse Cleaning': { name: 'Warehouse Cleaning', description: 'Warehouse cleaning', price: 1499, duration: '4 hours', icon: '🏭', category: 'Cleaning Services' },
    'Event Venue Cleaning': { name: 'Event Venue Cleaning', description: 'Event venue cleaning', price: 1999, duration: '5 hours', icon: '🎉', category: 'Cleaning Services' },
    'Post-Construction Cleaning': { name: 'Post-Construction Cleaning', description: 'Post-construction cleaning', price: 2499, duration: '6 hours', icon: '🏗️', category: 'Cleaning Services' },
    // Appliance Repair
    'AC Repair': { name: 'AC Repair', description: 'AC repair and maintenance', price: 399, duration: '1-2 hours', icon: '❄️', category: 'Appliance Repair' },
    'Washing Machine Repair': { name: 'Washing Machine Repair', description: 'Washing machine repair', price: 399, duration: '1-2 hours', icon: '🧺', category: 'Appliance Repair' },
    'Television Repair': { name: 'Television Repair', description: 'Television repair', price: 499, duration: '1-2 hours', icon: '📺', category: 'Appliance Repair' },
    'Laptop Repair': { name: 'Laptop Repair', description: 'Laptop repair', price: 499, duration: '1-2 hours', icon: '💻', category: 'Appliance Repair' },
    'Air Purifier Repair': { name: 'Air Purifier Repair', description: 'Air purifier repair', price: 299, duration: '1 hour', icon: '🌬️', category: 'Appliance Repair' },
    'Air Cooler Repair': { name: 'Air Cooler Repair', description: 'Air cooler repair', price: 299, duration: '1 hour', icon: '🌪️', category: 'Appliance Repair' },
    'Geyser Repair': { name: 'Geyser Repair', description: 'Geyser repair', price: 399, duration: '1-2 hours', icon: '🔥', category: 'Appliance Repair' },
    'Water Purifier Installation': { name: 'Water Purifier Installation', description: 'Water purifier installation', price: 599, duration: '1-2 hours', icon: '💧', category: 'Water Purifier Services' },
    'Refrigerator Repair': { name: 'Refrigerator Repair', description: 'Refrigerator repair', price: 499, duration: '1-2 hours', icon: '🧊', category: 'Appliance Repair' },
    'Microwave Repair': { name: 'Microwave Repair', description: 'Microwave repair', price: 299, duration: '30-60 min', icon: '🍽️', category: 'Appliance Repair' },
    'Chimney Repair': { name: 'Chimney Repair', description: 'Chimney repair', price: 399, duration: '1-2 hours', icon: '🏠', category: 'Appliance Repair' },
    // Electrician & Plumber
    'Electrical Repair': { name: 'Electrical Repair', description: 'Electrical repair', price: 399, duration: '1-2 hours', icon: '⚡', category: 'Electrician Services' },
    'Wiring Installation': { name: 'Wiring Installation', description: 'Wiring installation', price: 499, duration: '1-2 hours', icon: '🔌', category: 'Electrician Services' },
    'Switch & Socket Repair': { name: 'Switch & Socket Repair', description: 'Switch & socket repair', price: 199, duration: '30-60 min', icon: '🔌', category: 'Electrician Services' },
    'Fan Installation': { name: 'Fan Installation', description: 'Fan installation', price: 299, duration: '1 hour', icon: '💨', category: 'Electrician Services' },
    'Light Installation': { name: 'Light Installation', description: 'Light installation', price: 199, duration: '30 min', icon: '💡', category: 'Electrician Services' },
    'MCB/Fuse Repair': { name: 'MCB/Fuse Repair', description: 'MCB/fuse repair', price: 299, duration: '1 hour', icon: '🔋', category: 'Electrician Services' },
    'Plumbing Repair': { name: 'Plumbing Repair', description: 'Plumbing repair', price: 399, duration: '1-2 hours', icon: '🔧', category: 'Plumber Services' },
    'Pipe Installation': { name: 'Pipe Installation', description: 'Pipe installation', price: 299, duration: '1 hour', icon: '🚰', category: 'Plumber Services' },
    'Tap Repair': { name: 'Tap Repair', description: 'Tap repair', price: 199, duration: '30 min', icon: '🚰', category: 'Plumber Services' },
    'Toilet Repair': { name: 'Toilet Repair', description: 'Toilet repair', price: 299, duration: '1 hour', icon: '🚽', category: 'Plumber Services' },
    'Drain Cleaning': { name: 'Drain Cleaning', description: 'Drain cleaning', price: 299, duration: '1 hour', icon: '🕳️', category: 'Plumber Services' },
    'Water Heater Repair': { name: 'Water Heater Repair', description: 'Water heater repair', price: 399, duration: '1-2 hours', icon: '🔥', category: 'Plumber Services' },
    'Installation': { name: 'Installation', description: 'General installation service', price: 299, duration: '1-2 hours', icon: '🔨', category: 'Installation Services' },
    'AC Installation': { name: 'AC Installation', description: 'AC installation', price: 799, duration: '1-2 hours', icon: '❄️', category: 'Installation Services' },
    'Geyser Installation': { name: 'Geyser Installation', description: 'Geyser installation', price: 599, duration: '1-2 hours', icon: '🔥', category: 'Installation Services' },
    'Exhaust Fan Installation': { name: 'Exhaust Fan Installation', description: 'Exhaust fan installation', price: 299, duration: '1 hour', icon: '💨', category: 'Installation Services' },
    'Security Camera Installation': { name: 'Security Camera Installation', description: 'Security camera installation', price: 999, duration: '2 hours', icon: '📹', category: 'Installation Services' },
    // Smart Lock
    'Smart Lock Installation': { name: 'Smart Lock Installation', description: 'Smart lock installation', price: 799, duration: '1-2 hours', icon: '🔐', category: 'Smart Lock Services' },
    'Smart Lock Repair': { name: 'Smart Lock Repair', description: 'Smart lock repair', price: 499, duration: '1 hour', icon: '🔧', category: 'Smart Lock Services' },
    'Smart Lock Setup': { name: 'Smart Lock Setup', description: 'Smart lock setup', price: 299, duration: '30 min', icon: '📱', category: 'Smart Lock Services' },
    'Smart Lock Maintenance': { name: 'Smart Lock Maintenance', description: 'Smart lock maintenance', price: 399, duration: '1 hour', icon: '🔧', category: 'Smart Lock Services' },
    'Smart Lock Upgrade': { name: 'Smart Lock Upgrade', description: 'Smart lock upgrade', price: 599, duration: '1 hour', icon: '⬆️', category: 'Smart Lock Services' },
    'Smart Lock Consultation': { name: 'Smart Lock Consultation', description: 'Smart lock consultation', price: 199, duration: '30 min', icon: '💡', category: 'Smart Lock Services' },
    'Security System Installation': { name: 'Security System Installation', description: 'Security system installation', price: 999, duration: '2 hours', icon: '🏠', category: 'Security Services' },
    'CCTV Installation': { name: 'CCTV Installation', description: 'CCTV installation', price: 999, duration: '2 hours', icon: '📹', category: 'Security Services' },
    'Access Control System': { name: 'Access Control System', description: 'Access control system', price: 799, duration: '1-2 hours', icon: '🚪', category: 'Security Services' },
    'Biometric Lock Installation': { name: 'Biometric Lock Installation', description: 'Biometric lock installation', price: 899, duration: '1-2 hours', icon: '👆', category: 'Security Services' },
    'Digital Lock Installation': { name: 'Digital Lock Installation', description: 'Digital lock installation', price: 799, duration: '1-2 hours', icon: '🔢', category: 'Security Services' },
    'Security Audit': { name: 'Security Audit', description: 'Security audit', price: 499, duration: '1 hour', icon: '🔍', category: 'Security Services' },
    'Battery Replacement': { name: 'Battery Replacement', description: 'Battery replacement', price: 199, duration: '30 min', icon: '🔋', category: 'Maintenance Services' },
    'Software Update': { name: 'Software Update', description: 'Software update', price: 199, duration: '30 min', icon: '💻', category: 'Maintenance Services' },
    'Key Programming': { name: 'Key Programming', description: 'Key programming', price: 299, duration: '30 min', icon: '🔑', category: 'Maintenance Services' },
    'Emergency Unlock': { name: 'Emergency Unlock', description: 'Emergency unlock', price: 399, duration: '1 hour', icon: '🚨', category: 'Maintenance Services' },
    'Warranty Service': { name: 'Warranty Service', description: 'Warranty service', price: 0, duration: 'Varies', icon: '📋', category: 'Maintenance Services' },
    'Remote Support': { name: 'Remote Support', description: 'Remote support', price: 99, duration: '30 min', icon: '🌐', category: 'Maintenance Services' },
    // Water Purifier
    'RO Installation': { name: 'RO Installation', description: 'RO purifier installation', price: 699, duration: '1-2 hours', icon: '🔧', category: 'Water Purifier Services' },
    'UV Installation': { name: 'UV Installation', description: 'UV purifier installation', price: 699, duration: '1-2 hours', icon: '☀️', category: 'Water Purifier Services' },
    'UF Installation': { name: 'UF Installation', description: 'UF purifier installation', price: 699, duration: '1-2 hours', icon: '🌊', category: 'Water Purifier Services' },
    'Alkaline Installation': { name: 'Alkaline Installation', description: 'Alkaline purifier installation', price: 799, duration: '1-2 hours', icon: '⚗️', category: 'Water Purifier Services' },
    'Commercial Installation': { name: 'Commercial Installation', description: 'Commercial purifier installation', price: 1499, duration: '2-3 hours', icon: '🏢', category: 'Water Purifier Services' },
    'Water Purifier Repair': { name: 'Water Purifier Repair', description: 'Water purifier repair', price: 399, duration: '1 hour', icon: '🔧', category: 'Water Purifier Services' },
    'RO Repair': { name: 'RO Repair', description: 'RO purifier repair', price: 499, duration: '1 hour', icon: '🔧', category: 'Water Purifier Services' },
    'UV Repair': { name: 'UV Repair', description: 'UV purifier repair', price: 499, duration: '1 hour', icon: '🔧', category: 'Water Purifier Services' },
    'UF Repair': { name: 'UF Repair', description: 'UF purifier repair', price: 499, duration: '1 hour', icon: '🔧', category: 'Water Purifier Services' },
    'Alkaline Repair': { name: 'Alkaline Repair', description: 'Alkaline purifier repair', price: 599, duration: '1 hour', icon: '🔧', category: 'Water Purifier Services' },
    'Commercial Repair': { name: 'Commercial Repair', description: 'Commercial purifier repair', price: 999, duration: '2 hours', icon: '🔧', category: 'Water Purifier Services' },
    'Filter Replacement': { name: 'Filter Replacement', description: 'Filter replacement', price: 299, duration: '30-45 min', icon: '🔄', category: 'Water Purifier Services' },
    'Membrane Replacement': { name: 'Membrane Replacement', description: 'Membrane replacement', price: 399, duration: '30-45 min', icon: '🔄', category: 'Water Purifier Services' },
    'UV Bulb Replacement': { name: 'UV Bulb Replacement', description: 'UV bulb replacement', price: 199, duration: '30 min', icon: '💡', category: 'Water Purifier Services' },
    'Tank Cleaning': { name: 'Tank Cleaning', description: 'Tank cleaning', price: 299, duration: '1 hour', icon: '🧽', category: 'Water Purifier Services' },
    'Annual Maintenance': { name: 'Annual Maintenance', description: 'Annual maintenance', price: 999, duration: 'Varies', icon: '📋', category: 'Water Purifier Services' },
    'Water Quality Test': { name: 'Water Quality Test', description: 'Water quality test', price: 199, duration: '30 min', icon: '🧪', category: 'Water Purifier Services' },
  };

  // If not found, fallback to generic
  const currentService = serviceDetails[serviceName] || {
    name: serviceName,
    description: 'Service details coming soon.',
    price: 500,
    duration: '1 hour',
    icon: '🔧',
    category: category
  };

  const availableWorkers = [
    { id: '1', name: 'Rahul Kumar', rating: 4.8, experience: '5 years', image: '👨‍💼' },
    { id: '2', name: 'Amit Singh', rating: 4.9, experience: '7 years', image: '👨‍💼' },
    { id: '3', name: 'Vikram Patel', rating: 4.7, experience: '4 years', image: '👨‍💼' },
    { id: '4', name: 'Priya Sharma', rating: 4.9, experience: '6 years', image: '👩‍💼' },
    { id: '5', name: 'Neha Gupta', rating: 4.8, experience: '5 years', image: '👩‍💼' },
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  const isInCart = cart.some(item => item.name === currentService.name && item.category === currentService.category);

  const handleBooking = async () => {
    if (!user) {
      try {
        await signIn();
      } catch (err) {
        alert('Sign-in failed. Please try again.');
      }
      return;
    }
    if (selectedPaymentMethod) {
      setIsBookingConfirmed(true);
      // Here you would typically make an API call to book the service
      setTimeout(() => {
        router.push('/mapping');
      }, 2000);
    }
  };

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'USER25') {
      setDiscount(Math.round(currentService.price * 0.25));
      setCouponApplied(true);
    } else {
      setDiscount(0);
      setCouponApplied(false);
      alert('Invalid coupon code');
    }
  };

  return (
    <div className="min-h-screen bg-white mt-28">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-3xl">{currentService.icon}</span>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800 passion-one-black">{currentService.name}</h1>
                <p className="text-gray-600 text-lg">{currentService.category}</p>
              </div>
            </div>
            <button
              onClick={() => router.back()}
              className="bg-gray-100 hover:bg-gray-200 rounded-full p-3 transition-colors duration-200"
            >
              <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          {/* Left Column - Service Details */}
          <div className="space-y-6">
            {/* Service Information */}
            <div className="rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 passion-one-black text-gray-800">Service Details</h2>
              <div className="space-y-6">
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Duration:</span>
                  <span className="font-semibold text-gray-800">{currentService.duration}</span>
                </div>
                <div className="flex justify-between items-center py-3 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Price:</span>
                  <span className="font-bold text-3xl text-yellow-600">₹{currentService.price}</span>
                </div>
                <div className="pt-3">
                  <span className="text-gray-600 font-medium block mb-2">Description:</span>
                  <p className="text-gray-800 leading-relaxed">{currentService.description}</p>
                </div>
              </div>
              <button
                className={`mt-6 w-full py-3 rounded-xl font-semibold text-lg transition-all duration-200 ${isInCart ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl'}`}
                onClick={() => !isInCart && addToCart({ name: currentService.name, price: currentService.price, category: currentService.category })}
                disabled={isInCart}
              >
                {isInCart ? 'Added to Cart' : 'Add to Cart'}
              </button>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div>
            <div className="rounded-xl p-8 bg-gray-50">
              <h2 className="text-2xl font-bold mb-6 passion-one-black text-gray-800">Booking Summary</h2>
              {/* Coupon Input */}
              <div className="mb-6">
                <label className="block text-gray-700 font-medium mb-2">Apply Coupon</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={coupon}
                    onChange={e => setCoupon(e.target.value)}
                    className="flex-1 p-3 border-2 border-gray-200 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 text-gray-800"
                    placeholder="Enter coupon code"
                    disabled={couponApplied}
                  />
                  <button
                    type="button"
                    onClick={handleApplyCoupon}
                    disabled={couponApplied}
                    className={`px-4 py-2 rounded-lg border-2 font-semibold transition-colors duration-200 ${couponApplied ? 'bg-green-200 border-green-400 text-green-800 cursor-not-allowed' : 'bg-white border-black text-black hover:bg-[#fdc700]'}`}
                  >
                    {couponApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-green-600 text-sm mt-2">Coupon applied! 25% discount</p>
                )}
              </div>
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-semibold text-gray-800">{currentService.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-semibold text-gray-800">{currentService.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold text-gray-800">{currentService.duration}</span>
                </div>
              </div>
              {/* Price Breakdown */}
              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Original Price:</span>
                  <span className="text-gray-800 line-through">₹{currentService.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Discount:</span>
                  <span className="text-green-600">-₹{discount}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
                  <span className="text-2xl font-bold text-yellow-600">₹{currentService.price - discount}</span>
                </div>
              </div>
              {/* Payment Method Selection */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h3>
                <div className="space-y-3">
                  <div
                    onClick={() => setSelectedPaymentMethod('cod')}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedPaymentMethod === 'cod'
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-200 hover:border-yellow-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === 'cod' ? 'border-yellow-500 bg-yellow-500' : 'border-gray-300'
                      }`}>
                        {selectedPaymentMethod === 'cod' && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">💵</span>
                        <div>
                          <div className="font-semibold text-gray-800">Cash on Delivery</div>
                          <div className="text-sm text-gray-500">Pay after service completion</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => setSelectedPaymentMethod('upi')}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedPaymentMethod === 'upi'
                        ? 'border-yellow-500 bg-yellow-50'
                        : 'border-gray-200 hover:border-yellow-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedPaymentMethod === 'upi' ? 'border-yellow-500 bg-yellow-500' : 'border-gray-300'
                      }`}>
                        {selectedPaymentMethod === 'upi' && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">📱</span>
                        <div>
                          <div className="font-semibold text-gray-800">UPI Payment</div>
                          <div className="text-sm text-gray-500">Pay online via UPI</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-800">Total Amount:</span>
                  <span className="text-2xl font-bold text-yellow-600">₹{currentService.price - discount}</span>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={!selectedPaymentMethod}
                className={`w-full py-4 px-6 rounded-xl font-semibold text-lg transition-all duration-200 ${
                  selectedPaymentMethod
                    ? 'bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg hover:shadow-xl'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isBookingConfirmed ? 'Booking Confirmed!' : selectedPaymentMethod === 'cod' ? 'Book Now (Pay Later)' : 'Pay & Book Now'}
              </button>

              {isBookingConfirmed && (
                <div className="mt-4 p-4 bg-green-100 rounded-lg">
                  <p className="text-green-800 text-center">
                    Your booking has been confirmed! Redirecting to tracking...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceBookingPage; 