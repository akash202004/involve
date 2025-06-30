'use client';
import React from 'react';
import { useToast } from './Toast';

export const ToastExample: React.FC = () => {
  const { showToast } = useToast();

  const handleShowToast = (type: 'success' | 'error' | 'warning' | 'info', position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center') => {
    const messages = {
      success: 'Operation completed successfully!',
      error: 'Something went wrong. Please try again.',
      warning: 'Please check your input before proceeding.',
      info: 'Here is some helpful information.'
    };
    
    showToast(messages[type], type, position);
  };

  return (
    <div className="p-6 space-y-4">
      <h2 className="text-2xl font-bold mb-4">Toast Examples</h2>
      
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Toast Types:</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleShowToast('success')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Success Toast
          </button>
          <button
            onClick={() => handleShowToast('error')}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Error Toast
          </button>
          <button
            onClick={() => handleShowToast('warning')}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
          >
            Warning Toast
          </button>
          <button
            onClick={() => handleShowToast('info')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Info Toast
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Toast Positions:</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleShowToast('info', 'top-left')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Top Left
          </button>
          <button
            onClick={() => handleShowToast('info', 'top-right')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Top Right
          </button>
          <button
            onClick={() => handleShowToast('info', 'bottom-left')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Bottom Left
          </button>
          <button
            onClick={() => handleShowToast('info', 'bottom-right')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Bottom Right
          </button>
          <button
            onClick={() => handleShowToast('info', 'center')}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Center
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="text-lg font-semibold">Custom Messages:</h3>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => showToast('Welcome to our service!', 'success')}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
          >
            Welcome Message
          </button>
          <button
            onClick={() => showToast('Your order has been placed successfully!', 'success')}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Order Success
          </button>
          <button
            onClick={() => showToast('Network connection lost. Please check your internet.', 'error')}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Network Error
          </button>
        </div>
      </div>
    </div>
  );
}; 