import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
}

export interface WorkerSubscription {
  id: string;
  status: 'active' | 'inactive' | 'cancelled';
  current_period_end: number;
  amount: number;
}

// Worker subscription plans
export const WORKER_PLANS = {
  BASIC: {
    id: 'price_basic_worker',
    name: 'Basic Worker Plan',
    price: 999, // $9.99 in cents
    features: [
      'Access to job requests',
      'Basic location tracking',
      'Standard support'
    ]
  },
  PREMIUM: {
    id: 'price_premium_worker',
    name: 'Premium Worker Plan',
    price: 1999, // $19.99 in cents
    features: [
      'Priority job requests',
      'Advanced analytics',
      'Premium support',
      'Extended working hours'
    ]
  }
};

// Create payment intent for worker subscription
export const createWorkerSubscription = async (
  planId: string,
  workerId: string
): Promise<PaymentIntent> => {
  try {
    const response = await fetch('/api/stripe/create-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        planId,
        workerId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create subscription');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating subscription:', error);
    throw error;
  }
};

// Get worker's current subscription
export const getWorkerSubscription = async (
  workerId: string
): Promise<WorkerSubscription | null> => {
  try {
    const response = await fetch(`/api/stripe/subscription/${workerId}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // No subscription found
      }
      throw new Error('Failed to fetch subscription');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching subscription:', error);
    throw error;
  }
};

// Cancel worker subscription
export const cancelWorkerSubscription = async (
  subscriptionId: string
): Promise<void> => {
  try {
    const response = await fetch('/api/stripe/cancel-subscription', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        subscriptionId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to cancel subscription');
    }
  } catch (error) {
    console.error('Error cancelling subscription:', error);
    throw error;
  }
};

// Customer payment functions
export const createCustomerPayment = async (
  amount: number,
  serviceName: string,
  customerEmail: string,
  customerId?: string
): Promise<{ sessionId: string }> => {
  const response = await fetch('/api/stripe/create-payment', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      amount,
      serviceName,
      customerEmail,
      customerId,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create payment session');
  }

  return response.json();
}; 