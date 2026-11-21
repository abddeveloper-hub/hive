'use client';

import React from 'react';
import { REVIEWS } from '@/data/products';

export default function CustomerReviews() {
  return (
    <section className="w-full pt-10 px-4 flex flex-col space-y-4">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center justify-between">
          <span className="font-label-mono-sm text-label-mono-sm uppercase text-outline tracking-widest">
            VERIFIED WORDS
          </span>
          <div className="flex text-rust-leather text-xs tracking-tight">
            ★★★★★
          </div>
        </div>
        <h2 className="font-headline-lg-mobile text-headline-lg-mobile uppercase font-bold text-on-surface leading-snug">
          THESE ARE ALL REAL PEOPLE,<br />
          <span className="text-outline">REAL WORDS — THIS IS HIVE.</span>
        </h2>
      </div>

      {/* Review Cards (Horizontal Carousel) */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none snap-x snap-mandatory">
        {REVIEWS.map((rev) => (
          <div
            key={rev.id}
            className="min-w-[260px] max-w-[280px] bg-surface-container-low p-4 flex flex-col justify-between space-y-3 snap-start"
          >
            <div className="space-y-2">
              <div className="flex text-secondary text-sm">
                {'★'.repeat(rev.rating)}
              </div>
              <p className="font-body-md text-body-md text-on-surface italic leading-relaxed">
                {rev.content}
              </p>
            </div>
            <div className="pt-2 flex items-center justify-between">
              <span className="font-label-mono-sm text-label-mono-sm uppercase font-bold text-primary">
                {rev.author}
              </span>
              <span className="font-label-mono-sm text-[10px] text-outline uppercase">
                Verified Buyer
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Review Action */}
      <div className="pt-2 flex flex-col space-y-2">
        <button
          className="w-full py-3 bg-surface-container-high hover:bg-surface-bright text-on-surface font-headline-sm text-headline-sm uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-colors"
          type="button"
          onClick={() => alert('Review submission modal opening...')}
        >
          <span className="material-symbols-outlined text-[18px]">rate_review</span>
          <span>WRITE A REVIEW</span>
        </button>
        <a
          className="w-full py-3 bg-rust-leather text-pure-white font-headline-sm text-headline-sm uppercase tracking-wider text-center flex items-center justify-center gap-2 transition-opacity hover:opacity-95"
          href="https://instagram.com"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="material-symbols-outlined text-[18px]">photo_camera</span>
          <span>JOIN THE COMMUNITY ON INSTAGRAM</span>
        </a>
      </div>
    </section>
  );
}
