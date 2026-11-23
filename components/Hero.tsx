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

  // Canvas drawing function with unblocked framing
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

    // Source frame: 848x478 landscape. Subject (jeans) is vertically centered and occupies
    // from Y=20 to Y=470 (~94% height) and horizontal center X=375..500.
    const imgW = img.naturalWidth;
    const imgH = img.naturalHeight;
    const imgAspect = imgW / imgH;

    const isMobile = width < 768;
    // Scale product so it stays clearly framed with plenty of breathing room around it
    // On mobile, scale slightly smaller (68%) and position in upper-center (38% from top)
    // so the bottom 30% is completely clear for the compact callout cards!
    const targetH = isMobile ? height * 0.68 : height * 0.78;
    const targetW = targetH * imgAspect;

    const drawX = (width - targetW) / 2;
    const drawY = isMobile ? (height - targetH) * 0.38 : (height - targetH) / 2;

    // Draw frame
    ctx.drawImage(img, drawX, drawY, targetW, targetH);

    // Soft edge feathering so studio frame edges melt cleanly into #0e0e0e
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
      let translateY = -15;
      if (p <= 0.12) {
        opacity = 1;
        translateY = 0;
      } else if (p < 0.20) {
        const t = (p - 0.12) / 0.08;
        opacity = 1 - t;
        translateY = -18 * t;
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
      let translateY = 15;
      if (p >= 0.28 && p < 0.35) {
        const t = (p - 0.28) / 0.07;
        opacity = t;
        translateY = 16 * (1 - t);
      } else if (p >= 0.35 && p <= 0.48) {
        opacity = 1;
        translateY = 0;
      } else if (p > 0.48 && p <= 0.56) {
        const t = (p - 0.48) / 0.08;
        opacity = 1 - t;
        translateY = -16 * t;
      }
      spec1Ref.current.style.opacity = opacity.toFixed(3);
      spec1Ref.current.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
      spec1Ref.current.style.pointerEvents = opacity > 0.05 ? 'auto' : 'none';
    }

    // 3. Detail Callout 2 (Stitch & Precision Fit): active 0.60 to 0.86
    if (spec2Ref.current) {
      let opacity = 0;
      let translateY = 15;
      if (p >= 0.60 && p < 0.67) {
        const t = (p - 0.60) / 0.07;
        opacity = t;
        translateY = 16 * (1 - t);
      } else if (p >= 0.67 && p <= 0.79) {
        opacity = 1;
        translateY = 0;
      } else if (p > 0.79 && p <= 0.87) {
        const t = (p - 0.79) / 0.08;
        opacity = 1 - t;
        translateY = -16 * t;
      }
      spec2Ref.current.style.opacity = opacity.toFixed(3);
      spec2Ref.current.style.transform = `translate3d(0, ${translateY.toFixed(1)}px, 0)`;
      spec2Ref.current.style.pointerEvents = opacity > 0.05 ? 'auto' : 'none';
    }

    // 4. Final CTA: active 0.88 to 1.0
    if (ctaRef.current) {
      let opacity = 0;
      let translateY = 18;
      if (p >= 0.88 && p < 0.94) {
        const t = (p - 0.88) / 0.06;
        opacity = t;
        translateY = 18 * (1 - t);
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
        <div className="absolute inset-x-0 top-0 h-28 md:h-32 bg-gradient-to-b from-surface-dark via-surface-dark/60 to-transparent pointer-events-none z-10" />

        {/* Bottom Vignette Gradient for Seamless Section Handoff */}
        <div className="absolute inset-x-0 bottom-0 h-36 md:h-40 bg-gradient-to-t from-surface via-surface/75 to-transparent pointer-events-none z-10" />

        {/* =========================================================================
            REFINED CHOREOGRAPHED OVERLAYS (COMPACT & UNBLOCKING THE PRODUCT)
        ========================================================================= */}

        {/* 1. INTRO (0% – 20%): Compact Upper Placement */}
        <div
          ref={introRef}
          className="absolute inset-x-0 top-14 sm:top-16 md:top-20 flex flex-col items-center text-center px-4 z-20 pointer-events-none transition-transform will-change-transform"
        >
          <div className="inline-flex items-center gap-1.5 border border-outline-variant/40 bg-surface-container-lowest/80 backdrop-blur-md px-2.5 py-0.5 mb-2 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-rust-leather animate-pulse" />
            <span className="font-label-mono-sm text-[9px] md:text-[10px] uppercase text-on-surface tracking-[0.2em] font-medium">
              DROP 09 // 3D ROTATION
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-pure-white uppercase font-bold tracking-tight leading-tight drop-shadow-md">
            ENGINEERED DENIM
          </h1>

          <p className="mt-1 font-label-mono-sm text-[11px] md:text-xs text-on-surface-variant uppercase tracking-[0.14em]">
            14.5 OZ JAPANESE RAW SELVEDGE • 3D ARTICULATED FIT
          </p>
        </div>

        {/* Scroll Indicator (Fades out immediately upon first scroll) */}
        <div
          ref={scrollIndicatorRef}
          className="absolute inset-x-0 bottom-8 md:bottom-10 flex flex-col items-center justify-center gap-1.5 z-20 pointer-events-none transition-opacity duration-300"
        >
          <span className="font-label-mono-sm text-[9px] uppercase text-outline tracking-[0.25em]">
            SCROLL TO EXPLORE 360°
          </span>
          <div className="w-4 h-6 border border-outline-variant/60 rounded-full flex justify-center p-0.5">
            <div className="w-1 h-1.5 bg-primary rounded-full animate-bounce" />
          </div>
        </div>

        {/* 2. DETAIL CALLOUT 1 (30% – 55%): Fabric & Weight
            Desktop: Far-left flank, leaving the center jeans completely open!
            Mobile: Bottom-positioned compact pill card in the open negative space below the jeans! */}
        <div
          ref={spec1Ref}
          className="absolute inset-x-4 sm:inset-x-auto sm:left-6 md:left-10 lg:left-16 xl:left-20 bottom-10 sm:bottom-12 md:bottom-auto md:top-1/2 md:-translate-y-1/2 max-w-xs md:max-w-[290px] lg:max-w-[320px] mx-auto sm:mx-0 z-20 pointer-events-none opacity-0 transition-transform will-change-transform"
        >
          <div className="bg-surface-container-lowest/85 backdrop-blur-xl border border-outline-variant/40 p-4 md:p-5 shadow-2xl space-y-2.5">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-1.5">
              <span className="font-label-mono-sm text-[9px] uppercase text-rust-leather tracking-widest font-bold">
                SPEC 01 // TEXTURE
              </span>
              <span className="font-label-mono-sm text-[9px] uppercase text-outline tracking-wider">
                RAW SLUB
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm md:text-base text-pure-white uppercase font-bold tracking-wider">
                14.5 OZ VINTAGE SELVEDGE
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Toyoda shuttle loom milled in Kojima. Unsanforized deep rope-dyed indigo with textured slub character designed for high-contrast generational fades.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-outline-variant/20 text-[10px] font-label-mono-sm text-outline">
              <span className="bg-surface-container px-2 py-0.5 text-on-surface">3×1 RHT WEAVE</span>
              <span className="bg-surface-container px-2 py-0.5 text-on-surface">12-DIP INDIGO</span>
            </div>
          </div>
        </div>

        {/* 3. DETAIL CALLOUT 2 (65% – 85%): Stitch & Precision Fit
            Desktop: Far-right flank, leaving the center jeans completely open!
            Mobile: Bottom-positioned compact pill card in the open negative space below the jeans! */}
        <div
          ref={spec2Ref}
          className="absolute inset-x-4 sm:inset-x-auto sm:right-6 md:right-10 lg:right-16 xl:right-20 bottom-10 sm:bottom-12 md:bottom-auto md:top-1/2 md:-translate-y-1/2 max-w-xs md:max-w-[290px] lg:max-w-[320px] mx-auto sm:mx-0 z-20 pointer-events-none opacity-0 transition-transform will-change-transform"
        >
          <div className="bg-surface-container-lowest/85 backdrop-blur-xl border border-outline-variant/40 p-4 md:p-5 shadow-2xl space-y-2.5">
            <div className="flex items-center justify-between border-b border-outline-variant/30 pb-1.5">
              <span className="font-label-mono-sm text-[9px] uppercase text-rust-leather tracking-widest font-bold">
                SPEC 02 // ARCHITECTURE
              </span>
              <span className="font-label-mono-sm text-[9px] uppercase text-outline tracking-wider">
                3D CUT
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-sm md:text-base text-pure-white uppercase font-bold tracking-wider">
                ARTICULATED KNEE DARTING
              </h3>
              <p className="font-body-sm text-xs text-on-surface-variant leading-relaxed">
                Pre-shaped 3D ergonomics eliminate knee bunching while stacking effortlessly over boots. Reinforced with heavy-gauge Japanese chainstitching.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1 border-t border-outline-variant/20 text-[10px] font-label-mono-sm text-outline">
              <span className="bg-surface-container px-2 py-0.5 text-on-surface">RED SELVEDGE ID</span>
              <span className="bg-surface-container px-2 py-0.5 text-on-surface">STEEL HARDWARE</span>
            </div>
          </div>
        </div>

        {/* 4. FINAL CTA (90% – 100%): Positioned at the bottom (NOT in the center covering the pants!) */}
        <div
          ref={ctaRef}
          className="absolute inset-x-4 md:inset-x-auto md:left-1/2 md:-translate-x-1/2 bottom-8 md:bottom-10 md:w-full md:max-w-md z-20 pointer-events-none opacity-0 transition-transform will-change-transform"
        >
          <div className="bg-surface-container-lowest/90 backdrop-blur-2xl border border-pure-white/15 p-4 md:p-5 shadow-2xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="bg-rust-leather text-pure-white font-badge-caps text-[9px] uppercase px-2 py-0.5 tracking-widest font-bold">
                DROP 09 // READY TO SHIP
              </span>
              <span className="text-[10px] font-label-mono-sm text-outline uppercase tracking-wider">
                ● 14 pairs left
              </span>
            </div>

            <div className="flex items-baseline justify-between">
              <div>
                <h2 className="text-base md:text-lg text-pure-white uppercase font-bold tracking-tight">
                  VINTAGE BOOTCUT // RAW
                </h2>
                <p className="font-label-mono-sm text-[10px] text-on-surface-variant uppercase tracking-wider">
                  14.5 OZ JAPANESE SELVEDGE
                </p>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-lg md:text-xl font-bold font-label-mono text-pure-white">
                  ₹1,199
                </span>
                <span className="text-xs line-through text-outline font-label-mono">
                  ₹1,499
                </span>
              </div>
            </div>

            <div className="pt-1 flex gap-2 pointer-events-auto">
              <button
                type="button"
                onClick={handleShopNow}
                className="flex-1 bg-primary text-pitch-black font-headline-sm text-xs uppercase py-2.5 px-4 font-bold tracking-wider hover:bg-pure-white hover:shadow-[0_0_15px_rgba(255,255,255,0.25)] transition-all active:scale-[0.98]"
              >
                QUICK VIEW
              </button>
              <button
                type="button"
                onClick={scrollToExplore}
                className="flex-1 border border-pure-white/30 bg-pitch-black/40 text-pure-white font-headline-sm text-xs uppercase py-2.5 px-3 font-bold tracking-wider hover:bg-pure-white/10 transition-all active:scale-[0.98]"
              >
                EXPLORE ALL ↓
              </button>
            </div>
          </div>
        </div>

        {/* Minimal HUD Scrub & Angle Tracker */}
        <div
          ref={hudRef}
          className="absolute right-4 md:right-8 top-20 md:top-24 flex flex-col items-end gap-1 pointer-events-none z-20"
        >
          <div className="flex items-center gap-1.5 font-label-mono-sm text-[9px] md:text-[10px] text-outline tracking-widest">
            <span className="text-on-surface font-semibold" ref={hudAngleRef}>0°</span>
            <span className="text-outline-variant">|</span>
            <span>FRAME</span>
            <span className="text-pure-white font-mono" ref={hudFrameRef}>001</span>
            <span className="text-outline-variant">/ {TOTAL_FRAMES}</span>
          </div>
          <div className="w-20 md:w-28 h-[2px] bg-outline-variant/30 overflow-hidden relative">
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
