'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { DENIM_PRODUCTS } from '@/data/products';

const TOTAL_FRAMES = 300;
const LERP_FACTOR = 0.1;
const TILT_LERP_FACTOR = 0.08;
const MAX_TILT_DEG = 3;

export default function Hero() {
  const { setQuickViewProduct } = useCart();

  // Root & Viewport Refs
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Overlay Refs for 60fps direct RAF transforms
  const introRef = useRef<HTMLDivElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const spec1Ref = useRef<HTMLDivElement>(null);
  const spec2Ref = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const hudRef = useRef<HTMLDivElement>(null);
  const hudAngleRef = useRef<HTMLSpanElement>(null);
  const hudFrameRef = useRef<HTMLSpanElement>(null);
  const hudProgressLineRef = useRef<HTMLDivElement>(null);

  // Preloading State
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadedCount, setLoadedCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoaderRemoved, setIsLoaderRemoved] = useState(false);

  // Frame Cache & Interpolation Values
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const isLoadedRef = useRef(false);
  const targetProgressRef = useRef(0);
  const currentFrameRef = useRef(0);
  const lastDrawnFrameRef = useRef(-1);
  const dprRef = useRef(1);

  // Mouse tilt tracking
  const mouseRef = useRef({
    targetTiltX: 0,
    targetTiltY: 0,
    currentTiltX: 0,
    currentTiltY: 0,
  });

  const rafIdRef = useRef<number | null>(null);

  // Scroll to catalog handler
  const scrollToExplore = () => {
    const el = document.getElementById('denim-catalog');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Open Quick View Modal for flagship denim
  const handleShopNow = () => {
    if (DENIM_PRODUCTS && DENIM_PRODUCTS.length > 0) {
      setQuickViewProduct(DENIM_PRODUCTS[0]);
    } else {
      scrollToExplore();
    }
  };

  // Canvas drawing function
  const renderCanvas = useCallback((frameIdx: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const images = imagesRef.current;
    const img = images[frameIdx] || images[0];
    if (!img || !img.complete || img.naturalWidth === 0) return;

    const dpr = dprRef.current;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    // Reset transform & scale to dpr
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Dark backdrop fill
    ctx.fillStyle = '#0e0e0e';
    ctx.fillRect(0, 0, width, height);

    // Containment calculations:
    // Source frame: 848x478 landscape. Subject (jeans) is vertically centered and occupies
    // from Y=20 to Y=470 (~94% height) and horizontal center X=375..500.
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const imgAspect = imgW / imgH;

    const isMobile = width < 768;
    // Scale to fit height nicely with generous breathing room
    const targetH = isMobile ? height * 0.82 : height * 0.86;
    const targetW = targetH * imgAspect;

    const drawX = (width - targetW) / 2;
    const drawY = (height - targetH) / 2;

    // Draw frame
    ctx.drawImage(img, drawX, drawY, targetW, targetH);

    // Smooth soft edge feathering so studio frame edges melt cleanly into #0e0e0e
    const hFade = Math.min(140, targetW * 0.16);
    const vFade = Math.min(100, targetH * 0.14);

    // Left edge fade
    const leftGrad = ctx.createLinearGradient(drawX, 0, drawX + hFade, 0);
    leftGrad.addColorStop(0, '#0e0e0e');
    leftGrad.addColorStop(1, 'rgba(14, 14, 14, 0)');
    ctx.fillStyle = leftGrad;
    ctx.fillRect(drawX - 2, drawY - 2, hFade + 2, targetH + 4);

    // Right edge fade
    const rightGrad = ctx.createLinearGradient(drawX + targetW, 0, drawX + targetW - hFade, 0);
    rightGrad.addColorStop(0, '#0e0e0e');
    rightGrad.addColorStop(1, 'rgba(14, 14, 14, 0)');
    ctx.fillStyle = rightGrad;
    ctx.fillRect(drawX + targetW - hFade, drawY - 2, hFade + 2, targetH + 4);

    // Top edge fade
    const topGrad = ctx.createLinearGradient(0, drawY, 0, drawY + vFade);
    topGrad.addColorStop(0, '#0e0e0e');
    topGrad.addColorStop(1, 'rgba(14, 14, 14, 0)');
    ctx.fillStyle = topGrad;
    ctx.fillRect(drawX - 2, drawY - 2, targetW + 4, vFade + 2);

    // Bottom edge fade
    const bottomGrad = ctx.createLinearGradient(0, drawY + targetH, 0, drawY + targetH - vFade);
    bottomGrad.addColorStop(0, '#0e0e0e');
    bottomGrad.addColorStop(1, 'rgba(14, 14, 14, 0)');
    ctx.fillStyle = bottomGrad;
    ctx.fillRect(drawX - 2, drawY + targetH - vFade, targetW + 4, vFade + 2);

    // Studio spotlight vignette overlay
    const maxDim = Math.max(width, height);
    const minDim = Math.min(width, height);
    const vignette = ctx.createRadialGradient(
      width / 2, height / 2, minDim * 0.35,
      width / 2, height / 2, maxDim * 0.72
    );
    vignette.addColorStop(0, 'rgba(14, 14, 14, 0)');
    vignette.addColorStop(0.65, 'rgba(14, 14, 14, 0.22)');
    vignette.addColorStop(0.88, 'rgba(14, 14, 14, 0.75)');
    vignette.addColorStop(1, 'rgba(14, 14, 14, 0.98)');
    ctx.fillStyle = vignette;
    ctx.fillRect(0, 0, width, height);

    lastDrawnFrameRef.current = frameIdx;
  }, []);

  // Window resize handler
  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    const viewport = viewportRef.current;
    if (!canvas || !viewport) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    dprRef.current = dpr;

    const w = viewport.clientWidth;
    const h = viewport.clientHeight;

    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    if (isLoadedRef.current) {
      renderCanvas(Math.round(currentFrameRef.current));
    }
  }, [renderCanvas]);

  // Preload all 300 sequential JPG frames
  useEffect(() => {
    let isMounted = true;
    let count = 0;
    const images: HTMLImageElement[] = [];

    const handleFrameComplete = () => {
      if (!isMounted) return;
      count++;
      setLoadedCount(count);
      const pct = Math.floor((count / TOTAL_FRAMES) * 100);
      setLoadProgress(pct);

      if (count >= TOTAL_FRAMES) {
        isLoadedRef.current = true;
        setIsLoaded(true);

        // Immediately paint initial frame
        setTimeout(() => {
          if (isMounted) {
            handleResize();
            renderCanvas(0);
          }
        }, 50);

        // Remove preloader screen after graceful fade
        setTimeout(() => {
          if (isMounted) {
            setIsLoaderRemoved(true);
          }
        }, 650);
      }
    };

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const pad = String(i).padStart(3, '0');
      const img = new Image();
      // Primary Next.js static asset path
      img.src = `/frames/ezgif-frame-${pad}.jpg`;
      img.onload = handleFrameComplete;
      img.onerror = () => {
        // Fallback to relative public path
        img.src = `public/frames/ezgif-frame-${pad}.jpg`;
        img.onload = handleFrameComplete;
        img.onerror = handleFrameComplete;
      };
      images.push(img);
    }
    imagesRef.current = images;

    // Safety timeout: ensure hero reveals even on connection interruptions
    const safetyTimer = setTimeout(() => {
      if (isMounted && !isLoadedRef.current) {
        isLoadedRef.current = true;
        setIsLoaded(true);
        handleResize();
        renderCanvas(0);
        setTimeout(() => {
          if (isMounted) setIsLoaderRemoved(true);
        }, 650);
      }
    }, 4500);

    return () => {
      isMounted = false;
      clearTimeout(safetyTimer);
    };
  }, [handleResize, renderCanvas]);

  // Update overlay styles directly via RAF for 60fps performance
  const updateOverlays = (p: number) => {
    // 1. Intro overlay: active 0.0 to 0.20
    if (introRef.current) {
      let opacity = 0;
      let translateY = -20;
      if (p <= 0.12) {
        opacity = 1;
        translateY = 0;
      } else if (p < 0.20) {
        const t = (p - 0.12) / 0.08;
        opacity = 1 - t;
        translateY = -24 * t;
      }
      introRef.current.style.opacity = opacity.toFixed(3);
      introRef.current.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
      introRef.current.style.pointerEvents = opacity > 0.05 ? 'auto' : 'none';
    }

    // Scroll to explore indicator: fades out rapidly (0 to 0.04)
    if (scrollIndicatorRef.current) {
      let opacity = 0;
      if (p <= 0.01) {
        opacity = 1;
      } else if (p < 0.05) {
        opacity = 1 - (p - 0.01) / 0.04;
      }
      scrollIndicatorRef.current.style.opacity = opacity.toFixed(3);
      scrollIndicatorRef.current.style.pointerEvents = opacity > 0.05 ? 'auto' : 'none';
    }

    // 2. Detail Callout 1 (Fabric & Weight): active 0.28 to 0.55
    if (spec1Ref.current) {
      let opacity = 0;
      let translateY = 20;
      if (p >= 0.28 && p < 0.35) {
        const t = (p - 0.28) / 0.07;
        opacity = t;
        translateY = 24 * (1 - t);
      } else if (p >= 0.35 && p <= 0.48) {
        opacity = 1;
        translateY = 0;
      } else if (p > 0.48 && p <= 0.56) {
        const t = (p - 0.48) / 0.08;
        opacity = 1 - t;
        translateY = -24 * t;
      }
      spec1Ref.current.style.opacity = opacity.toFixed(3);
      spec1Ref.current.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
      spec1Ref.current.style.pointerEvents = opacity > 0.05 ? 'auto' : 'none';
    }

    // 3. Detail Callout 2 (Stitch & Precision Fit): active 0.60 to 0.86
    if (spec2Ref.current) {
      let opacity = 0;
      let translateY = 20;
      if (p >= 0.60 && p < 0.67) {
        const t = (p - 0.60) / 0.07;
        opacity = t;
        translateY = 24 * (1 - t);
      } else if (p >= 0.67 && p <= 0.79) {
        opacity = 1;
        translateY = 0;
      } else if (p > 0.79 && p <= 0.87) {
        const t = (p - 0.79) / 0.08;
        opacity = 1 - t;
        translateY = -24 * t;
      }
      spec2Ref.current.style.opacity = opacity.toFixed(3);
      spec2Ref.current.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
      spec2Ref.current.style.pointerEvents = opacity > 0.05 ? 'auto' : 'none';
    }

    // 4. Final CTA: active 0.88 to 1.0
    if (ctaRef.current) {
      let opacity = 0;
      let translateY = 25;
      if (p >= 0.88 && p < 0.94) {
        const t = (p - 0.88) / 0.06;
        opacity = t;
        translateY = 24 * (1 - t);
      } else if (p >= 0.94) {
        opacity = 1;
        translateY = 0;
      }
      ctaRef.current.style.opacity = opacity.toFixed(3);
      ctaRef.current.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
      ctaRef.current.style.pointerEvents = opacity > 0.05 ? 'auto' : 'none';
    }

    // 5. Minimal HUD metadata
    if (hudAngleRef.current) {
      hudAngleRef.current.textContent = `${Math.round(p * 360)}°`;
    }
    if (hudFrameRef.current) {
      const f = Math.min(Math.round(currentFrameRef.current) + 1, TOTAL_FRAMES);
      hudFrameRef.current.textContent = `${String(f).padStart(3, '0')}`;
    }
    if (hudProgressLineRef.current) {
      hudProgressLineRef.current.style.width = `${Math.round(p * 100)}%`;
    }
  };

  // Scroll Progress Calculator
  const calculateScrollProgress = () => {
    if (!containerRef.current) return 0;
    const rect = containerRef.current.getBoundingClientRect();
    const totalScroll = containerRef.current.offsetHeight - window.innerHeight;
    if (totalScroll <= 0) return 0;
    const currentScroll = -rect.top;
    return Math.max(0, Math.min(1, currentScroll / totalScroll));
  };

  // Setup Scroll, Resize, Mouse Tilt, and RAF Scrubbing Loop
  useEffect(() => {
    const onScroll = () => {
      targetProgressRef.current = calculateScrollProgress();
    };

    const handleMouseMove = (e: MouseEvent) => {
      const halfW = window.innerWidth / 2;
      const halfH = window.innerHeight / 2;
      const normX = (e.clientX - halfW) / halfW;
      const normY = (e.clientY - halfH) / halfH;
      mouseRef.current.targetTiltY = Math.max(-MAX_TILT_DEG, Math.min(MAX_TILT_DEG, normX * MAX_TILT_DEG));
      mouseRef.current.targetTiltX = Math.max(-MAX_TILT_DEG, Math.min(MAX_TILT_DEG, -normY * MAX_TILT_DEG));
    };

    const handleMouseLeave = () => {
      mouseRef.current.targetTiltX = 0;
      mouseRef.current.targetTiltY = 0;
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave);

    handleResize();
    onScroll();

    let isRunning = true;

    const loop = () => {
      if (!isRunning) return;

      const targetProgress = targetProgressRef.current;
      const targetFrame = targetProgress * (TOTAL_FRAMES - 1);

      // Smooth linear interpolation for scroll scrub
      const prevFrame = currentFrameRef.current;
      currentFrameRef.current += (targetFrame - prevFrame) * LERP_FACTOR;

      const roundedFrame = Math.max(0, Math.min(TOTAL_FRAMES - 1, Math.round(currentFrameRef.current)));

      // Render only when frame index changes
      if (roundedFrame !== lastDrawnFrameRef.current && isLoadedRef.current) {
        renderCanvas(roundedFrame);
      }

      // Parallax 3D tilt & gentle scale (1.0 to 1.08)
      const mouse = mouseRef.current;
      mouse.currentTiltX += (mouse.targetTiltX - mouse.currentTiltX) * TILT_LERP_FACTOR;
      mouse.currentTiltY += (mouse.targetTiltY - mouse.currentTiltY) * TILT_LERP_FACTOR;

      const scale = 1.0 + (targetProgress * 0.08);

      if (canvasContainerRef.current) {
        canvasContainerRef.current.style.transform = `perspective(1000px) scale(${scale.toFixed(4)}) rotateX(${mouse.currentTiltX.toFixed(2)}deg) rotateY(${mouse.currentTiltY.toFixed(2)}deg)`;
      }

      // Update choreographic text overlays
      updateOverlays(targetProgress);

      rafIdRef.current = requestAnimationFrame(loop);
    };

    rafIdRef.current = requestAnimationFrame(loop);

    return () => {
      isRunning = false;
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [handleResize, renderCanvas]);

  return (
    <section
      ref={containerRef}
      id="hero-3d-track"
      className="relative w-full h-[350vh] md:h-[450vh] -mt-[calc(102px+env(safe-area-inset-top,0px))] bg-surface-dark select-none"
    >
      {/* Sticky Fullscreen Inner Viewport */}
      <div
        ref={viewportRef}
        className="sticky top-0 h-screen h-[100dvh] w-full overflow-hidden bg-surface-dark flex items-center justify-center"
      >
        {/* 3D Perspective Canvas Container */}
        <div
          ref={canvasContainerRef}
          className="relative w-full h-full flex items-center justify-center will-change-transform"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <canvas
            ref={canvasRef}
            className="w-full h-full pointer-events-none"
          />
        </div>

        {/* Top Vignette Gradient for Header Contrast */}
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-surface-dark via-surface-dark/70 to-transparent pointer-events-none z-10" />

        {/* Bottom Vignette Gradient for Seamless Section Handoff */}
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-surface via-surface/80 to-transparent pointer-events-none z-10" />

        {/* Left & Right Subtle Scrims for Ultra-Wide Displays */}
        <div className="hidden lg:block absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-surface-dark/80 to-transparent pointer-events-none z-10" />
        <div className="hidden lg:block absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-surface-dark/80 to-transparent pointer-events-none z-10" />

        {/* =========================================================================
            MILESTONE OVERLAYS
        ========================================================================= */}

        {/* 1. INTRO (0% – 20%): Editorial Headline & Scroll Invitation */}
        <div
          ref={introRef}
          className="absolute inset-x-0 top-[18%] md:top-[20%] flex flex-col items-center text-center px-4 z-20 pointer-events-none transition-transform will-change-transform"
        >
          <div className="inline-flex items-center gap-2 border border-outline-variant/60 bg-surface-container-lowest/80 backdrop-blur-md px-3 py-1 mb-4 shadow-lg">
            <span className="w-1.5 h-1.5 rounded-full bg-rust-leather animate-pulse" />
            <span className="font-label-mono-sm text-[10px] md:text-xs uppercase text-on-surface tracking-[0.22em] font-semibold">
              DROP 09 // 3D ARCHIVE ROTATION
            </span>
          </div>

          <h1 className="font-display-hero-mobile md:text-7xl lg:text-8xl text-pure-white uppercase font-bold tracking-tight leading-none drop-shadow-2xl">
            ENGINEERED DENIM
          </h1>

          <p className="mt-3 md:mt-4 font-label-mono-sm text-xs md:text-sm text-on-surface-variant uppercase tracking-[0.18em] max-w-xl">
            14.5 OZ JAPANESE RAW SELVEDGE // ARTICULATED 3D ANATOMY
          </p>

          <div className="mt-4 hidden sm:flex items-center gap-3">
            <span className="font-label-mono-sm text-[10px] text-outline uppercase tracking-wider border-b border-outline-variant pb-0.5">
              100% RING-SPUN COTTON
            </span>
            <span className="text-outline">•</span>
            <span className="font-label-mono-sm text-[10px] text-outline uppercase tracking-wider border-b border-outline-variant pb-0.5">
              TOYODA SHUTTLE LOOM
            </span>
            <span className="text-outline">•</span>
            <span className="font-label-mono-sm text-[10px] text-outline uppercase tracking-wider border-b border-outline-variant pb-0.5">
              KOJIMA MILLS
            </span>
          </div>
        </div>

        {/* Scroll Indicator (Fades out immediately upon first scroll) */}
        <div
          ref={scrollIndicatorRef}
          className="absolute inset-x-0 bottom-12 md:bottom-14 flex flex-col items-center justify-center gap-2 z-20 pointer-events-none transition-opacity duration-300"
        >
          <span className="font-label-mono-sm text-[10px] uppercase text-outline tracking-[0.25em]">
            SCROLL TO EXPLORE 360°
          </span>
          <div className="w-5 h-8 border border-outline-variant rounded-full flex justify-center p-1">
            <div className="w-1 h-2 bg-primary rounded-full animate-bounce" />
          </div>
        </div>

        {/* 2. DETAIL CALLOUT 1 (30% – 55%): Fabric Weight & Texture (Left-Aligned) */}
        <div
          ref={spec1Ref}
          className="absolute left-4 md:left-12 lg:left-24 bottom-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 max-w-sm md:max-w-md z-20 pointer-events-none opacity-0 transition-transform will-change-transform"
        >
          <div className="bg-surface-container-lowest/90 backdrop-blur-xl border border-outline-variant/60 p-5 md:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
              <span className="font-label-mono-sm text-[10px] uppercase text-rust-leather tracking-widest font-bold">
                SPEC 01 // TEXTURE
              </span>
              <span className="font-label-mono-sm text-[10px] uppercase text-outline tracking-widest">
                RAW FINISH
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-headline-sm md:text-2xl text-pure-white uppercase font-bold tracking-wider">
                14.5 OZ VINTAGE SELVEDGE
              </h3>
              <p className="font-body-sm text-xs md:text-sm text-on-surface-variant leading-relaxed">
                Milled on vintage 1968 Toyoda low-tension shuttle looms in Kojima. Unsanforized, pure rope-dyed indigo warp with distinctive uneven slub yarn texture engineered for high-contrast generational fades.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-outline-variant/30 text-[11px] font-label-mono-sm">
              <div>
                <span className="text-outline uppercase block text-[9px]">WEAVE DENSITY</span>
                <span className="text-on-surface font-semibold">3×1 Right-Hand Twill</span>
              </div>
              <div>
                <span className="text-outline uppercase block text-[9px]">YARN COUNT</span>
                <span className="text-on-surface font-semibold">6.5s Ringspun Slub</span>
              </div>
              <div>
                <span className="text-outline uppercase block text-[9px]">DYE INVOCATION</span>
                <span className="text-on-surface font-semibold">12 Dip Pure Indigo</span>
              </div>
              <div>
                <span className="text-outline uppercase block text-[9px]">SELVEDGE ID</span>
                <span className="text-on-surface font-semibold">Classic Red Ticker</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3. DETAIL CALLOUT 2 (65% – 85%): Stitch & Fit Precision (Right-Aligned) */}
        <div
          ref={spec2Ref}
          className="absolute right-4 md:right-12 lg:right-24 bottom-24 md:bottom-auto md:top-1/2 md:-translate-y-1/2 max-w-sm md:max-w-md z-20 pointer-events-none opacity-0 transition-transform will-change-transform"
        >
          <div className="bg-surface-container-lowest/90 backdrop-blur-xl border border-outline-variant/60 p-5 md:p-7 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-outline-variant/40 pb-2">
              <span className="font-label-mono-sm text-[10px] uppercase text-rust-leather tracking-widest font-bold">
                SPEC 02 // ARCHITECTURE
              </span>
              <span className="font-label-mono-sm text-[10px] uppercase text-outline tracking-widest">
                ANATOMICAL CUT
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-headline-sm md:text-2xl text-pure-white uppercase font-bold tracking-wider">
                ARTICULATED KNEE DARTING
              </h3>
              <p className="font-body-sm text-xs md:text-sm text-on-surface-variant leading-relaxed">
                Pre-shaped 3D ergonomics prevent fabric bunching and tension points. Reinforced with heavy-gauge Japanese aramid poly-core thread, triple-needle flat-felled inseams, and custom matte gunmetal tack hardware.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-outline-variant/30 text-[11px] font-label-mono-sm">
              <div>
                <span className="text-outline uppercase block text-[9px]">OUTSEAM</span>
                <span className="text-on-surface font-semibold">Continuous Clean Fold</span>
              </div>
              <div>
                <span className="text-outline uppercase block text-[9px]">HARDWARE</span>
                <span className="text-on-surface font-semibold">Matte Black Steel Tacks</span>
              </div>
              <div>
                <span className="text-outline uppercase block text-[9px]">INSEAM FINISH</span>
                <span className="text-on-surface font-semibold">Triple Chainstitch</span>
              </div>
              <div>
                <span className="text-outline uppercase block text-[9px]">POCKET LINING</span>
                <span className="text-on-surface font-semibold">9 oz Cotton Herringbone</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. FINAL CTA (90% – 100%): Centered Product Card & Action */}
        <div
          ref={ctaRef}
          className="absolute inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 bottom-20 md:bottom-auto md:top-1/2 md:-translate-y-1/2 md:w-full md:max-w-lg z-20 pointer-events-none opacity-0 transition-transform will-change-transform"
        >
          <div className="bg-surface-container-lowest/95 backdrop-blur-2xl border border-pure-white/20 p-6 md:p-8 shadow-2xl text-center space-y-4">
            <div className="inline-flex items-center gap-2 bg-rust-leather text-pure-white font-badge-caps text-[10px] uppercase px-2.5 py-0.5 tracking-widest font-bold">
              BATCH 04 // LIMITED RUN
            </div>

            <div className="space-y-1">
              <h2 className="font-display-hero-mobile md:text-4xl text-pure-white uppercase font-bold tracking-tight">
                VINTAGE BOOTCUT // RAW
              </h2>
              <p className="font-label-mono-sm text-xs text-on-surface-variant uppercase tracking-wider">
                14.5 OZ RAW JAPANESE SELVEDGE DENIM
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 py-1">
              <span className="text-2xl md:text-3xl font-bold font-label-mono text-pure-white">
                ₹1,199
              </span>
              <span className="text-sm md:text-base line-through text-outline font-label-mono">
                ₹1,499
              </span>
              <span className="text-[11px] font-bold text-rust-leather bg-secondary-fixed/20 border border-rust-leather/40 px-2 py-0.5">
                20% OFF
              </span>
            </div>

            <p className="text-[11px] font-label-mono-sm text-outline uppercase tracking-wider">
              ● Only 14 pairs remaining in size 30–34
            </p>

            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={handleShopNow}
                className="flex-1 bg-primary text-pitch-black font-headline-sm text-xs md:text-sm uppercase py-3.5 px-6 font-bold tracking-wider hover:bg-pure-white hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all active:scale-[0.98]"
              >
                SHOP NOW — QUICK VIEW
              </button>
              <button
                type="button"
                onClick={scrollToExplore}
                className="flex-1 border border-pure-white/40 bg-pitch-black/40 text-pure-white font-headline-sm text-xs md:text-sm uppercase py-3.5 px-4 font-bold tracking-wider hover:bg-pure-white/10 transition-all active:scale-[0.98]"
              >
                EXPLORE ALL FITS ↓
              </button>
            </div>
          </div>
        </div>

        {/* Minimal HUD Scrub & Angle Tracker */}
        <div
          ref={hudRef}
          className="absolute right-4 md:right-8 top-28 md:top-32 flex flex-col items-end gap-1 pointer-events-none z-20"
        >
          <div className="flex items-center gap-2 font-label-mono-sm text-[10px] md:text-xs text-outline tracking-widest">
            <span className="text-on-surface font-semibold" ref={hudAngleRef}>0°</span>
            <span className="text-outline-variant">|</span>
            <span>FRAME</span>
            <span className="text-pure-white font-mono" ref={hudFrameRef}>001</span>
            <span className="text-outline-variant">/ {TOTAL_FRAMES}</span>
          </div>
          {/* Subtle Scrub Depth Track */}
          <div className="w-24 md:w-32 h-[2px] bg-outline-variant/30 overflow-hidden relative">
            <div
              ref={hudProgressLineRef}
              className="h-full bg-primary transition-all duration-75"
              style={{ width: '0%' }}
            />
          </div>
        </div>

        {/* =========================================================================
            SLEEK MINIMAL PRELOADER SCREEN (0% - 100%)
        ========================================================================= */}
        {!isLoaderRemoved && (
          <div
            className={`absolute inset-0 z-50 flex flex-col items-center justify-center bg-surface-dark transition-opacity duration-500 ease-out ${
              isLoaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
          >
            <div className="w-full max-w-xs px-6 flex flex-col items-center text-center space-y-4">
              <div className="flex items-center gap-2 text-outline">
                <span className="w-2 h-2 rounded-full bg-rust-leather animate-ping" />
                <span className="font-label-mono-sm text-[10px] uppercase tracking-[0.25em]">
                  INITIALIZING 3D ENGINE
                </span>
              </div>

              {/* Minimal Monospace Percentage Counter */}
              <div className="font-mono text-5xl md:text-6xl font-light text-pure-white tracking-tighter leading-none">
                {String(loadProgress).padStart(3, '0')}%
              </div>

              {/* Clean hairline progress bar */}
              <div className="w-full h-[2px] bg-outline-variant/30 overflow-hidden relative">
                <div
                  className="h-full bg-primary transition-all duration-100 ease-out"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>

              <div className="flex items-center justify-between w-full font-label-mono-sm text-[10px] text-outline uppercase tracking-widest pt-1">
                <span>DENIM ARCHIVE</span>
                <span>{loadedCount} / {TOTAL_FRAMES} FRAMES</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
