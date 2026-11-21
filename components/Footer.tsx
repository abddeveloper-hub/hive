import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full pt-12 px-4 flex flex-col space-y-6">
      {/* Guarantees */}
      <div className="grid grid-cols-2 gap-3 py-4 bg-surface-container-low p-4">
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-secondary text-[24px]">
            local_shipping
          </span>
          <div>
            <p className="font-headline-sm text-headline-sm uppercase text-on-surface">
              PAN INDIA
            </p>
            <p className="font-label-mono-sm text-[10px] text-outline uppercase">
              Free over ₹1,999
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <span className="material-symbols-outlined text-secondary text-[24px]">
            published_with_changes
          </span>
          <div>
            <p className="font-headline-sm text-headline-sm uppercase text-on-surface">
              7-DAY RETURNS
            </p>
            <p className="font-label-mono-sm text-[10px] text-outline uppercase">
              Hassle-free exchange
            </p>
          </div>
        </div>
      </div>

      {/* Navigation links & Copyright */}
      <div className="flex flex-col space-y-2 pt-2">
        <div className="flex flex-wrap gap-x-4 gap-y-2 font-label-mono-sm text-label-mono-sm text-outline uppercase">
          <a className="hover:text-primary transition-colors" href="#">
            Track Order
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Returns Portal
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Size Guide
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Privacy
          </a>
          <a className="hover:text-primary transition-colors" href="#">
            Terms
          </a>
        </div>
        <p className="font-label-mono-sm text-[10px] text-outline pt-2 uppercase">
          © {new Date().getFullYear()} HIVE CLOTHING CO. ALL RIGHTS RESERVED. BOMBAY, INDIA.
        </p>
      </div>
    </footer>
  );
}
