import React from 'react';

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-surface-container-lowest">
      <div className="relative w-full aspect-[4/5] max-h-[520px]">
        <img
          className="w-full h-full object-cover object-top opacity-85"
          data-alt="Editorial streetwear campaign lookbook shot of a confident young man in oversized vintage denim trousers and a structured boxy minimalist dark jacket against an industrial raw concrete Mumbai wall."
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuDirQroA1268KwtEQHni702QqK0BewgBfOGk6KcD_nwkoMVYjqQ8LY4SyN50aivlx7zmRQfLpgFgijky8ScdVE1Gi9Gmjfy3K1RGiZa06PWmHWbQNl7RVg9Pu4Ka6iR4ubUPsFRhVzwrYafFCp6wgGK4Dv-2Va0cHggMnDQt1DBT_R9M504n0AD6E5Zm6QuWXxjJ7smCHOC3zjqq28au7PMPQbpok29Xff4I1YfIXc"
          alt="HIVE Campus Chaos Campaign"
        />
        {/* Dramatic Atmospheric Vignette & Scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/40 to-transparent"></div>
        {/* Campaign Copy & Callout */}
        <div className="absolute inset-x-0 bottom-0 p-5 flex flex-col justify-end space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-rust-leather text-pure-white font-badge-caps text-badge-caps uppercase px-2 py-0.5 tracking-widest">
              DROP 09 LIVE
            </span>
            <span className="font-label-mono-sm text-label-mono-sm uppercase text-on-surface-variant tracking-wider">
              FW // 2025
            </span>
          </div>
          <div className="space-y-1">
            <h1 className="font-display-hero-mobile text-display-hero-mobile text-pure-white uppercase tracking-tight font-bold leading-none">
              CAMPUS CHAOS
            </h1>
            <p className="font-label-mono-sm text-label-mono-sm text-on-surface-variant uppercase tracking-wider">
              Denims, Cargos &amp; Streetwear — HIVE
            </p>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface/90 italic tracking-wide max-w-[280px]">
            “Made for men who’ve outgrown doubt.”
          </p>
          <div className="pt-1 flex gap-2">
            <a
              className="flex-1 bg-primary text-pitch-black font-headline-sm text-headline-sm uppercase py-3.5 px-4 text-center font-bold tracking-wider hover:bg-pure-white transition-all shadow-md active:scale-[0.98]"
              href="#denim-catalog"
            >
              EXPLORE NOW
            </a>
            <a
              className="flex-1 border border-pure-white/70 bg-pitch-black/40 text-pure-white font-headline-sm text-headline-sm uppercase py-3.5 px-4 text-center font-bold tracking-wider hover:bg-pure-white hover:text-pitch-black transition-all active:scale-[0.98]"
              href="/clearance"
            >
              CLEARANCE
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
