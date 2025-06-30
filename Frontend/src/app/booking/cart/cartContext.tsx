'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { useToast } from '@/components/Toast';

export interface CartService {
  name: string;
  price: number;
  category: string;
}

interface CartContextType {
  cart: CartService[];
  addToCart: (service: CartService) => void;
  removeFromCart: (index: number) => void;
  clearCart: () => void;
  cartTotal: number;
  cartCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartService[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { showToast } = useToast();

  // Set client flag to prevent hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Load cart from localStorage on mount (client-side only)
  useEffect(() => {
    if (!isClient) return;
    
    try {
      const stored = localStorage.getItem('cart');
      if (stored) {
        const parsedCart = JSON.parse(stored);
        setCart(Array.isArray(parsedCart) ? parsedCart : []);
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      setCart([]);
    }
  }, [isClient]);

  // Save cart to localStorage whenever it changes (client-side only)
  useEffect(() => {
    if (!isClient) return;
    
    try {
      localStorage.setItem('cart', JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [cart, isClient]);

  // Memoize cart calculations
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.length;
  }, [cart]);

  // Optimize cart operations with useCallback
  const addToCart = useCallback((service: CartService) => {
    setCart((prev) => [...prev, service]);
    showToast(`${service.name} added to cart!`, 'success');
  }, [showToast]);

  const removeFromCart = useCallback((index: number) => {
    setCart((prev) => {
      const removedItem = prev[index];
      const newCart = prev.filter((_, i) => i !== index);
      if (removedItem) {
        showToast(`${removedItem.name} removed from cart`, 'info');
      }
      return newCart;
    });
  }, [showToast]);

  const clearCart = useCallback(() => {
    setCart([]);
    showToast('Cart cleared successfully', 'success');
  }, [showToast]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    clearCart,
    cartTotal,
    cartCount,
  }), [cart, addToCart, removeFromCart, clearCart, cartTotal, cartCount]);

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within a CartProvider');
  return ctx;
}; 