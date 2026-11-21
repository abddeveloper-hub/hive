'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    updateQuantity,
    removeFromCart,
    cartTotal,
    cartSubtotal,
    cartDiscount,
    cartCount,
    appliedPromo,
    applyPromo,
    removePromo,
    setIsCheckoutOpen,
    clearCart,
  } = useCart();

  const [promoInput, setPromoInput] = useState('');
  const [promoMessage, setPromoMessage] = useState<{ error?: string; success?: string } | null>(null);

  if (!isCartOpen) return null;

  const freeShippingThreshold = 1999;
  const isFreeShipping = cartTotal >= freeShippingThreshold;
  const amountNeeded = freeShippingThreshold - cartTotal;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promoInput.trim()) return;

    const res = applyPromo(promoInput);
    if (res.success) {
      setPromoMessage({ success: res.message });
      setPromoInput('');
    } else {
      setPromoMessage({ error: res.message });
    }

    setTimeout(() => {
      setPromoMessage(null);
    }, 4000);
  };

  const handleOpenCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleWhatsAppCheckout = () => {
    const orderLines = cart.map(
      (item) => `• ${item.name} (Size: ${item.size}) x${item.quantity} - ₹${item.price * item.quantity}`
    );
    const orderText = `Hi HIVE team! I'd like to place an order from the website:\n\n${orderLines.join(
      '\n'
    )}\n\nSubtotal: ₹${cartSubtotal.toLocaleString('en-IN')}${
      cartDiscount > 0 ? `\nDiscount (${appliedPromo?.code}): -₹${cartDiscount.toLocaleString('en-IN')}` : ''
    }\n*Total Payable: ₹${cartTotal.toLocaleString('en-IN')}*\nShipping: ${
      isFreeShipping ? 'FREE' : '₹99'
    }`;
    const encoded = encodeURIComponent(orderText);
    window.open(`https://wa.me/918657868181?text=${encoded}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-pitch-black/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer content */}
      <aside className="relative w-full max-w-md bg-surface border-l border-surface-container-high h-full flex flex-col z-10 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[22px]">shopping_bag</span>
            <h2 className="font-headline-sm text-headline-sm uppercase font-bold text-on-surface">
              BAG ({cartCount})
            </h2>
          </div>
          <button
            aria-label="Close cart"
            className="w-9 h-9 flex items-center justify-center text-outline hover:text-pure-white transition-colors"
            onClick={() => setIsCartOpen(false)}
            type="button"
          >
            <span className="material-symbols-outlined text-[24px]">close</span>
          </button>
        </div>

        {/* Free Shipping Meter */}
        <div className="bg-surface-container px-4 py-2.5 border-b border-surface-container-high">
          {isFreeShipping ? (
            <p className="font-label-mono-sm text-[11px] text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">check_circle</span>
              Unlocked Free Pan-India Express Shipping!
            </p>
          ) : (
            <div>
              <p className="font-label-mono-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                Add <span className="text-pure-white font-bold">₹{amountNeeded.toLocaleString('en-IN')}</span> more for Free Shipping
              </p>
              <div className="w-full bg-surface-container-highest h-1.5 mt-1.5 overflow-hidden">
                <div
                  className="bg-rust-leather h-full transition-all duration-300"
                  style={{ width: `${Math.min(100, (cartTotal / freeShippingThreshold) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-3 p-6">
              <span className="material-symbols-outlined text-[48px] text-outline">shopping_bag</span>
              <p className="font-headline-sm text-headline-sm uppercase text-on-surface">Your bag is empty</p>
              <p className="font-label-mono-sm text-label-mono-sm text-outline">
                Explore our FW // 2025 archival drops and add pieces to your bag.
              </p>
              <button
                className="mt-2 px-6 py-2.5 bg-primary text-pitch-black font-label-mono-lg uppercase font-bold hover:bg-pure-white transition-colors"
                onClick={() => setIsCartOpen(false)}
                type="button"
              >
                START BROWSING
              </button>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="flex gap-3 bg-surface-container-low p-3 border border-surface-container"
              >
                <div className="w-16 h-20 bg-surface-container flex-shrink-0 overflow-hidden">
                  <img
                    alt={item.name}
                    className="w-full h-full object-cover"
                    src={item.image}
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h4 className="font-headline-sm text-sm uppercase font-semibold text-on-surface line-clamp-1">
                        {item.name}
                      </h4>
                      <button
                        aria-label="Remove item"
                        className="text-outline hover:text-error transition-colors"
                        onClick={() => removeFromCart(item.id)}
                        type="button"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="bg-surface-container-high px-1.5 py-0.5 font-label-mono-sm text-[10px] uppercase text-outline">
                        Size: {item.size}
                      </span>
                      {item.colorway && (
                        <span className="font-label-mono-sm text-[10px] text-outline truncate">
                          {item.colorway}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    {/* Qty Modifier */}
                    <div className="flex items-center bg-surface-container-high px-2 py-0.5 justify-between w-20">
                      <button
                        className="text-on-surface hover:text-pure-white"
                        onClick={() => updateQuantity(item.id, -1)}
                        type="button"
                      >
                        -
                      </button>
                      <span className="font-label-mono-sm text-xs font-bold text-on-surface">
                        {item.quantity}
                      </span>
                      <button
                        className="text-on-surface hover:text-pure-white"
                        onClick={() => updateQuantity(item.id, 1)}
                        type="button"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-baseline gap-1.5">
                      <span className="font-label-mono-lg text-sm font-bold text-pure-white">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Promo Code Input & Summary */}
        {cart.length > 0 && (
          <div className="p-4 bg-surface-container-low border-t border-surface-container space-y-3">
            {/* Promo code form */}
            <form className="space-y-1.5" onSubmit={handleApplyPromo}>
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-surface-container border border-surface-container-high px-3 py-2 text-pure-white font-label-mono-sm text-xs uppercase outline-none focus:border-primary placeholder:text-outline"
                  onChange={(e) => setPromoInput(e.target.value)}
                  placeholder="Promo Code (HIVE10, DROP20)"
                  type="text"
                  value={promoInput}
                />
                <button
                  className="px-4 py-2 bg-surface-container-high hover:bg-surface-bright text-on-surface font-label-mono-sm text-xs uppercase font-semibold transition-colors"
                  type="submit"
                >
                  Apply
                </button>
              </div>

              {appliedPromo && (
                <div className="flex items-center justify-between text-[11px] font-label-mono-sm text-secondary">
                  <span>✓ {appliedPromo.code} active ({appliedPromo.discountPercent}% OFF)</span>
                  <button
                    className="underline hover:text-error"
                    onClick={removePromo}
                    type="button"
                  >
                    Remove
                  </button>
                </div>
              )}

              {promoMessage?.success && (
                <p className="text-[11px] font-label-mono-sm text-emerald-400">
                  {promoMessage.success}
                </p>
              )}
              {promoMessage?.error && (
                <p className="text-[11px] font-label-mono-sm text-error">
                  {promoMessage.error}
                </p>
              )}
            </form>

            {/* Calculations breakdown */}
            <div className="space-y-1.5 font-label-mono-sm text-xs uppercase pt-1">
              <div className="flex justify-between text-outline">
                <span>Subtotal</span>
                <span className="text-on-surface font-semibold">
                  ₹{cartSubtotal.toLocaleString('en-IN')}
                </span>
              </div>
              {cartDiscount > 0 && (
                <div className="flex justify-between text-secondary">
                  <span>Discount ({appliedPromo?.code})</span>
                  <span>-₹{cartDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between text-outline">
                <span>Pan-India Delivery</span>
                <span className={isFreeShipping ? 'text-emerald-400 font-bold' : 'text-on-surface font-semibold'}>
                  {isFreeShipping ? 'FREE' : '₹99'}
                </span>
              </div>
              <div className="pt-2 border-t border-surface-container flex justify-between font-label-mono-lg text-sm font-bold text-pure-white">
                <span>Estimated Total</span>
                <span>
                  ₹{(cartTotal + (isFreeShipping ? 0 : 99)).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2 pt-1">
              <button
                className="w-full py-3.5 bg-primary hover:bg-pure-white text-pitch-black font-headline-sm text-headline-sm uppercase font-bold tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] transition-all"
                onClick={handleOpenCheckout}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">lock</span>
                <span>SECURE CHECKOUT</span>
              </button>

              <button
                className="w-full py-2.5 bg-surface-container-high hover:bg-surface-bright text-on-surface font-headline-sm text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-colors"
                onClick={handleWhatsAppCheckout}
                type="button"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                <span>ORDER VIA WHATSAPP (INSTANT)</span>
              </button>

              <button
                className="w-full py-1 text-center font-label-mono-sm text-[10px] text-outline uppercase hover:text-on-surface transition-colors"
                onClick={clearCart}
                type="button"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
