'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function ReviewModal() {
  const { isReviewModalOpen, setIsReviewModalOpen, addReview } = useCart();
  const [author, setAuthor] = useState('');
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState('');
  const [fitFeedback, setFitFeedback] = useState('True to size');

  if (!isReviewModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;

    addReview({
      author: author.trim(),
      rating,
      content: content.trim(),
      verified: true,
      fitFeedback,
    });

    setAuthor('');
    setContent('');
    setIsReviewModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-pitch-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsReviewModalOpen(false)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-lg bg-surface border border-surface-container-high shadow-2xl z-10 flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div>
            <span className="font-badge-caps text-badge-caps uppercase text-rust-leather tracking-widest font-bold">
              VERIFIED BUYER VOICE
            </span>
            <h2 className="font-headline-sm text-base uppercase font-bold text-on-surface">
              SUBMIT YOUR REVIEW
            </h2>
          </div>
          <button
            aria-label="Close review modal"
            className="w-8 h-8 flex items-center justify-center text-outline hover:text-pure-white transition-colors"
            onClick={() => setIsReviewModalOpen(false)}
            type="button"
          >
            <span className="material-symbols-outlined text-[22px]">close</span>
          </button>
        </div>

        {/* Form Content */}
        <form className="p-4 space-y-4 overflow-y-auto" onSubmit={handleSubmit}>
          {/* Rating stars */}
          <div className="space-y-1">
            <label className="font-label-mono-sm text-[11px] text-outline uppercase block">
              Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className={`text-2xl transition-transform hover:scale-110 ${
                    star <= rating ? 'text-secondary' : 'text-surface-container-highest'
                  }`}
                  onClick={() => setRating(star)}
                  type="button"
                >
                  ★
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div className="space-y-1">
            <label className="font-label-mono-sm text-[11px] text-outline uppercase block">
              Your Name
            </label>
            <input
              required
              className="w-full bg-surface-container border border-surface-container-high p-2.5 text-pure-white font-label-mono-sm text-xs outline-none focus:border-primary"
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="e.g. Farhan S."
              type="text"
              value={author}
            />
          </div>

          {/* Fit Feedback */}
          <div className="space-y-1">
            <label className="font-label-mono-sm text-[11px] text-outline uppercase block">
              Fit Impression
            </label>
            <div className="grid grid-cols-3 gap-1">
              {['Runs small', 'True to size', 'Oversized / Baggy'].map((fit) => (
                <button
                  key={fit}
                  className={`py-2 text-[10px] font-label-mono-sm uppercase border transition-colors ${
                    fitFeedback === fit
                      ? 'bg-primary text-pitch-black font-bold border-primary'
                      : 'bg-surface-container text-on-surface border-surface-container-high hover:border-outline'
                  }`}
                  onClick={() => setFitFeedback(fit)}
                  type="button"
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>

          {/* Review Message */}
          <div className="space-y-1">
            <label className="font-label-mono-sm text-[11px] text-outline uppercase block">
              Review &amp; Fabric Experience
            </label>
            <textarea
              required
              className="w-full bg-surface-container border border-surface-container-high p-2.5 text-pure-white font-body-sm text-xs outline-none focus:border-primary h-24 resize-none"
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tell other streetwear enthusiasts about the denim weight, drape, and styling..."
              value={content}
            />
          </div>

          <button
            className="w-full py-3 bg-primary hover:bg-pure-white text-pitch-black font-headline-sm uppercase font-bold tracking-wider transition-colors"
            type="submit"
          >
            PUBLISH VERIFIED REVIEW
          </button>
        </form>
      </div>
    </div>
  );
}
