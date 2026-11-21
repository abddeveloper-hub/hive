'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { SIZE_CHART } from '@/data/products';

export default function SizeGuideModal() {
  const { isSizeGuideOpen, setIsSizeGuideOpen } = useCart();
  const [waistInput, setWaistInput] = useState<string>('32');
  const [fitPreference, setFitPreference] = useState<'fitted' | 'regular' | 'baggy'>('regular');

  if (!isSizeGuideOpen) return null;

  const calculateRecommendedSize = () => {
    const val = parseInt(waistInput, 10);
    if (isNaN(val)) return '32';
    let base = val % 2 === 0 ? val : val + 1;
    if (fitPreference === 'baggy') base += 2;
    if (fitPreference === 'fitted') base = Math.max(28, base - 2);
    return Math.min(38, Math.max(28, base)).toString();
  };

  const recommended = calculateRecommendedSize();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-pitch-black/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsSizeGuideOpen(false)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-2xl bg-surface border border-surface-container-high shadow-2xl z-10 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div>
            <span className="font-badge-caps text-badge-caps uppercase text-rust-leather tracking-widest font-bold">
              PRECISION FIT ARCHIVE
            </span>
            <h2 className="font-headline-sm text-lg uppercase font-bold text-on-surface">
              MEN&apos;S DENIM SIZE &amp; FIT GUIDE
            </h2>
          </div>
          <button
            aria-label="Close size guide"
            className="w-9 h-9 flex items-center justify-center text-outline hover:text-pure-white transition-colors"
            onClick={() => setIsSizeGuideOpen(false)}
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Interactive Calculator */}
          <div className="p-4 bg-surface-container-low border border-surface-container space-y-3">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[20px]">straighten</span>
              <h3 className="font-headline-sm text-sm uppercase font-bold text-on-surface">
                FIND YOUR PERFECT SIZE
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
              <div>
                <label className="font-label-mono-sm text-[11px] text-outline uppercase block mb-1">
                  Your Natural Waist (Inches)
                </label>
                <input
                  className="w-full bg-surface-container border border-surface-container-high p-2 text-pure-white font-label-mono-lg text-sm outline-none focus:border-primary"
                  max="42"
                  min="26"
                  onChange={(e) => setWaistInput(e.target.value)}
                  type="number"
                  value={waistInput}
                />
              </div>

              <div>
                <label className="font-label-mono-sm text-[11px] text-outline uppercase block mb-1">
                  How do you prefer it to fit?
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {(['fitted', 'regular', 'baggy'] as const).map((pref) => (
                    <button
                      key={pref}
                      className={`py-2 text-[11px] font-label-mono-sm uppercase border transition-colors ${
                        fitPreference === pref
                          ? 'bg-primary text-pitch-black font-bold border-primary'
                          : 'bg-surface-container text-on-surface border-surface-container-high hover:border-outline'
                      }`}
                      onClick={() => setFitPreference(pref)}
                      type="button"
                    >
                      {pref}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Recommendation Result */}
            <div className="mt-2 p-3 bg-rust-leather/20 border border-rust-leather/50 flex items-center justify-between">
              <div>
                <span className="font-label-mono-sm text-[10px] text-outline uppercase block">
                  RECOMMENDED SIZE
                </span>
                <span className="font-display-hero-mobile text-2xl font-bold text-pure-white">
                  WAIST {recommended}
                </span>
              </div>
              <p className="font-label-mono-sm text-xs text-on-surface/90 max-w-[200px] text-right">
                {fitPreference === 'baggy'
                  ? 'Sized up +2" for deep skate drape pooling over sneakers.'
                  : fitPreference === 'fitted'
                  ? 'Clean tailored waist with snug hip contour.'
                  : 'True-to-size classic streetwear drape.'}
              </p>
            </div>
          </div>

          {/* Measurements Table */}
          <div className="space-y-2">
            <h3 className="font-headline-sm text-sm uppercase font-bold text-on-surface">
              GARMENT SPECIFICATIONS (INCHES)
            </h3>
            <div className="overflow-x-auto border border-surface-container">
              <table className="w-full text-left font-label-mono-sm text-xs">
                <thead className="bg-surface-container text-outline uppercase border-b border-surface-container-high">
                  <tr>
                    <th className="p-2.5">Size</th>
                    <th className="p-2.5">Waist Range</th>
                    <th className="p-2.5">Hip</th>
                    <th className="p-2.5">Inseam</th>
                    <th className="p-2.5">Leg Opening</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-surface-container text-on-surface">
                  {SIZE_CHART.map((row) => (
                    <tr
                      key={row.size}
                      className={row.size === recommended ? 'bg-primary/10 text-pure-white font-bold' : ''}
                    >
                      <td className="p-2.5 font-bold text-primary">{row.size}</td>
                      <td className="p-2.5">{row.waist}</td>
                      <td className="p-2.5">{row.hip}</td>
                      <td className="p-2.5">{row.inseam}</td>
                      <td className="p-2.5">{row.legOpening}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Silhouette Breakdown */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1 font-label-mono-sm text-xs">
            <div className="p-2.5 bg-surface-container border border-surface-container-high">
              <span className="font-bold text-pure-white block uppercase">BOOTCUT</span>
              <p className="text-[10px] text-outline mt-1">Slim knee that flares 2.5&quot; below to stack over heavy footwear.</p>
            </div>
            <div className="p-2.5 bg-surface-container border border-surface-container-high">
              <span className="font-bold text-pure-white block uppercase">STRAIGHT</span>
              <p className="text-[10px] text-outline mt-1">Parallel geometry from hip to ankle. Timeless 90s silhouette.</p>
            </div>
            <div className="p-2.5 bg-surface-container border border-surface-container-high">
              <span className="font-bold text-pure-white block uppercase">BAGGY</span>
              <p className="text-[10px] text-outline mt-1">Roomy thigh &amp; wide leg opening. Maximalist street volume.</p>
            </div>
            <div className="p-2.5 bg-surface-container border border-surface-container-high">
              <span className="font-bold text-pure-white block uppercase">BARREL</span>
              <p className="text-[10px] text-outline mt-1">Curved outer dart creates distinct horseshoe architectural curve.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
