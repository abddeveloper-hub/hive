'use client';

import React from 'react';
import { useCart } from '@/context/CartContext';

export default function WishlistDrawer() {
  const {
    wishlist,
    wishlistCount,
    isWishlistOpen,
    setIsWishlistOpen,
    toggleWishlist,
    addToCart,
  } = useCart();

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-pitch-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      {/* Drawer */}
      <aside className="relative w-full max-w-md bg-surface border-l border-surface-container-high h-full flex flex-col z-10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">favorite</span>
            <h2 className="font-headline-sm text-headline-sm uppercase font-bold text-on-surface">
              SAVED WISHLIST ({wishlistCount})
            </h2>
          </div>
          <button
            aria-label="Close wishlist"
            className="w-9 h-9 flex items-center justify-center text-outline hover:text-pure-white transition-colors"
            onClick={() => setIsWishlistOpen(false)}
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Wishlist Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {wishlist.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 p-6">
              <span className="material-symbols-outlined text-[48px] text-outline">favorite_border</span>
              <p className="font-headline-sm text-headline-sm uppercase text-on-surface">
                No items saved yet
              </p>
              <p className="font-label-mono-sm text-label-mono-sm text-outline">
                Click the heart icon on any denim or jacket to keep track of styles you love.
              </p>
              <button
                className="mt-2 px-6 py-2.5 bg-primary text-pitch-black font-label-mono-lg uppercase font-bold hover:bg-pure-white transition-colors"
                onClick={() => setIsWishlistOpen(false)}
                type="button"
              >
                EXPLORE STYLES
              </button>
            </div>
          ) : (
            wishlist.map((product) => (
              <div
                key={product.id}
                className="flex gap-3 bg-surface-container-low p-3 border border-surface-container"
              >
                <div className="w-16 h-20 bg-surface-container flex-shrink-0 overflow-hidden">
                  <img
                    alt={product.name}
                    className="w-full h-full object-cover"
                    src={product.image}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-headline-sm text-sm uppercase font-semibold text-on-surface line-clamp-1">
                        {product.name}
                      </h4>
                      <button
                        aria-label="Remove from wishlist"
                        className="text-outline hover:text-error transition-colors"
                        onClick={() => toggleWishlist(product)}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">close</span>
                      </button>
                    </div>
                    {product.colorway && (
                      <p className="font-label-mono-sm text-[10px] text-outline mt-0.5">
                        {product.colorway}
                      </p>
                    )}
                    <div className="flex items-baseline gap-1.5 pt-1">
                      <span className="font-label-mono-lg text-sm font-bold text-pure-white">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="font-label-mono-sm text-[11px] text-outline line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="pt-2">
                    <button
                      className="w-full py-1.5 bg-primary text-pitch-black font-label-mono-sm text-xs font-bold uppercase hover:bg-pure-white transition-colors flex items-center justify-center gap-1.5"
                      onClick={() => {
                        addToCart({
                          productId: product.id,
                          name: product.name,
                          price: product.price,
                          originalPrice: product.originalPrice,
                          size: product.sizes[0] || 'M',
                          quantity: 1,
                          image: product.image,
                          colorway: product.colorway,
                        });
                        toggleWishlist(product);
                      }}
                      type="button"
                    >
                      <span className="material-symbols-outlined text-[16px]">shopping_bag</span>
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </div>
  );
}
