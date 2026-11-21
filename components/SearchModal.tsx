'use client';

import React, { useState, useMemo } from 'react';
import { useCart } from '@/context/CartContext';
import { DENIM_PRODUCTS, TOPWEAR_PRODUCTS, SPOTLIGHT_PRODUCT } from '@/data/products';
import { Product } from '@/types';

export default function SearchModal() {
  const { isSearchOpen, setIsSearchOpen, addToCart, setQuickViewProduct } = useCart();
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const allProducts = useMemo(() => {
    return [SPOTLIGHT_PRODUCT, ...DENIM_PRODUCTS, ...TOPWEAR_PRODUCTS];
  }, []);

  const searchResults = useMemo(() => {
    return allProducts.filter((p) => {
      const matchCat =
        selectedCategory === 'all' ||
        (selectedCategory === 'denim' && p.category === 'denim') ||
        (selectedCategory === 'shirts' && p.category === 'shirts') ||
        (selectedCategory === 'tshirts' && p.category === 'tshirts') ||
        (selectedCategory === 'jackets' && p.category === 'jackets');

      if (!matchCat) return false;

      if (!query.trim()) return true;

      const q = query.toLowerCase();
      const inName = p.name.toLowerCase().includes(q);
      const inColor = p.colorway?.toLowerCase().includes(q);
      const inFit = p.fit?.toLowerCase().includes(q);
      const inDesc = p.description?.toLowerCase().includes(q);
      const inSpecs = p.fabricSpecs?.weight?.toLowerCase().includes(q);

      return inName || inColor || inFit || inDesc || inSpecs;
    });
  }, [allProducts, query, selectedCategory]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-4 md:pt-16 px-3">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-pitch-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl bg-surface border border-surface-container-high shadow-2xl z-10 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 bg-surface-container-low border-b border-surface-container flex items-center gap-3">
          <span className="material-symbols-outlined text-outline text-[24px]">search</span>
          <input
            autoFocus
            className="flex-1 bg-transparent text-pure-white font-headline-sm text-lg outline-none placeholder:text-outline"
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search bootcut, selvedge, olive tee, jackets..."
            type="text"
            value={query}
          />
          {query && (
            <button
              className="text-outline hover:text-pure-white text-xs uppercase font-label-mono-sm"
              onClick={() => setQuery('')}
              type="button"
            >
              Clear
            </button>
          )}
          <button
            aria-label="Close search"
            className="w-9 h-9 flex items-center justify-center text-outline hover:text-pure-white transition-colors"
            onClick={() => setIsSearchOpen(false)}
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 p-3 bg-surface-container overflow-x-auto scrollbar-none border-b border-surface-container-high">
          {[
            { id: 'all', label: 'All Catalog' },
            { id: 'denim', label: 'Denim' },
            { id: 'shirts', label: 'Shirts' },
            { id: 'tshirts', label: 'Tees' },
            { id: 'jackets', label: 'Jackets' },
          ].map((cat) => (
            <button
              key={cat.id}
              className={`px-3 py-1 font-label-mono-sm text-xs uppercase tracking-wider whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-primary text-pitch-black font-bold'
                  : 'bg-surface-container-high text-on-surface hover:bg-surface-bright'
              }`}
              onClick={() => setSelectedCategory(cat.id)}
              type="button"
            >
              {cat.label}
            </button>
          ))}
          <span className="ml-auto font-label-mono-sm text-[11px] text-outline whitespace-nowrap pl-2">
            {searchResults.length} styles
          </span>
        </div>

        {/* Search Results List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {searchResults.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <span className="material-symbols-outlined text-[40px] text-outline">search_off</span>
              <p className="font-headline-sm text-headline-sm uppercase text-on-surface">No styles found</p>
              <p className="font-label-mono-sm text-label-mono-sm text-outline">
                Try searching for &quot;Bootcut&quot;, &quot;Baggy&quot;, &quot;Olive&quot;, or &quot;Shirt&quot;
              </p>
            </div>
          ) : (
            searchResults.map((product) => (
              <div
                key={product.id}
                className="flex items-center justify-between gap-3 bg-surface-container-low p-2.5 border border-surface-container hover:border-outline-variant transition-colors group cursor-pointer"
                onClick={() => {
                  setQuickViewProduct(product);
                  setIsSearchOpen(false);
                }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-14 h-16 bg-surface-container overflow-hidden flex-shrink-0">
                    <img
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      src={product.image}
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-headline-sm text-sm uppercase font-semibold text-on-surface">
                        {product.name}
                      </h4>
                      {product.badgeLabel && (
                        <span className="font-label-mono-sm text-[9px] bg-pitch-black px-1.5 py-0.5 text-pure-white uppercase">
                          {product.badgeLabel}
                        </span>
                      )}
                    </div>
                    {product.colorway && (
                      <p className="font-label-mono-sm text-[11px] text-outline">
                        Color: {product.colorway}
                      </p>
                    )}
                    <div className="flex items-baseline gap-1.5 pt-0.5">
                      <span className="font-label-mono-lg text-xs font-bold text-pure-white">
                        ₹{product.price.toLocaleString('en-IN')}
                      </span>
                      {product.originalPrice && (
                        <span className="font-label-mono-sm text-[10px] text-outline line-through">
                          ₹{product.originalPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    className="px-3 py-1.5 bg-surface-container-highest text-on-surface font-label-mono-sm text-[11px] uppercase hover:bg-primary hover:text-pitch-black transition-colors"
                    onClick={(e) => {
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
                    }}
                    type="button"
                  >
                    {product.isSoldOut ? 'Sold Out' : '+ Quick Add'}
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
