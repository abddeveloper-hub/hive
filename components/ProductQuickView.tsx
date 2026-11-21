'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function ProductQuickView() {
  const {
    quickViewProduct,
    setQuickViewProduct,
    addToCart,
    toggleWishlist,
    isInWishlist,
    setIsSizeGuideOpen,
  } = useCart();

  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImage, setActiveImage] = useState<string>('');

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const currentSize = selectedSize || product.sizes[0] || 'M';
  const currentImg = activeImage || product.image;
  const isWish = isInWishlist(product.id);

  const handleAdd = () => {
    if (product.isSoldOut) return;
    addToCart({
      productId: product.id,
      name: product.name,
      price: product.price,
      originalPrice: product.originalPrice,
      size: currentSize,
      quantity: quantity,
      image: product.image,
      colorway: product.colorway,
    });
    setQuickViewProduct(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-pitch-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setQuickViewProduct(null)}
      />

      {/* Modal Box */}
      <div className="relative w-full max-w-2xl bg-surface border border-surface-container-high shadow-2xl z-10 flex flex-col md:flex-row max-h-[90vh] overflow-y-auto md:overflow-hidden">
        {/* Close Button */}
        <button
          aria-label="Close modal"
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-pitch-black/70 flex items-center justify-center text-outline hover:text-pure-white transition-colors"
          onClick={() => setQuickViewProduct(null)}
          type="button"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>

        {/* Left: Product Media Gallery */}
        <div className="w-full md:w-1/2 bg-surface-container relative flex flex-col justify-between">
          <div className="relative w-full aspect-[3/4] overflow-hidden">
            <img
              alt={product.name}
              className="w-full h-full object-cover"
              src={currentImg}
            />
            {product.discountBadge && (
              <span className="absolute top-3 left-3 bg-rust-leather text-pure-white font-badge-caps text-badge-caps uppercase px-2 py-1">
                {product.discountBadge}
              </span>
            )}
            {product.isSoldOut && (
              <div className="absolute inset-0 bg-pitch-black/60 flex items-center justify-center">
                <span className="bg-surface-dark/95 text-pure-white font-badge-caps text-badge-caps uppercase px-4 py-1.5 tracking-widest">
                  SOLD OUT
                </span>
              </div>
            )}
          </div>

          {/* Gallery Thumbnails */}
          {product.gallery && product.gallery.length > 1 && (
            <div className="flex gap-2 p-2 bg-surface-container-low border-t border-surface-container">
              {product.gallery.map((img, idx) => (
                <button
                  key={idx}
                  className={`w-12 h-14 overflow-hidden border ${
                    currentImg === img ? 'border-primary' : 'border-transparent opacity-70'
                  }`}
                  onClick={() => setActiveImage(img)}
                  type="button"
                >
                  <img alt="" className="w-full h-full object-cover" src={img} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Controls */}
        <div className="w-full md:w-1/2 p-5 flex flex-col justify-between space-y-4 bg-surface-container-low overflow-y-auto">
          <div className="space-y-2">
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className="font-label-mono-sm text-[10px] text-outline uppercase tracking-wider block">
                  FW // 2025 DROP ARCHIVE
                </span>
                <h3 className="font-headline-md text-xl uppercase font-bold text-on-surface">
                  {product.name}
                </h3>
              </div>
              <button
                aria-label="Wishlist"
                className={`w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                  isWish ? 'bg-secondary text-pitch-black' : 'bg-surface-container-high text-on-surface hover:text-secondary'
                }`}
                onClick={() => toggleWishlist(product)}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">favorite</span>
              </button>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-2 pt-1">
              <span className="font-display-hero-mobile text-2xl font-bold text-pure-white">
                ₹{product.price.toLocaleString('en-IN')}.00
              </span>
              {product.originalPrice && (
                <span className="font-body-md text-body-md text-outline line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}.00
                </span>
              )}
            </div>

            {/* Description */}
            {product.description && (
              <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Fabric Specs */}
            {product.fabricSpecs && (
              <div className="p-3 bg-surface-container space-y-1 font-label-mono-sm text-[11px] text-outline">
                {product.fabricSpecs.weight && (
                  <p>
                    <span className="text-on-surface font-semibold">Weight:</span> {product.fabricSpecs.weight}
                  </p>
                )}
                {product.fabricSpecs.composition && (
                  <p>
                    <span className="text-on-surface font-semibold">Composition:</span> {product.fabricSpecs.composition}
                  </p>
                )}
                {product.fabricSpecs.wash && (
                  <p>
                    <span className="text-on-surface font-semibold">Wash:</span> {product.fabricSpecs.wash}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Size Picker */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="font-label-mono-sm text-[11px] uppercase text-on-surface font-semibold">
                Select Size
              </span>
              <button
                className="font-label-mono-sm text-[10px] text-outline underline uppercase hover:text-on-surface"
                onClick={() => setIsSizeGuideOpen(true)}
                type="button"
              >
                Size Guide
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((sz) => {
                const isSelected = currentSize === sz;
                return (
                  <button
                    key={sz}
                    className={`min-w-[42px] py-2 px-3 font-label-mono-lg text-xs uppercase text-center transition-all ${
                      isSelected
                        ? 'bg-primary text-pitch-black font-bold'
                        : 'bg-surface-container-high text-on-surface font-semibold hover:bg-surface-bright'
                    }`}
                    onClick={() => setSelectedSize(sz)}
                    type="button"
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Qty & Add to Bag */}
          <div className="space-y-2 pt-2">
            <div className="flex gap-2">
              <div className="flex items-center bg-surface-container-high px-2 py-1 justify-between w-24">
                <button
                  className="text-on-surface hover:text-pure-white"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  type="button"
                >
                  -
                </button>
                <span className="font-label-mono-sm text-xs font-bold text-on-surface">
                  {quantity}
                </span>
                <button
                  className="text-on-surface hover:text-pure-white"
                  onClick={() => setQuantity((q) => q + 1)}
                  type="button"
                >
                  +
                </button>
              </div>

              <button
                className={`flex-1 py-3 px-4 font-headline-sm text-sm uppercase font-bold tracking-wider flex items-center justify-center gap-2 transition-all ${
                  product.isSoldOut
                    ? 'bg-surface-container text-outline cursor-not-allowed'
                    : 'bg-pure-white hover:bg-off-white text-pitch-black active:scale-[0.98]'
                }`}
                disabled={product.isSoldOut}
                onClick={handleAdd}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">shopping_bag</span>
                <span>{product.isSoldOut ? 'SOLD OUT' : 'ADD TO BAG'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
