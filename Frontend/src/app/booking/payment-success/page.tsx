'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useToast } from '@/components/Toast';
import { useUser } from '@clerk/nextjs';
import { FiCheckCircle, FiLoader } from 'react-icons/fi';
import { getJobById, type JobResponse } from '@/lib/jobService';

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showToast } = useToast();
  const { user } = useUser();
  const [isProcessing, setIsProcessing] = useState(true);
  const [workerId, setWorkerId] = useState<string | null>(null);
  const [jobData, setJobData] = useState<JobResponse | null>(null);

  const sessionId = searchParams.get('session_id');
  const jobId = searchParams.get('jobId');

  useEffect(() => {
    if (!sessionId) {
      showToast('Invalid payment session', 'error');
      router.push('/');
      return;
    }

    // Process payment success and fetch job data
    const processPayment = async () => {
      try {
        console.log('Processing payment success for session:', sessionId);
        showToast('Payment successful! Finding a worker for you...', 'success');
        
        // Fetch job data if jobId is provided
        if (jobId) {
          console.log('Fetching job data for jobId:', jobId);
          const job = await getJobById(jobId);
          if (job) {
            setJobData(job);
            console.log('Job data retrieved:', job);
          } else {
            console.warn('Job not found for jobId:', jobId);
          }
        }
        
        // In a real app, you would verify the payment with Stripe here
        // const response = await fetch('/api/stripe/verify-payment', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ sessionId })
        // });
        // const { verified, amount, serviceName } = await response.json();
        
        // Simulate API call to verify payment and assign worker
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Simulate worker assignment (in real app, this would come from your backend)
        const mockWorkerId = `worker_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        setWorkerId(mockWorkerId);
        
        showToast('Worker assigned! Redirecting to tracking...', 'success');
        
        // Redirect to tracking page after a short delay
        setTimeout(() => {
          const trackingUrl = jobId 
            ? `/job-tracking?workerId=${mockWorkerId}&paymentMethod=online&sessionId=${sessionId}&jobId=${jobId}`
            : `/job-tracking?workerId=${mockWorkerId}&paymentMethod=online&sessionId=${sessionId}`;
          router.push(trackingUrl);
        }, 1500);
        
      } catch (error) {
        console.error('Error processing payment:', error);
        showToast('Error processing payment. Please contact support.', 'error');
        router.push('/');
      } finally {
        setIsProcessing(false);
      }
    };

    processPayment();
  }, [sessionId, jobId, router, showToast]);

  if (isProcessing) {
    return (
      <div className="min-h-screen bg-white mt-28 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-6">
            <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Payment Successful!</h1>
            <p className="text-gray-600 mb-6">Your payment has been processed successfully.</p>
            
            {/* Show job details if available */}
            {jobData && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
                <h3 className="font-semibold text-gray-800 mb-2">Job Details</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p><strong>Job ID:</strong> {jobData.id}</p>
                  <p><strong>Service:</strong> {jobData.specializations}</p>
                  <p><strong>Location:</strong> {jobData.location}</p>
                  <p><strong>Duration:</strong> {jobData.durationMinutes} minutes</p>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-center space-x-2 text-gray-600">
            <FiLoader className="w-5 h-5 animate-spin" />
            <span>Processing your booking and finding a worker...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white mt-28 flex items-center justify-center">
      <div className="text-center">
        <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Booking Confirmed!</h1>
        <p className="text-gray-600 mb-6">Your worker has been assigned and is on the way.</p>
        
        {/* Show job details if available */}
        {jobData && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 max-w-md mx-auto">
            <h3 className="font-semibold text-gray-800 mb-2">Job Details</h3>
            <div className="text-sm text-gray-600 space-y-1">
              <p><strong>Job ID:</strong> {jobData.id}</p>
              <p><strong>Service:</strong> {jobData.specializations}</p>
              <p><strong>Location:</strong> {jobData.location}</p>
              <p><strong>Duration:</strong> {jobData.durationMinutes} minutes</p>
            </div>
          </div>
        )}
        
        <p className="text-sm text-gray-500">Redirecting to tracking page...</p>
      </div>
    </div>
  );
} 