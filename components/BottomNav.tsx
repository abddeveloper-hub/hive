'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';

export default function BottomNav() {
  const { cartCount, setIsCartOpen } = useCart();

  return (
    <nav
      className="fixed bottom-0 w-full z-40 pb-safe bg-surface/90 backdrop-blur-xl shadow-[0_-1px_12px_rgba(0,0,0,0.3)] border-t border-surface-container"
      data-active-classes="text-primary font-bold"
    >
      <div className="flex justify-around items-center h-16 px-2">
        <a
          aria-current="page"
          className="flex flex-col items-center justify-center gap-1 w-16 h-12 transition-colors text-primary font-bold"
          data-path="home"
          href="#"
        >
          <span className="material-symbols-outlined text-[22px]">home</span>
          <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider">
            Home
          </span>
        </a>

        <a
          className="flex flex-col items-center justify-center gap-1 w-16 h-12 text-on-surface-variant hover:text-on-surface transition-colors"
          data-path="shop-catalog"
          href="#denim-catalog"
        >
          <span className="material-symbols-outlined text-[22px]">grid_view</span>
          <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider">
            Shop
          </span>
        </a>

        <button
          className="relative flex flex-col items-center justify-center gap-1 w-16 h-12 text-on-surface-variant hover:text-on-surface transition-colors"
          data-path="cart"
          onClick={() => setIsCartOpen(true)}
          type="button"
        >
          <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
          {cartCount > 0 && (
            <span className="absolute top-1 right-3 min-w-[14px] h-3.5 px-0.5 bg-rust-leather text-pure-white font-label-mono-sm text-[9px] leading-3.5 font-bold flex items-center justify-center">
              {cartCount}
            </span>
          )}
          <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider">
            Bag
          </span>
        </button>

        <a
          className="flex flex-col items-center justify-center gap-1 w-16 h-12 text-on-surface-variant hover:text-on-surface transition-colors"
          data-path="account"
          href="tel:+918657868181"
        >
          <span className="material-symbols-outlined text-[22px]">call</span>
          <span className="font-label-mono-sm text-label-mono-sm uppercase tracking-wider">
            Store
          </span>
        </a>
      </div>
    </nav>
  );
}
