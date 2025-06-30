'use client';

import React, { useState } from 'react';
import { useToast } from '@/components/Toast';

export default function TestStripeConfigPage() {
  const { showToast } = useToast();
  const [testResult, setTestResult] = useState<string>('');

  const checkStripeConfig = async () => {
    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    const hasKey = !!publishableKey;
    
    setTestResult(`
🔑 Stripe Configuration Check:
- Publishable Key: ${hasKey ? '✅ Configured' : '❌ Missing'}
- Key Value: ${hasKey ? publishableKey?.substring(0, 20) + '...' : 'Not set'}
- Environment: ${process.env.NODE_ENV}

To fix:
1. Create .env.local file in frontend directory
2. Add: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
3. Add: STRIPE_SECRET_KEY=sk_test_your_key_here
4. Restart the development server
    `);

    if (!hasKey) {
      showToast('Stripe key not configured. Check console for details.', 'warning');
    } else {
      showToast('Stripe key is configured!', 'success');
    }
  };

  const testPaymentAPI = async () => {
    try {
      const response = await fetch('/api/stripe/create-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 1000,
          serviceName: 'Test Service',
          customerEmail: 'test@example.com',
          customerId: 'test_user_123'
        }),
      });

      const result = await response.json();
      
      if (response.ok) {
        setTestResult(prev => prev + '\n\n✅ Payment API Test: SUCCESS\nSession ID: ' + result.sessionId);
        showToast('Payment API test successful!', 'success');
      } else {
        setTestResult(prev => prev + '\n\n❌ Payment API Test: FAILED\nError: ' + result.error);
        showToast('Payment API test failed. Check console.', 'error');
      }
    } catch (error) {
      setTestResult(prev => prev + '\n\n❌ Payment API Test: ERROR\n' + error);
      showToast('Payment API test error. Check console.', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-white mt-28 flex items-center justify-center">
      <div className="max-w-2xl w-full p-6 bg-gray-50 rounded-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Stripe Configuration Test</h1>
        
        <div className="space-y-4">
          <button
            onClick={checkStripeConfig}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold"
          >
            Check Stripe Configuration
          </button>
          
          <button
            onClick={testPaymentAPI}
            className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold"
          >
            Test Payment API
          </button>
          
          {testResult && (
            <div className="mt-6 p-4 bg-white rounded-lg border">
              <h3 className="font-bold mb-2">Test Results:</h3>
              <pre className="text-sm whitespace-pre-wrap text-gray-800">
                {testResult}
              </pre>
            </div>
          )}
          
          <div className="text-sm text-gray-600 mt-4">
            <p><strong>Next Steps:</strong></p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Check if Stripe keys are configured</li>
              <li>Test the payment API</li>
              <li>If both pass, try the booking flow</li>
              <li>If they fail, set up your Stripe keys</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
} 