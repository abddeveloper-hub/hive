'use client';

import React, { useState } from 'react';
import { CURATED_LOOK } from '@/data/products';
import { useCart } from '@/context/CartContext';

export default function CuratedLook() {
  const { addToCart } = useCart();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddBundle = () => {
    // Add both items to the cart
    CURATED_LOOK.items.forEach((item) => {
      addToCart({
        productId: item.id,
        name: item.name,
        price: item.price,
        originalPrice: item.originalPrice,
        size: item.size.replace('Size ', ''),
        quantity: 1,
        image: item.image,
      });
    });

    setToastMessage('✓ Look #04 added to bag with 10% bundle discount');
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  return (
    <section className="w-full pt-10 px-4">
      <div className="w-full bg-surface-container-low p-4 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-badge-caps text-badge-caps uppercase text-rust-leather tracking-widest font-bold">
            CURATED ENSEMBLE
          </span>
          <span className="font-label-mono-sm text-label-mono-sm uppercase text-outline">
            {CURATED_LOOK.label}
          </span>
        </div>

        <div className="relative w-full aspect-[4/5] overflow-hidden bg-surface-container">
          <img
            className="w-full h-full object-cover"
            src={CURATED_LOOK.heroImage}
            alt="Editorial streetwear shot of male model wearing Drive Jacket and Vintage Bootcut Denim"
          />
          <div className="absolute bottom-3 left-3 bg-pitch-black/85 text-pure-white px-3 py-1 font-label-mono-sm text-label-mono-sm uppercase tracking-wider backdrop-blur-sm">
            {CURATED_LOOK.title}
          </div>
        </div>

        {/* Micro combo items */}
        <div className="space-y-3 pt-1">
          {CURATED_LOOK.items.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-surface-container p-2.5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-14 bg-surface-container-high overflow-hidden flex-shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    src={item.image}
                    alt={item.name}
                  />
                </div>
                <div>
                  <p className="font-headline-sm text-headline-sm uppercase font-semibold text-on-surface">
                    {item.name}
                  </p>
                  <p className="font-label-mono-sm text-label-mono-sm text-pure-white font-bold">
                    ₹{item.price.toLocaleString('en-IN')}{' '}
                    <span className="text-outline line-through font-normal">
                      ₹{item.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </p>
                </div>
              </div>
              <span className="px-2.5 py-1.5 bg-surface-container-highest text-on-surface font-label-mono-sm text-label-mono-sm uppercase">
                {item.size}
              </span>
            </div>
          ))}
        </div>

        {/* Combo Action */}
        <button
          className="w-full py-3.5 bg-primary text-pitch-black font-headline-sm text-headline-sm uppercase font-bold tracking-wider text-center flex items-center justify-center gap-2 hover:bg-pure-white transition-all active:scale-[0.98]"
          onClick={handleAddBundle}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">style</span>
          <span>ADD COMPLETE LOOK TO CART (₹{CURATED_LOOK.bundlePrice.toLocaleString('en-IN')})</span>
        </button>

        {toastMessage && (
          <div className="bg-rust-leather text-pure-white p-2.5 text-center font-label-mono-sm text-label-mono-sm uppercase tracking-wider animate-fadeIn">
            {toastMessage}
          </div>
        )}
      </div>
    </section>
  );
}
