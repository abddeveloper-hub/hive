'use client';

import React from 'react';
import Hero from '@/components/Hero';
import Ticker from '@/components/Ticker';
import DenimCatalog from '@/components/DenimCatalog';
import SpotlightDrop from '@/components/SpotlightDrop';
import TopwearCatalog from '@/components/TopwearCatalog';
import CuratedLook from '@/components/CuratedLook';
import FlagshipStore from '@/components/FlagshipStore';
import CommunityLookbook from '@/components/CommunityLookbook';
import CustomerReviews from '@/components/CustomerReviews';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="flex flex-col w-full pb-8">
      {/* 1. CAMPAIGN HERO BANNER */}
      <Hero />

      {/* BRAND STATEMENT TICKER */}
      <Ticker />

      {/* 2. SHOP BY FIT (DENIMS) */}
      <DenimCatalog />

      {/* 3. ITEM OF THE DAY / SPOTLIGHT DROP */}
      <SpotlightDrop />

      {/* 4. STYLE CATEGORIES (TOPWEAR & JACKETS) */}
      <TopwearCatalog />

      {/* 5. SHOP THE LOOK (CURATED OUTFIT) */}
      <CuratedLook />

      {/* 6. OFFLINE FLAGSHIP STORE EXPERIENCE */}
      <FlagshipStore />

      {/* 7. COMMUNITY UGC LOOKBOOK ARCHIVE */}
      <CommunityLookbook />

      {/* 8. CUSTOMER VOICES & REVIEWS */}
      <CustomerReviews />

      {/* 9. REFINED FOOTER ATTRIBUTION & ASSURANCES */}
      <Footer />
    </div>
  );
}
