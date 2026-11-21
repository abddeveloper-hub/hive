# HIVE — Campus Chaos | Next.js Streetwear & Denim Storefront

A modern, scalable component-based e-commerce web application for **HIVE**, built with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## ⚡ Key Highlights & Architecture

- **Next.js 14 App Router**: Production-optimized static pre-rendering, automatic font optimization (`Space Grotesk`, `JetBrains Mono`, `Hanken Grotesk`), and lightning-fast client hydration.
- **Centralized Cart State (`CartContext`)**:
  - Global reactive cart counter and slide-over **Cart Drawer**.
  - LocalStorage persistence so customer bags persist across refreshes.
  - Interactive quantity modifiers, size selections, and item deletion.
  - Dynamic **Free Pan-India Shipping meter** (unlocks above ₹1,999).
  - Direct **WhatsApp Instant Order generator** pre-formatting items, sizes, quantities, and totals.
- **Component-Driven Modular Architecture**:
  - `components/Header.tsx` — Announcement ticker, brand logo, search/wishlist/bag indicators.
  - `components/Hero.tsx` — Editorial Campus Chaos lookbook hero banner.
  - `components/Ticker.tsx` — Brutalist marquee brand ticker.
  - `components/DenimCatalog.tsx` & `ProductCard.tsx` — Fit filter tabs (Bootcut, Straight, Baggy, Barrel) and reusable product cards.
  - `components/SpotlightDrop.tsx` — Item of the Day with interactive waist size selector and quantity counter.
  - `components/TopwearCatalog.tsx` — Categorized seasonal apparel (Shirts, Tees, Jackets).
  - `components/CuratedLook.tsx` — Curated multi-item ensemble with 10% bundle discount.
  - `components/FlagshipStore.tsx` — Bandra West (Mumbai) physical archive locator with direct Google Maps & phone concierge.
  - `components/CustomerReviews.tsx` — Real verified reviews carousel & Instagram portal.
  - `components/CartDrawer.tsx` — Slide-over bag drawer with live pricing and WhatsApp checkout.
  - `components/BottomNav.tsx` — Fixed mobile navigation.
- **Data-Driven Storefront (`data/products.ts`)**:
  - All denim styles, topwear items, lookbook ensembles, and customer reviews cleanly separated into typed data objects.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & PostCSS
- **State Management**: React Context (`useCart`)
- **Typography**: Space Grotesk, JetBrains Mono, Hanken Grotesk, Google Material Symbols

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Production Build
```bash
npm run build
npm run start
```

---

## 📄 License
MIT
