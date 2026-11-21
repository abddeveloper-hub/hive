import React from 'react';

export default function FlagshipStore() {
  return (
    <section className="w-full pt-10 px-4">
      <div className="w-full bg-surface-container-low p-5 flex flex-col space-y-4">
        <div className="flex items-center justify-between">
          <span className="font-badge-caps text-badge-caps uppercase text-secondary font-bold tracking-widest">
            PHYSICAL ARCHIVE
          </span>
          <span className="flex items-center gap-1 font-label-mono-sm text-label-mono-sm text-outline">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> OPEN TODAY
          </span>
        </div>

        <div>
          <h2 className="font-headline-lg-mobile text-headline-lg-mobile uppercase font-bold text-on-surface leading-tight">
            OUR OFFLINE STORE —<br />
            <span className="text-outline">CHAPEL RD, BANDRA</span>
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant pt-2 leading-relaxed">
            “Three years online. Now, somewhere to feel the denim for yourself.”
          </p>
        </div>

        {/* Location Visual Container */}
        <div
          className="relative w-full h-48 overflow-hidden bg-surface-container"
          data-location="29 Chapel Rd Ranwar Village Bandra West Mumbai"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-pitch-black/80 to-transparent flex flex-col justify-end p-3">
            <p className="font-headline-sm text-headline-sm uppercase font-bold text-pure-white">
              HIVE BANDRA WEST
            </p>
            <p className="font-label-mono-sm text-label-mono-sm text-on-surface-variant">
              29, Chapel Rd, Ranwar Village, Bandra West, Mumbai 400 050
            </p>
          </div>
        </div>

        {/* Timings and Details */}
        <div className="grid grid-cols-2 gap-2 bg-surface-container p-3">
          <div>
            <span className="font-label-mono-sm text-[10px] uppercase text-outline block">STORE HOURS</span>
            <span className="font-label-mono-sm text-label-mono-sm uppercase text-on-surface font-semibold">
              ALL DAYS: 11AM – 9:30PM
            </span>
          </div>
          <div>
            <span className="font-label-mono-sm text-[10px] uppercase text-outline block">CONCIERGE</span>
            <span className="font-label-mono-sm text-label-mono-sm uppercase text-on-surface font-semibold">
              +91 8657868181
            </span>
          </div>
        </div>

        {/* CTAs */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <a
            className="py-3 bg-surface-container-high hover:bg-surface-bright text-on-surface font-headline-sm text-headline-sm uppercase font-semibold text-center flex items-center justify-center gap-1.5 transition-colors"
            href="https://maps.google.com/?q=29+Chapel+Rd+Ranwar+Village+Bandra+West+Mumbai"
            rel="noopener noreferrer"
            target="_blank"
          >
            <span className="material-symbols-outlined text-[18px]">near_me</span>
            <span>DIRECTIONS</span>
          </a>
          <a
            className="py-3 bg-surface-container-high hover:bg-surface-bright text-on-surface font-headline-sm text-headline-sm uppercase font-semibold text-center flex items-center justify-center gap-1.5 transition-colors"
            href="tel:+918657868181"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            <span>CALL STORE</span>
          </a>
        </div>
      </div>
    </section>
  );
}
