"use client";

import React from "react";
import { useCart } from "./cartContext";
import { useToast } from '@/components/Toast';
import { useRouter } from 'next/navigation';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const { showToast } = useToast();
  const router = useRouter();
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  const handleProceedToCheckout = () => {
    if (cart.length === 0) {
      showToast('Your cart is empty. Add some services first!', 'warning');
      return;
    }
    showToast('Proceeding to checkout...', 'info');
    // Add your checkout logic here
    // For now, just show a success message
    setTimeout(() => {
      showToast('Checkout functionality coming soon!', 'info');
    }, 1000);
  };

  const handleClearCart = () => {
    if (cart.length === 0) {
      showToast('Your cart is already empty!', 'info');
      return;
    }
    clearCart();
    // Note: The toast is already handled in the cart context
  };

  return (
    <div className="min-h-screen bg-white pt-28 px-4">
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h1>
        {cart.length === 0 ? (
          <div className="text-center text-gray-500">
            <div className="mb-4">
              <svg className="w-16 h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
              </svg>
            </div>
            <p className="text-lg font-medium text-gray-600 mb-4">Your cart is empty</p>
            <button
              onClick={() => router.push('/')}
              className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {cart.map((service, idx) => (
              <div key={idx} className="flex justify-between items-center p-4 border rounded-lg bg-gray-50">
                <div>
                  <div className="font-semibold text-lg text-gray-800">{service.name}</div>
                  <div className="text-sm text-gray-500">{service.category}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-xl font-bold text-yellow-600">₹{service.price}</div>
                  <button
                    onClick={() => removeFromCart(idx)}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
            <div className="flex justify-between items-center border-t pt-6 mt-6">
              <div className="text-xl font-semibold text-gray-800">Total</div>
              <div className="text-2xl font-bold text-yellow-600">₹{total}</div>
            </div>
            <button
              className="w-full py-4 mt-4 rounded-xl font-semibold text-lg bg-yellow-500 hover:bg-yellow-600 text-white shadow-lg transition"
              disabled={cart.length === 0}
              onClick={handleProceedToCheckout}
            >
              Proceed to Checkout
            </button>
            <button
              className="w-full py-2 mt-2 rounded-xl font-semibold text-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
              onClick={handleClearCart}
              disabled={cart.length === 0}
            >
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage; 