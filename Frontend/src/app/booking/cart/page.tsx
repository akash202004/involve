"use client";

import React from "react";
import { useCart } from "./cartContext";

const CartPage: React.FC = () => {
  const { cart, removeFromCart, clearCart } = useCart();
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-white pt-28 px-4">
      <div className="max-w-2xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Your Cart</h1>
        {cart.length === 0 ? (
          <div className="text-center text-gray-500">Your cart is empty.</div>
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
            >
              Proceed to Checkout
            </button>
            <button
              className="w-full py-2 mt-2 rounded-xl font-semibold text-md bg-gray-200 hover:bg-gray-300 text-gray-700 transition"
              onClick={clearCart}
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