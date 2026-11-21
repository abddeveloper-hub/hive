'use client';

import React, { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { OrderDetails } from '@/types';

export default function CheckoutModal() {
  const {
    cart,
    cartTotal,
    cartSubtotal,
    cartDiscount,
    appliedPromo,
    isCheckoutOpen,
    setIsCheckoutOpen,
    clearCart,
    setLastOrder,
  } = useCart();

  const [formData, setFormData] = useState({
    name: 'Abdul Wahid',
    phone: '+91 98765 43210',
    email: 'abdul@example.com',
    address: '24, Sea Breeze Apts, Bandra West',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
  });

  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod' | 'whatsapp'>('upi');
  const [upiId, setUpiId] = useState('user@okhdfcbank');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedOrder, setConfirmedOrder] = useState<OrderDetails | null>(null);

  if (!isCheckoutOpen) return null;

  const isFreeShipping = cartTotal >= 1999;
  const shippingFee = isFreeShipping ? 0 : 99;
  const finalTotal = cartTotal + shippingFee;

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const order: OrderDetails = {
        orderId: `HIVE-${Math.floor(100000 + Math.random() * 900000)}`,
        customerName: formData.name,
        phone: formData.phone,
        email: formData.email,
        address: `${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}`,
        city: formData.city,
        pincode: formData.pincode,
        paymentMethod,
        items: [...cart],
        total: finalTotal,
        date: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        }),
      };

      if (paymentMethod === 'whatsapp') {
        const orderSummary = cart
          .map((i) => `• ${i.name} (${i.size}) x${i.quantity} = ₹${i.price * i.quantity}`)
          .join('\n');
        const text = encodeURIComponent(
          `*NEW STORE ORDER - ${order.orderId}*\n\nName: ${formData.name}\nPhone: ${formData.phone}\nAddress: ${order.address}\n\n*Items:*\n${orderSummary}\n\n*Total Payable: ₹${finalTotal.toLocaleString('en-IN')}* (${isFreeShipping ? 'FREE Shipping' : 'Incl ₹99 Shipping'})\nPayment: WhatsApp Order Confirmation`
        );
        window.open(`https://wa.me/918657868181?text=${text}`, '_blank');
      }

      setConfirmedOrder(order);
      setLastOrder(order);
      clearCart();
      setIsSubmitting(false);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-pitch-black/85 backdrop-blur-md transition-opacity"
        onClick={() => !isSubmitting && setIsCheckoutOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-surface border border-surface-container-high shadow-2xl z-10 flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-surface-container-low border-b border-surface-container flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary text-[22px]">lock</span>
            <h2 className="font-headline-sm text-base uppercase font-bold text-on-surface">
              {confirmedOrder ? 'ORDER CONFIRMED' : 'SECURE CHECKOUT'}
            </h2>
          </div>
          {!confirmedOrder && (
            <button
              aria-label="Close checkout"
              className="w-8 h-8 flex items-center justify-center text-outline hover:text-pure-white transition-colors"
              onClick={() => setIsCheckoutOpen(false)}
              type="button"
            >
              <span className="material-symbols-outlined text-[22px]">close</span>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {confirmedOrder ? (
            /* Order Success Screen */
            <div className="py-6 text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500 rounded-full flex items-center justify-center mx-auto text-emerald-400">
                <span className="material-symbols-outlined text-[36px]">check</span>
              </div>
              <div className="space-y-1">
                <span className="font-label-mono-sm text-xs text-outline uppercase tracking-wider">
                  Payment &amp; Verification Complete
                </span>
                <h3 className="font-headline-lg-mobile text-2xl uppercase font-bold text-pure-white">
                  Thank You, {confirmedOrder.customerName}!
                </h3>
                <p className="font-label-mono-lg text-sm text-secondary font-bold">
                  Order ID: #{confirmedOrder.orderId}
                </p>
              </div>

              <div className="bg-surface-container p-4 border border-surface-container-high text-left space-y-2 font-label-mono-sm text-xs">
                <div className="flex justify-between text-outline">
                  <span>Shipping To:</span>
                  <span className="text-on-surface text-right max-w-[240px] truncate">
                    {confirmedOrder.address}
                  </span>
                </div>
                <div className="flex justify-between text-outline">
                  <span>Method:</span>
                  <span className="text-pure-white font-bold uppercase">
                    {confirmedOrder.paymentMethod}
                  </span>
                </div>
                <div className="flex justify-between text-outline">
                  <span>Estimated Delivery:</span>
                  <span className="text-emerald-400 font-semibold">2 - 4 Business Days</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-surface-container-high font-bold text-sm text-pure-white">
                  <span>Total Amount Paid:</span>
                  <span>₹{confirmedOrder.total.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <p className="font-label-mono-sm text-xs text-outline">
                A confirmation SMS &amp; WhatsApp dispatch notification will be sent to {confirmedOrder.phone}.
              </p>

              <button
                className="w-full py-3.5 bg-primary text-pitch-black font-headline-sm uppercase font-bold hover:bg-pure-white transition-colors"
                onClick={() => {
                  setConfirmedOrder(null);
                  setIsCheckoutOpen(false);
                }}
                type="button"
              >
                RETURN TO STOREFRONT
              </button>
            </div>
          ) : (
            /* Checkout Form */
            <form className="space-y-4" onSubmit={handlePlaceOrder}>
              {/* Shipping Address */}
              <div className="space-y-2">
                <span className="font-label-mono-sm text-xs uppercase text-outline font-semibold block">
                  1. Shipping Information (Pan-India)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    required
                    className="col-span-2 bg-surface-container border border-surface-container-high p-2.5 text-pure-white font-label-mono-sm text-xs outline-none focus:border-primary"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Full Name"
                    type="text"
                    value={formData.name}
                  />
                  <input
                    required
                    className="bg-surface-container border border-surface-container-high p-2.5 text-pure-white font-label-mono-sm text-xs outline-none focus:border-primary"
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit Phone"
                    type="tel"
                    value={formData.phone}
                  />
                  <input
                    required
                    className="bg-surface-container border border-surface-container-high p-2.5 text-pure-white font-label-mono-sm text-xs outline-none focus:border-primary"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Email Address"
                    type="email"
                    value={formData.email}
                  />
                  <input
                    required
                    className="col-span-2 bg-surface-container border border-surface-container-high p-2.5 text-pure-white font-label-mono-sm text-xs outline-none focus:border-primary"
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Flat / Building / Street Address"
                    type="text"
                    value={formData.address}
                  />
                  <input
                    required
                    className="bg-surface-container border border-surface-container-high p-2.5 text-pure-white font-label-mono-sm text-xs outline-none focus:border-primary"
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="City (e.g. Mumbai)"
                    type="text"
                    value={formData.city}
                  />
                  <input
                    required
                    className="bg-surface-container border border-surface-container-high p-2.5 text-pure-white font-label-mono-sm text-xs outline-none focus:border-primary"
                    onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    placeholder="PIN Code"
                    type="text"
                    value={formData.pincode}
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div className="space-y-2 pt-2 border-t border-surface-container">
                <span className="font-label-mono-sm text-xs uppercase text-outline font-semibold block">
                  2. Select Payment Option
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    className={`p-3 text-left border flex flex-col justify-between transition-colors ${
                      paymentMethod === 'upi'
                        ? 'border-primary bg-primary/10 text-pure-white'
                        : 'border-surface-container-high bg-surface-container text-on-surface hover:border-outline'
                    }`}
                    onClick={() => setPaymentMethod('upi')}
                    type="button"
                  >
                    <span className="font-label-mono-sm text-xs font-bold uppercase">UPI (Instant)</span>
                    <span className="font-label-mono-sm text-[10px] text-outline">GPay / PhonePe / Paytm</span>
                  </button>

                  <button
                    className={`p-3 text-left border flex flex-col justify-between transition-colors ${
                      paymentMethod === 'card'
                        ? 'border-primary bg-primary/10 text-pure-white'
                        : 'border-surface-container-high bg-surface-container text-on-surface hover:border-outline'
                    }`}
                    onClick={() => setPaymentMethod('card')}
                    type="button"
                  >
                    <span className="font-label-mono-sm text-xs font-bold uppercase">Cards / Netbanking</span>
                    <span className="font-label-mono-sm text-[10px] text-outline">Visa, Mastercard, RuPay</span>
                  </button>

                  <button
                    className={`p-3 text-left border flex flex-col justify-between transition-colors ${
                      paymentMethod === 'cod'
                        ? 'border-primary bg-primary/10 text-pure-white'
                        : 'border-surface-container-high bg-surface-container text-on-surface hover:border-outline'
                    }`}
                    onClick={() => setPaymentMethod('cod')}
                    type="button"
                  >
                    <span className="font-label-mono-sm text-xs font-bold uppercase">Cash on Delivery</span>
                    <span className="font-label-mono-sm text-[10px] text-outline">Pay at your doorstep</span>
                  </button>

                  <button
                    className={`p-3 text-left border flex flex-col justify-between transition-colors ${
                      paymentMethod === 'whatsapp'
                        ? 'border-primary bg-primary/10 text-pure-white'
                        : 'border-surface-container-high bg-surface-container text-on-surface hover:border-outline'
                    }`}
                    onClick={() => setPaymentMethod('whatsapp')}
                    type="button"
                  >
                    <span className="font-label-mono-sm text-xs font-bold uppercase">WhatsApp Order</span>
                    <span className="font-label-mono-sm text-[10px] text-outline">Direct concierge chat</span>
                  </button>
                </div>

                {paymentMethod === 'upi' && (
                  <div className="p-3 bg-surface-container border border-surface-container-high space-y-2">
                    <label className="font-label-mono-sm text-[11px] text-outline uppercase block">
                      Enter UPI VPA ID
                    </label>
                    <input
                      className="w-full bg-surface border border-surface-container-high p-2 text-pure-white font-label-mono-sm text-xs outline-none focus:border-primary"
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="mobile@upi or username@okaxis"
                      type="text"
                      value={upiId}
                    />
                  </div>
                )}
              </div>

              {/* Order Summary Line */}
              <div className="p-3 bg-surface-container border border-surface-container space-y-1 font-label-mono-sm text-xs">
                <div className="flex justify-between text-outline">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>₹{cartSubtotal.toLocaleString('en-IN')}</span>
                </div>
                {cartDiscount > 0 && (
                  <div className="flex justify-between text-secondary">
                    <span>Discount ({appliedPromo?.code})</span>
                    <span>-₹{cartDiscount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-outline">
                  <span>Pan-India Delivery</span>
                  <span className={isFreeShipping ? 'text-emerald-400 font-bold' : ''}>
                    {isFreeShipping ? 'FREE' : '₹99'}
                  </span>
                </div>
                <div className="flex justify-between text-pure-white font-bold text-sm pt-2 border-t border-surface-container-high">
                  <span>Total Amount</span>
                  <span>₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                className="w-full py-3.5 bg-primary hover:bg-pure-white text-pitch-black font-headline-sm uppercase font-bold tracking-wider flex items-center justify-center gap-2 active:scale-[0.98] transition-all disabled:opacity-50"
                disabled={isSubmitting || cart.length === 0}
                type="submit"
              >
                {isSubmitting ? (
                  <span>PROCESSING PAYMENT...</span>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-[20px]">verified</span>
                    <span>PAY &amp; COMPLETE ORDER (₹{finalTotal.toLocaleString('en-IN')})</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
