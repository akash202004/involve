'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface ServiceDetails {
  name: string;
  description: string;
  price: number;
  duration: string;
  icon: string;
  category: string;
}

const BookingPage: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const serviceName = searchParams.get('service') || 'Haircut';
  const category = searchParams.get('category') || 'Hair Services';

  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [selectedWorker, setSelectedWorker] = useState<string>('');
  const [isBookingConfirmed, setIsBookingConfirmed] = useState(false);

  // Service details mapping
  const serviceDetails: Record<string, ServiceDetails> = {
    'Haircut': {
      name: 'Haircut',
      description: 'Professional haircut service with styling consultation',
      price: 299,
      duration: '30-45 min',
      icon: '✂️',
      category: 'Hair Services'
    },
    'Hair Color': {
      name: 'Hair Color',
      description: 'Professional hair coloring with premium products',
      price: 899,
      duration: '1-2 hours',
      icon: '🎨',
      category: 'Hair Services'
    },
    'Hair Styling': {
      name: 'Hair Styling',
      description: 'Creative hair styling for special occasions',
      price: 499,
      duration: '45-60 min',
      icon: '💇‍♂️',
      category: 'Hair Services'
    },
    'Beard Trim': {
      name: 'Beard Trim',
      description: 'Professional beard trimming and shaping',
      price: 199,
      duration: '20-30 min',
      icon: '🪒',
      category: 'Grooming Services'
    },
    'Facial': {
      name: 'Facial',
      description: 'Rejuvenating facial treatment',
      price: 399,
      duration: '45-60 min',
      icon: '✨',
      category: 'Grooming Services'
    },
    'Body Massage': {
      name: 'Body Massage',
      description: 'Relaxing full body massage',
      price: 799,
      duration: '60-90 min',
      icon: '💆‍♂️',
      category: 'Massage Services'
    }
  };

  const currentService = serviceDetails[serviceName] || serviceDetails['Haircut'];

  const availableWorkers = [
    { id: '1', name: 'Rahul Kumar', rating: 4.8, experience: '5 years', image: '👨‍💼' },
    { id: '2', name: 'Amit Singh', rating: 4.9, experience: '7 years', image: '👨‍💼' },
    { id: '3', name: 'Vikram Patel', rating: 4.7, experience: '4 years', image: '👨‍💼' },
  ];

  const timeSlots = [
    '09:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '01:00 PM', '02:00 PM', '03:00 PM', '04:00 PM',
    '05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM'
  ];

  const handleBooking = () => {
    if (selectedDate && selectedTime && selectedWorker) {
      setIsBookingConfirmed(true);
      // Here you would typically make an API call to book the service
      setTimeout(() => {
        router.push('/mapping');
      }, 2000);
    }
  };

  const getMinDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
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

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Service Details */}
          <div className="flex-1 space-y-6">
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
            </div>

            {/* Date and Time Selection */}
            <div className="rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 passion-one-black text-gray-800">Select Date & Time</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Preferred Date</label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getMinDate()}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 text-gray-800"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Preferred Time</label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full p-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-200 text-gray-800"
                  >
                    <option value="">Select time</option>
                    {timeSlots.map((time) => (
                      <option key={time} value={time}>{time}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Worker Selection */}
            <div className="rounded-xl p-8">
              <h2 className="text-2xl font-bold mb-6 passion-one-black text-gray-800">Choose Your Professional</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableWorkers.map((worker) => (
                  <div
                    key={worker.id}
                    onClick={() => setSelectedWorker(worker.id)}
                    className={`p-6 border-2 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md ${
                      selectedWorker === worker.id
                        ? 'border-yellow-500 bg-yellow-50 shadow-lg'
                        : 'border-gray-200 hover:border-yellow-300 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <span className="text-2xl">{worker.image}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 mb-1">{worker.name}</h3>
                        <p className="text-sm text-gray-600 mb-1">⭐ {worker.rating} Rating</p>
                        <p className="text-xs text-gray-500">{worker.experience} Experience</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Booking Summary */}
          <div className="lg:w-96">
            <div className="rounded-xl p-6 lg:sticky lg:top-24">
              <h2 className="text-xl font-bold mb-6 passion-one-black text-gray-800">Booking Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Service:</span>
                  <span className="font-semibold text-gray-800">{currentService.name}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                  <span className="text-gray-600 font-medium">Duration:</span>
                  <span className="text-gray-800">{currentService.duration}</span>
                </div>
                {selectedDate && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Date:</span>
                    <span className="text-gray-800">{selectedDate}</span>
                  </div>
                )}
                {selectedTime && (
                  <div className="flex justify-between items-center py-2 border-b border-gray-100">
                    <span className="text-gray-600 font-medium">Time:</span>
                    <span className="text-gray-800">{selectedTime}</span>
                  </div>
                )}
                <div className="pt-4 border-t-2 border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-gray-800">Total:</span>
                    <span className="text-2xl font-bold text-yellow-600">₹{currentService.price}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={!selectedDate || !selectedTime || !selectedWorker}
                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-xl transition-all duration-200 text-lg shadow-lg hover:shadow-xl disabled:shadow-none"
              >
                {isBookingConfirmed ? 'Booking Confirmed!' : 'Book Now'}
              </button>

              {isBookingConfirmed && (
                <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-xl text-center border border-green-200">
                  <div className="flex items-center justify-center space-x-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">Redirecting to tracking page...</span>
                  </div>
                </div>
              )}

              {(!selectedDate || !selectedTime || !selectedWorker) && (
                <div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm text-center border border-blue-200">
                  Please complete all selections to proceed
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage; 