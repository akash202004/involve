'use client';

import React, { useState, useEffect } from 'react';
import { useToast } from '@/components/Toast';
import { 
  WORKER_PLANS, 
  createWorkerSubscription, 
  getWorkerSubscription,
  cancelWorkerSubscription,
  type WorkerSubscription 
} from '@/lib/stripe';
import { loadStripe } from '@stripe/stripe-js';
import { FiX, FiCheck, FiCreditCard, FiStar } from 'react-icons/fi';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  workerId: string;
  onSubscriptionComplete: () => void;
}

export default function PaymentModal({ 
  isOpen, 
  onClose, 
  workerId, 
  onSubscriptionComplete 
}: PaymentModalProps) {
  const { showToast } = useToast();
  const [selectedPlan, setSelectedPlan] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState<WorkerSubscription | null>(null);

  console.log('PaymentModal render - isOpen:', isOpen, 'workerId:', workerId);

  useEffect(() => {
    console.log('PaymentModal useEffect - isOpen:', isOpen, 'workerId:', workerId);
    if (isOpen && workerId) {
      fetchCurrentSubscription();
    }
  }, [isOpen, workerId]);

  const fetchCurrentSubscription = async () => {
    try {
      const subscription = await getWorkerSubscription(workerId);
      setCurrentSubscription(subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
    }
  };

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);
  };

  const handleSubscribe = async () => {
    if (!selectedPlan) {
      showToast('Please select a plan', 'warning');
      return;
    }

    setIsLoading(true);
    try {
      // For testing purposes, simulate successful subscription
      console.log('Test mode: Simulating successful subscription');
      showToast('Test mode: Subscription would be created', 'success');
      setTimeout(() => {
        onSubscriptionComplete();
      }, 1000);
      
      // Uncomment this when you have Stripe properly configured:
      /*
      const { sessionId } = await createWorkerSubscription(selectedPlan, workerId);
      
      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          showToast('Payment failed. Please try again.', 'error');
        }
      }
      */
    } catch (error) {
      console.error('Error creating subscription:', error);
      showToast('Failed to create subscription. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!currentSubscription) return;

    setIsLoading(true);
    try {
      await cancelWorkerSubscription(currentSubscription.id);
      showToast('Subscription will be cancelled at the end of the current period', 'info');
      await fetchCurrentSubscription();
    } catch (error) {
      console.error('Error cancelling subscription:', error);
      showToast('Failed to cancel subscription. Please try again.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Worker Subscription Plans</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Current Subscription Status */}
        {currentSubscription && (
          <div className="p-6 bg-blue-50 border-b">
            <div className="flex items-center space-x-2 mb-2">
              <FiStar className="text-blue-600" />
              <h3 className="font-semibold text-blue-800">Current Subscription</h3>
            </div>
            <p className="text-blue-700">
              Status: <span className="font-medium">{currentSubscription.status}</span>
            </p>
            <p className="text-blue-700">
              Amount: <span className="font-medium">${(currentSubscription.amount / 100).toFixed(2)}/month</span>
            </p>
            {currentSubscription.status === 'active' && (
              <button
                onClick={handleCancelSubscription}
                disabled={isLoading}
                className="mt-3 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isLoading ? 'Cancelling...' : 'Cancel Subscription'}
              </button>
            )}
          </div>
        )}

        {/* Plans */}
        <div className="p-6">
          <h3 className="text-lg font-semibold mb-4">Choose Your Plan</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(WORKER_PLANS).map(([key, plan]) => (
              <div
                key={plan.id}
                className={`border-2 rounded-lg p-6 cursor-pointer transition-all ${
                  selectedPlan === plan.id
                    ? 'border-yellow-500 bg-yellow-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handlePlanSelect(plan.id)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-bold text-gray-800">{plan.name}</h4>
                  {selectedPlan === plan.id && (
                    <FiCheck className="text-yellow-500" size={20} />
                  )}
                </div>
                <div className="text-3xl font-bold text-gray-800 mb-4">
                  ${(plan.price / 100).toFixed(2)}
                  <span className="text-sm font-normal text-gray-600">/month</span>
                </div>
                <ul className="space-y-2">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center space-x-2">
                      <FiCheck className="text-green-500 flex-shrink-0" size={16} />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 mt-6 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubscribe}
              disabled={!selectedPlan || isLoading}
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors disabled:opacity-50 flex items-center space-x-2"
            >
              <FiCreditCard size={16} />
              <span>{isLoading ? 'Processing...' : 'Subscribe Now'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 