'use client';

import React from 'react';
import { Product } from '@/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isInWishlist, setQuickViewProduct } = useCart();
  const isWish = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.isSoldOut) return;

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
  };

  const handleWishlistClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div
      className={`denim-card flex flex-col bg-surface-container-low group cursor-pointer transition-transform duration-200 relative ${
        product.isSoldOut ? 'opacity-85' : ''
      }`}
      onClick={() => setQuickViewProduct(product)}
    >
      <div className="relative w-full aspect-[3/4] overflow-hidden bg-surface-container">
        <img
          alt={product.alt || product.name}
          className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 ${
            product.isSoldOut ? 'grayscale-[30%]' : ''
          }`}
          loading="lazy"
          src={product.image}
        />

        {product.isSoldOut && (
          <div className="absolute inset-0 bg-pitch-black/40 flex items-center justify-center">
            <span className="bg-surface-dark/95 text-pure-white font-badge-caps text-badge-caps uppercase px-3 py-1 tracking-widest">
              SOLD OUT
            </span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          {product.discountBadge && (
            <span className="bg-rust-leather text-pure-white font-badge-caps text-badge-caps uppercase px-1.5 py-0.5">
              {product.discountBadge}
            </span>
          )}
          {product.badgeLabel && (
            <span className="bg-pitch-black/80 text-pure-white font-label-mono-sm text-[10px] px-1.5 py-0.5 uppercase">
              {product.badgeLabel}
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          aria-label="Wishlist toggle"
          className={`absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center transition-all ${
            isWish
              ? 'bg-secondary text-pitch-black shadow-md'
              : 'bg-pitch-black/60 text-pure-white/80 hover:text-secondary'
          }`}
          onClick={handleWishlistClick}
          type="button"
        >
          <span className="material-symbols-outlined text-[15px]">
            {isWish ? 'favorite' : 'favorite_border'}
          </span>
        </button>
      </div>

      <div className="p-2.5 flex flex-col justify-between flex-grow space-y-1.5">
        <h3
          className={`font-headline-sm text-headline-sm uppercase tracking-tight line-clamp-1 ${
            product.isSoldOut ? 'text-on-surface-variant' : 'text-on-surface'
          }`}
        >
          {product.name}
        </h3>

        <div className="flex items-baseline gap-1.5">
          <span
            className={`font-label-mono-lg text-label-mono-lg font-bold ${
              product.isSoldOut ? 'text-on-surface-variant' : 'text-pure-white'
            }`}
          >
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          {product.originalPrice && (
            <span className="font-label-mono-sm text-label-mono-sm text-outline line-through">
              ₹{product.originalPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        <div className="pt-1 flex items-center justify-between">
          {product.isSoldOut ? (
            <>
              <span className="font-label-mono-sm text-[10px] text-error uppercase">Join Waitlist</span>
              <span className="material-symbols-outlined text-outline text-[18px]">notifications</span>
            </>
          ) : (
            <>
              <span className="font-label-mono-sm text-[10px] text-outline uppercase">
                {product.sizes.length} Sizes ({product.sizes[0]}-{product.sizes[product.sizes.length - 1]})
              </span>
              <button
                aria-label={`Quick add ${product.name}`}
                className="w-7 h-7 bg-surface-container-highest text-on-surface flex items-center justify-center hover:bg-primary hover:text-pitch-black transition-colors"
                onClick={handleQuickAdd}
                type="button"
              >
                <span className="material-symbols-outlined text-[16px]">add</span>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
