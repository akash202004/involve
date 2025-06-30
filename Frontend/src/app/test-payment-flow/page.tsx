'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';
import { useUser } from '@clerk/nextjs';

export default function TestPaymentFlowPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const { user, isSignedIn } = useUser();
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTestBooking = async () => {
    if (!selectedPaymentMethod) {
      showToast('Please select a payment method', 'warning');
      return;
    }

    setIsProcessing(true);
    showToast('Testing booking flow...', 'info');

    try {
      if (selectedPaymentMethod === 'cash') {
        // Test cash on delivery flow
        showToast('Testing cash on delivery...', 'info');
        setTimeout(() => {
          showToast('Cash booking successful! Redirecting to worker assignment...', 'success');
          router.push('/booking/worker-assigned?id=test_worker_123&paymentMethod=cash');
        }, 2000);
      } else {
        // Test online payment flow
        showToast('Testing online payment...', 'info');
        setTimeout(() => {
          showToast('Test mode: Payment would be processed', 'success');
          router.push('/booking/payment-success?session_id=test_session_123');
        }, 2000);
      }
    } catch (error) {
      showToast('Test failed. Please try again.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-white mt-28 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to test</h1>
          <p className="text-gray-600">You need to be signed in to test the payment flow.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white mt-28 flex items-center justify-center">
      <div className="max-w-md w-full p-6 bg-gray-50 rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Test Payment Flow</h1>
        
        <div className="space-y-4">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Payment Method
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={selectedPaymentMethod === "cash"}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="text-yellow-500"
                />
                <span>Cash on Delivery</span>
              </label>
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="online"
                  checked={selectedPaymentMethod === "online"}
                  onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                  className="text-yellow-500"
                />
                <span>Online Payment</span>
              </label>
            </div>
          </div>

          <button
            onClick={handleTestBooking}
            disabled={!selectedPaymentMethod || isProcessing}
            className="w-full py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Testing...' : 'Test Booking Flow'}
          </button>

          <div className="text-sm text-gray-600 mt-4">
            <p><strong>Cash on Delivery:</strong> Direct to worker assignment</p>
            <p><strong>Online Payment:</strong> Payment success page → Worker assignment</p>
          </div>
        </div>
      </div>
    </div>
  );
} 