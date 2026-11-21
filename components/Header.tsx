'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <header className="fixed top-0 w-full z-50 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.25)]">
      {/* Top Banner */}
      <div className="w-full bg-rust-leather text-pure-white py-1 px-4 text-center">
        <p className="font-label-mono-sm text-label-mono-sm uppercase tracking-widest truncate">
          Free shipping on orders above ₹1,999 • Diwali Drop Live
        </p>
      </div>

      {/* Main Bar */}
      <div className="h-20 px-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <img
            alt="HIVE Wordmark Logo"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/ALJJyrBQSzjXhI7NR3N656ISiunns3dP_UWzU7Dfjn0_r3EwkDk7oqZbCxqvBrBAgX6J-LIWh0bPagaTPZHEvNR0J71WDJNAJP8qq-xT8oEjyfjnlBh67IzxnGLGAHlRZBPzb4DlO2sNCuhrc0s3NOWIFJwLskckiDBH3GHAz8OyIe6nBnQRK8FTj99Rd5dG3j6a5-Hjd8L99hTaO2yDyL-23n85RkcElao5Ys8ngNa6w4E"
          />
          <div className="flex flex-col">
            <span className="font-headline-sm text-headline-sm uppercase tracking-tight text-on-surface">
              HIVE
            </span>
            <span className="font-label-mono-sm text-label-mono-sm text-outline uppercase tracking-wider -mt-1">
              Home
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            aria-label="Search Catalog"
            className="w-11 h-11 flex items-center justify-center text-on-surface hover:text-primary transition-colors"
            type="button"
            onClick={() => alert('Search catalog opening...')}
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>
          
          <button
            aria-label="Wishlist"
            className="w-11 h-11 flex items-center justify-center text-on-surface hover:text-primary transition-colors"
            type="button"
            onClick={() => alert('Wishlist items saved.')}
          >
            <span className="material-symbols-outlined text-[22px]">favorite</span>
          </button>

          <button
            aria-label="Shopping Cart"
            className="relative w-11 h-11 flex items-center justify-center text-on-surface hover:text-primary transition-colors"
            type="button"
            onClick={() => setIsCartOpen(true)}
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute top-2 right-2 min-w-[16px] h-4 px-1 bg-primary text-pitch-black font-label-mono-sm text-[10px] leading-4 font-bold flex items-center justify-center">
                {cartCount < 10 ? `0${cartCount}` : cartCount}
              </span>
            )}
          </button>

          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-1 cursor-pointer">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}
