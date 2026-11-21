'use client';

import React, { useState } from 'react';
import { DENIM_PRODUCTS } from '@/data/products';
import ProductCard from './ProductCard';

type FitFilter = 'all' | 'bootcut' | 'straight' | 'baggy' | 'barrel';

export default function DenimCatalog() {
  const [activeFit, setActiveFit] = useState<FitFilter>('all');

  const filteredDenims = DENIM_PRODUCTS.filter((item) => {
    if (activeFit === 'all') return true;
    return item.fit === activeFit;
  });

  const filterButtons: { label: string; value: FitFilter }[] = [
    { label: 'ALL FITS', value: 'all' },
    { label: 'BOOTCUT', value: 'bootcut' },
    { label: 'STRAIGHT', value: 'straight' },
    { label: 'BAGGY', value: 'baggy' },
    { label: 'BARREL', value: 'barrel' },
  ];

  return (
    <section className="w-full pt-8 px-4 flex flex-col space-y-4" id="denim-catalog">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-label-mono-sm text-label-mono-sm uppercase text-outline tracking-widest">
            ARCHIVE SELECTOR
          </span>
          <span className="font-label-mono-sm text-label-mono-sm uppercase text-secondary font-semibold">
            106 STYLES
          </span>
        </div>
        <div className="flex items-baseline justify-between">
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile uppercase font-bold text-on-surface">
            SHOP BY FIT — <span className="text-outline">DENIMS</span>
          </h2>
        </div>
      </div>

      {/* Fit Pills Interactive Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none" id="fit-pills">
        {filterButtons.map((btn) => {
          const isActive = activeFit === btn.value;
          return (
            <button
              key={btn.value}
              className={`fit-btn px-4 py-2 font-headline-sm text-headline-sm uppercase tracking-wider whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-primary text-pitch-black font-semibold'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-bright'
              }`}
              onClick={() => setActiveFit(btn.value)}
              type="button"
            >
              {btn.label}
            </button>
          );
        })}
      </div>

      {/* 2-Column Product Grid */}
      <div className="grid grid-cols-2 gap-3 pt-2" id="denim-grid">
        {filteredDenims.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* View All CTA */}
      <a
        className="w-full py-3 bg-surface-container-high hover:bg-surface-bright text-on-surface font-headline-sm text-headline-sm uppercase tracking-widest text-center flex items-center justify-center gap-2 transition-colors"
        href="#denim-catalog"
      >
        <span>VIEW ALL CLASSIC DENIM (106)</span>
        <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
      </a>
    </section>
  );
}
