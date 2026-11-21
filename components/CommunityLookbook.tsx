'use client';

import React from 'react';
import { COMMUNITY_LOOKS, DENIM_PRODUCTS } from '@/data/products';
import { useCart } from '@/context/CartContext';

export default function CommunityLookbook() {
  const { setQuickViewProduct } = useCart();

  const handleShopProduct = (productId: string) => {
    const found = DENIM_PRODUCTS.find((p) => p.id === productId);
    if (found) {
      setQuickViewProduct(found);
    }
  };

  return (
    <section className="w-full pt-10 px-4 flex flex-col space-y-4">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-label-mono-sm text-label-mono-sm uppercase text-outline tracking-widest">
            STYLED BY THE COMMUNITY
          </span>
          <span className="font-label-mono-sm text-label-mono-sm text-secondary font-semibold uppercase">
            #HIVEARCHIVE
          </span>
        </div>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile uppercase font-bold text-on-surface">
          HOW STREETWEAR WEARS <span className="text-outline">HIVE</span>
        </h2>
      </div>

      {/* 2x2 Grid of Community Looks */}
      <div className="grid grid-cols-2 gap-3">
        {COMMUNITY_LOOKS.map((look) => (
          <div
            key={look.id}
            className="relative aspect-[3/4] bg-surface-container overflow-hidden group cursor-pointer"
            onClick={() => handleShopProduct(look.taggedProduct.id)}
          >
            <img
              alt={`Styled by ${look.instagramHandle}`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              src={look.image}
            />
            {/* Scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-pitch-black/85 via-pitch-black/20 to-transparent flex flex-col justify-end p-2.5">
              <span className="font-label-mono-sm text-[10px] text-pure-white font-bold">
                {look.instagramHandle}
              </span>
              <span className="font-label-mono-sm text-[9px] text-outline">
                {look.location}
              </span>
              <div className="mt-1 flex items-center justify-between pt-1 border-t border-surface-container-high/60">
                <span className="font-label-mono-sm text-[9px] text-secondary truncate max-w-[90px]">
                  {look.taggedProduct.name}
                </span>
                <span className="font-label-mono-sm text-[9px] bg-primary text-pitch-black px-1.5 py-0.5 font-bold uppercase">
                  Shop
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
