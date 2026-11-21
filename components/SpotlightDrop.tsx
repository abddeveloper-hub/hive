'use client';

import React, { useState } from 'react';
import { SPOTLIGHT_PRODUCT } from '@/data/products';
import { useCart } from '@/context/CartContext';

export default function SpotlightDrop() {
  const { addToCart, lastToast } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>(SPOTLIGHT_PRODUCT.defaultSize);
  const [quantity, setQuantity] = useState<number>(1);

  const handleAdd = () => {
    addToCart({
      productId: SPOTLIGHT_PRODUCT.id,
      name: SPOTLIGHT_PRODUCT.name,
      price: SPOTLIGHT_PRODUCT.price,
      originalPrice: SPOTLIGHT_PRODUCT.originalPrice,
      size: selectedSize,
      quantity: quantity,
      image: SPOTLIGHT_PRODUCT.image,
      colorway: SPOTLIGHT_PRODUCT.colorway,
    });
  };

  return (
    <section className="w-full pt-10 px-4">
      <div className="w-full bg-surface-container-low p-5 flex flex-col space-y-4 relative overflow-hidden">
        {/* Top header line */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
            <span className="font-label-mono-sm text-label-mono-sm uppercase text-secondary font-bold tracking-widest">
              ITEM OF THE DAY
            </span>
          </div>
          <span className="font-label-mono-sm text-label-mono-sm text-outline tracking-wider">
            01 // 08 SPOTLIGHT
          </span>
        </div>

        {/* Main product interactive showcase */}
        <div className="w-full aspect-[4/3] overflow-hidden bg-surface-container relative">
          <img
            className="w-full h-full object-cover"
            src={SPOTLIGHT_PRODUCT.image}
            alt={SPOTLIGHT_PRODUCT.alt}
            id="spotlight-img"
          />
          <div className="absolute bottom-3 left-3 bg-rust-leather text-pure-white font-badge-caps text-badge-caps uppercase px-2 py-1">
            {SPOTLIGHT_PRODUCT.discountTag}
          </div>
        </div>

        {/* Details */}
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-headline-md text-headline-md uppercase font-bold text-on-surface leading-tight">
                {SPOTLIGHT_PRODUCT.name}
              </h3>
              <p className="font-label-mono-sm text-label-mono-sm uppercase text-outline">
                Colorway: {SPOTLIGHT_PRODUCT.colorway}
              </p>
            </div>
            <button
              aria-label="Favorite item"
              className="w-9 h-9 bg-surface-container-high rounded-full flex items-center justify-center text-on-surface hover:text-secondary transition-colors"
              type="button"
              onClick={() => alert('Saved to favorites')}
            >
              <span className="material-symbols-outlined text-[20px]">favorite</span>
            </button>
          </div>

          <div className="flex items-baseline gap-2 pt-1">
            <span className="font-display-hero-mobile text-2xl font-bold text-pure-white">
              ₹{SPOTLIGHT_PRODUCT.price.toLocaleString('en-IN')}.00
            </span>
            <span className="font-body-md text-body-md text-outline line-through">
              ₹{SPOTLIGHT_PRODUCT.originalPrice.toLocaleString('en-IN')}.00
            </span>
            <span className="font-label-mono-sm text-label-mono-sm text-on-surface-variant font-medium">
              (Taxes included)
            </span>
          </div>
        </div>

        {/* Size Selector */}
        <div className="space-y-2 pt-1">
          <div className="flex justify-between items-center">
            <span className="font-label-mono-sm text-label-mono-sm uppercase text-on-surface font-semibold tracking-wider">
              Select Waist Size (Inches)
            </span>
            <button
              className="font-label-mono-sm text-[11px] text-outline underline uppercase hover:text-on-surface"
              type="button"
              onClick={() => alert('Standard Men\'s waist sizing. Choose true to size for classic fit or +1 for extra stack.')}
            >
              Size Guide
            </button>
          </div>

          <div className="grid grid-cols-5 gap-2" id="size-options">
            {SPOTLIGHT_PRODUCT.sizes.map((size) => {
              const isSelected = selectedSize === size;
              return (
                <button
                  key={size}
                  className={`size-btn py-2.5 font-label-mono-lg text-label-mono-lg uppercase text-center transition-all ${
                    isSelected
                      ? 'bg-primary text-pitch-black font-bold'
                      : 'bg-surface-container-high text-on-surface font-semibold hover:bg-surface-bright'
                  }`}
                  onClick={() => setSelectedSize(size)}
                  type="button"
                >
                  {size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quantity + Add to Cart */}
        <div className="pt-2 flex gap-3">
          {/* Quantity counter */}
          <div className="flex items-center bg-surface-container-high px-2 py-1 w-28 justify-between">
            <button
              aria-label="Decrease quantity"
              className="w-8 h-8 flex items-center justify-center text-on-surface hover:text-pure-white"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">remove</span>
            </button>
            <span className="font-label-mono-lg text-label-mono-lg font-bold text-on-surface">
              {quantity}
            </span>
            <button
              aria-label="Increase quantity"
              className="w-8 h-8 flex items-center justify-center text-on-surface hover:text-pure-white"
              onClick={() => setQuantity((q) => q + 1)}
              type="button"
            >
              <span className="material-symbols-outlined text-[18px]">add</span>
            </button>
          </div>

          {/* Add to cart CTA */}
          <button
            className="flex-1 bg-pure-white hover:bg-off-white text-pitch-black font-headline-sm text-headline-sm uppercase py-3 px-4 font-bold tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
            onClick={handleAdd}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">shopping_bag</span>
            <span>ADD TO CART</span>
          </button>
        </div>

        {/* Micro notification toast */}
        {lastToast && (
          <div className="bg-rust-leather text-pure-white p-2.5 text-center font-label-mono-sm text-label-mono-sm uppercase tracking-wider animate-fadeIn">
            {lastToast}
          </div>
        )}
      </div>
    </section>
  );
}
