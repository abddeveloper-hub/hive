# HIVE — Campus Chaos | Streetwear & Denim Flagship Storefront

An industrial, brutalist dark-aesthetic e-commerce storefront for **HIVE**, engineered with **Next.js 14 (App Router)**, **TypeScript**, and **Tailwind CSS**.

---

## ⚡ Complete Feature Architecture

### 1. 🛍️ Centralized Cart, Wishlist & Promo Engine
* **Slide-over Cart Drawer (`CartDrawer.tsx`)**: Real-time quantity manipulation, item deletion, and free shipping progress meter (unlocks above ₹1,999).
* **Promo Code Engine**: Test with `HIVE10` (10% off), `DROP20` (20% off on orders > ₹2,000), or `DIWALI15` (15% off). Automatically updates subtotal calculations.
* **Persistent Wishlist (`WishlistDrawer.tsx`)**: Toggle heart on any product card or spotlight item. Move saved items directly into the bag with 1 click. LocalStorage synced.

### 2. 🔍 Real-Time Search Modal (`SearchModal.tsx`)
* Instant live search filtering across the entire catalog by product title, fit (Bootcut, Straight, Baggy, Barrel), colorway, and fabric specifications.
* Quick-add directly from search results.

### 3. 📐 Interactive Size Guide & "Find My Fit" (`SizeGuideModal.tsx`)
* Interactive fit calculator: enter natural waist in inches, pick fit preference (Fitted, Regular, or Baggy) for instant size recommendation.
* Full technical measurement chart (waist, hip, inseam, leg opening) for sizes 28 through 38.
* Visual silhouette breakdown of Bootcut, Straight, Baggy, and Barrel cuts.

### 4. 👁️ Product Quick View Modal (`ProductQuickView.tsx`)
* Full lookbook modal with multi-angle image gallery, detailed fabric specs (e.g. *14.0 oz Japanese-grade selvedge, 3x1 twill, stone enzyme wash*), size selector, quantity modifier, and one-tap bag addition.

### 5. 💳 Indian Checkout System (`CheckoutModal.tsx`)
* Pan-India shipping address form (Name, Phone, Address, City, Pincode).
* Multi-payment selector:
  * **UPI (Instant)**: Google Pay, PhonePe, Paytm, BHIM.
  * **Cards / Netbanking**: Visa, Mastercard, RuPay.
  * **Cash on Delivery (COD)**.
  * **WhatsApp Concierge Checkout**: Pre-populates formatted order summary directly into WhatsApp chat with store concierge (+91 8657868181).
* Instant order receipt screen with unique Order ID and delivery tracking timeline.

### 6. ⭐ Verified Customer Reviews (`ReviewModal.tsx`)
* Live testimonials carousel.
* Interactive "Write a Review" dialog with star rating, fit impression (runs small, true to size, oversized), and immediate publication to the live reviews feed.

### 7. 📸 Community UGC Lookbook (`CommunityLookbook.tsx`)
* "Styled by the Community" (#HIVEARCHIVE) street style showcase shot across Mumbai (Bandra, Colaba, Worli) with 1-click "Shop Look" tags.

### 8. 📍 Bandra Flagship Store Experience (`FlagshipStore.tsx`)
* 29, Chapel Rd, Ranwar Village, Bandra West, Mumbai 400 050.
* Store hours (11AM - 9:30PM), direct Google Maps navigation link, and one-tap call hotline.

---

## 🛠 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS & PostCSS
- **State Management**: React Context (`useCart`) with persistent LocalStorage
- **Typography**: Space Grotesk, JetBrains Mono, Hanken Grotesk, Google Material Symbols

---

## 🚀 Local Development & Preview

```bash
# 1. Install dependencies
npm install

# 2. Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build
```bash
npm run build
npm run start
```

---

## 📄 License
MIT
