'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function Header() {
  const {
    cartCount,
    wishlistCount,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    lastOrder,
  } = useCart();

  const [showAccountMenu, setShowAccountMenu] = useState(false);

  return (
    <header className="fixed top-0 w-full z-40 pt-safe bg-surface/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.25)]">
      {/* Top Banner */}
      <div className="w-full bg-rust-leather text-pure-white py-1 px-4 text-center">
        <p className="font-label-mono-sm text-label-mono-sm uppercase tracking-widest truncate">
          Free shipping on orders above ₹1,999 • Diwali Drop Live
        </p>
      </div>

      {/* Main Bar */}
      <div className="h-20 px-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            aria-label="HIVE home"
            className="flex flex-col items-start leading-none"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            type="button"
          >
            <span className="font-headline-sm text-[22px] font-bold uppercase tracking-[0.14em] text-on-surface">
              HIVE
            </span>
            <span className="mt-1 font-label-mono-sm text-[9px] uppercase tracking-[0.2em] text-outline">
              Streetwear
            </span>
          </button>
        </div>

        <div className="flex items-center gap-1">
          {/* Search Trigger */}
          <button
            aria-label="Search Catalog"
            className="w-11 h-11 flex items-center justify-center text-on-surface hover:text-primary transition-colors"
            onClick={() => setIsSearchOpen(true)}
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">search</span>
          </button>

          {/* Wishlist Trigger */}
          <button
            aria-label="Wishlist"
            className="relative w-11 h-11 flex items-center justify-center text-on-surface hover:text-primary transition-colors"
            onClick={() => setIsWishlistOpen(true)}
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">favorite</span>
            {wishlistCount > 0 && (
              <span className="absolute top-2 right-2 min-w-[16px] h-4 px-1 bg-secondary text-pitch-black font-label-mono-sm text-[10px] leading-4 font-bold flex items-center justify-center">
                {wishlistCount < 10 ? `0${wishlistCount}` : wishlistCount}
              </span>
            )}
          </button>

          {/* Shopping Cart Trigger */}
          <button
            aria-label="Shopping Cart"
            className="relative w-11 h-11 flex items-center justify-center text-on-surface hover:text-primary transition-colors"
            onClick={() => setIsCartOpen(true)}
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute top-2 right-2 min-w-[16px] h-4 px-1 bg-primary text-pitch-black font-label-mono-sm text-[10px] leading-4 font-bold flex items-center justify-center">
                {cartCount < 10 ? `0${cartCount}` : cartCount}
              </span>
            )}
          </button>

          {/* Profile / Account Menu */}
          <div className="relative">
            <button
              aria-label="User Account"
              className="w-8 h-8 rounded-full bg-primary flex items-center justify-center ml-1 cursor-pointer transition-transform hover:scale-105"
              onClick={() => setShowAccountMenu(!showAccountMenu)}
              type="button"
            >
              <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
            </button>

            {showAccountMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-surface-container-low border border-surface-container shadow-2xl p-3 space-y-2 z-50 animate-fadeIn">
                <div className="border-b border-surface-container pb-2">
                  <p className="font-headline-sm text-xs font-bold text-pure-white uppercase">
                    Customer Portal
                  </p>
                  <p className="font-label-mono-sm text-[10px] text-outline">
                    Bandra Flagship Member
                  </p>
                </div>
                {lastOrder ? (
                  <div className="p-2 bg-surface-container border border-surface-container-high space-y-1">
                    <span className="font-label-mono-sm text-[9px] text-emerald-400 font-bold uppercase">
                      Active Order #{lastOrder.orderId}
                    </span>
                    <p className="font-label-mono-sm text-[10px] text-pure-white truncate">
                      {lastOrder.items.length} items • ₹{lastOrder.total.toLocaleString('en-IN')}
                    </p>
                  </div>
                ) : (
                  <p className="font-label-mono-sm text-[10px] text-outline">
                    No active shipments. Explore the FW // 2025 drop.
                  </p>
                )}
                <div className="pt-1 flex flex-col space-y-1 font-label-mono-sm text-[11px] text-on-surface uppercase">
                  <button
                    className="text-left py-1 hover:text-primary transition-colors"
                    onClick={() => {
                      setIsWishlistOpen(true);
                      setShowAccountMenu(false);
                    }}
                    type="button"
                  >
                    View Saved Items ({wishlistCount})
                  </button>
                  <a
                    className="py-1 hover:text-primary transition-colors"
                    href="tel:+918657868181"
                  >
                    Contact Concierge
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
