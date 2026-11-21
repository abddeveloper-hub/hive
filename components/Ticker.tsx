import React from 'react';

export default function Ticker() {
  return (
    <div className="w-full bg-surface-container py-2.5 px-4 flex items-center justify-between overflow-x-hidden">
      <div className="flex items-center gap-6 whitespace-nowrap animate-pulse">
        <span className="font-label-mono-sm text-label-mono-sm text-outline uppercase tracking-widest">
          ARCHIVAL CUTS
        </span>
        <span className="w-1.5 h-1.5 bg-rust-leather rounded-full"></span>
        <span className="font-label-mono-sm text-label-mono-sm text-outline uppercase tracking-widest">
          HEAVYWEIGHT SELVEDGE
        </span>
        <span className="w-1.5 h-1.5 bg-rust-leather rounded-full"></span>
        <span className="font-label-mono-sm text-label-mono-sm text-outline uppercase tracking-widest">
          MADE FOR THE RELENTLESS
        </span>
      </div>
    </div>
  );
}
