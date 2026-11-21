'use client';

import React, { useState } from 'react';
import { TOPWEAR_PRODUCTS } from '@/data/products';
import ProductCard from './ProductCard';

type CategoryFilter = 'all' | 'shirts' | 'tshirts' | 'jackets';

export default function TopwearCatalog() {
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');

  const filteredItems = TOPWEAR_PRODUCTS.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const categories: { label: string; value: CategoryFilter }[] = [
    { label: 'ALL TOPWEAR', value: 'all' },
    { label: 'SHIRTS', value: 'shirts' },
    { label: 'T-SHIRTS', value: 'tshirts' },
    { label: 'JACKETS', value: 'jackets' },
  ];

  return (
    <section className="w-full pt-10 px-4 flex flex-col space-y-4">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-label-mono-sm text-label-mono-sm uppercase text-outline tracking-widest">
            SEASONAL APPAREL
          </span>
          <span className="font-label-mono-sm text-label-mono-sm uppercase text-secondary font-semibold">
            90 PIECES
          </span>
        </div>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile uppercase font-bold text-on-surface">
          SHOP BY STYLE — <span className="text-outline">TOPWEAR</span>
        </h2>
      </div>

      {/* Category Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.value;
          return (
            <button
              key={cat.value}
              className={`topwear-tab px-4 py-2 font-headline-sm text-headline-sm uppercase tracking-wider whitespace-nowrap transition-colors ${
                isActive
                  ? 'bg-primary text-pitch-black font-semibold'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-bright'
              }`}
              onClick={() => setActiveCategory(cat.value)}
              type="button"
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 2-Column Topwear Grid */}
      <div className="grid grid-cols-2 gap-3 pt-2" id="topwear-grid">
        {filteredItems.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
