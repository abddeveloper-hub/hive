'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem } from '@/types';

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartTotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  lastToast: string | null;
  setLastToast: (msg: string | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    // Initial sample items to preserve the original 02 count aesthetic, or restore from localStorage
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('hive_cart');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }
    }
    return [
      {
        id: 'initial-1',
        productId: 'denim-1',
        name: 'Vintage Bootcut (Deep Blue)',
        price: 1199,
        originalPrice: 1499,
        size: '32',
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmKvjEc1A6hZL5zh90Hd27k9Wk5t1mozeTHXDKQJg4RTARxcfdtp-rApFCnCCs5Eq4_mvTLQWVJ6mURufYpOVsNgRVeJitLEoYoW8erqJQwWzd4Y-R-wW1vxPcj2hps_-Ein8kpkEKL6E8MWUOs0FsqLYLoxotsxEKUCoX407pf2P8MXW--7vq1ytuTSABrFZ034G4b8jZBStiy2wAewoNKPA0uo48Mqpd6XZfwlE',
      },
      {
        id: 'initial-2',
        productId: 'topwear-3',
        name: 'Washed Olive Tee',
        price: 899,
        originalPrice: 1099,
        size: 'L',
        quantity: 1,
        image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx_nh7u5NMuYWbwzorPCX5UGSNLtDgXAfIzrRXFU62wcfso4YYoaqbS8Sdo0MhF_byp9QJMGawmcn-ysbZK4Txa8IKxaOCbHo-Al9e5KBgnB1wWn12ByfdrKYRAfbsfqin7dg0jMnB4EIyxAXEYwpcGdUn_fi6gETcT0a3TDIAFI7keCvPhtRp6jFtg-WqjTegG2GGU2p8wHZltceG5HpNUgdoN9bEa8OwrwCTmAo',
      }
    ];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [lastToast, setLastToast] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('hive_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === newItem.productId && i.size === newItem.size
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, { ...newItem, id: `${newItem.productId}-${newItem.size}-${Date.now()}` }];
    });

    const toastMsg = `✓ ${newItem.name} (${newItem.size}) added to your bag`;
    setLastToast(toastMsg);
    setTimeout(() => {
      setLastToast((current) => (current === toastMsg ? null : current));
    }, 3200);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartTotal,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        lastToast,
        setLastToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
