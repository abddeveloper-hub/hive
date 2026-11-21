'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Review, PromoCode, OrderDetails } from '@/types';
import { PROMO_CODES, REVIEWS as INITIAL_REVIEWS } from '@/data/products';

interface CartContextType {
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  cartDiscount: number;
  cartTotal: number;
  appliedPromo: PromoCode | null;
  applyPromo: (code: string) => { success: boolean; message: string };
  removePromo: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  addToCart: (item: Omit<CartItem, 'id'>) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, delta: number) => void;
  clearCart: () => void;
  lastToast: string | null;
  setLastToast: (msg: string | null) => void;

  // Wishlist
  wishlist: Product[];
  wishlistCount: number;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;
  toggleWishlist: (product: Product) => void;
  isInWishlist: (productId: string) => boolean;

  // Modals
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  isCheckoutOpen: boolean;
  setIsCheckoutOpen: (open: boolean) => void;
  isReviewModalOpen: boolean;
  setIsReviewModalOpen: (open: boolean) => void;

  // Quick View
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id'>) => void;

  // Orders
  lastOrder: OrderDetails | null;
  setLastOrder: (order: OrderDetails | null) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart state
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: 'initial-1',
      productId: 'denim-1',
      name: 'Vintage Bootcut (Deep Blue)',
      price: 1199,
      originalPrice: 1499,
      size: '32',
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmKvjEc1A6hZL5zh90Hd27k9Wk5t1mozeTHXDKQJg4RTARxcfdtp-rApFCnCCs5Eq4_mvTLQWVJ6mURufYpOVsNgRVeJitLEoYoW8erqJQwWzd4Y-R-wW1vxPcj2hps_-Ein8kpkEKL6E8MWUOs0FsqLYLoxotsxEKUCoX407pf2P8MXW--7vq1ytuTSABrFZ034G4b8jZBStiy2wAewoNKPA0uo48Mqpd6XZfwlE',
    },
    {
      id: 'initial-2',
      productId: 'topwear-3',
      name: 'Washed Olive Tee',
      price: 899,
      originalPrice: 1099,
      size: 'L',
      quantity: 1,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx_nh7u5NMuYWbwzorPCX5UGSNLtDgXAfIzrRXFU62wcfso4YYoaqbS8Sdo0MhF_byp9QJMGawmcn-ysbZK4Txa8IKxaOCbHo-Al9e5KBgnB1wWn12ByfdrKYRAfbsfqin7dg0jMnB4EIyxAXEYwpcGdUn_fi6gETcT0a3TDIAFI7keCvPhtRp6jFtg-WqjTegG2GGU2p8wHZltceG5HpNUgdoN9bEa8OwrwCTmAo',
    }
  ]);

  // Wishlist state
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isHydrated, setIsHydrated] = useState(false);

  // Modals & UI States
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Reviews state
  const [reviews, setReviews] = useState<Review[]>(INITIAL_REVIEWS);

  // Promo code state
  const [appliedPromo, setAppliedPromo] = useState<PromoCode | null>(null);

  // Orders state
  const [lastOrder, setLastOrder] = useState<OrderDetails | null>(null);

  // Micro-toast state
  const [lastToast, setLastToast] = useState<string | null>(null);

  // Hydrate from localStorage once on client mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem('hive_cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedWishlist = localStorage.getItem('hive_wishlist');
      if (savedWishlist) {
        setWishlist(JSON.parse(savedWishlist));
      }
    } catch (e) {
      console.error(e);
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage whenever cart changes (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('hive_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart, isHydrated]);

  // Save to localStorage whenever wishlist changes (only after hydration)
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem('hive_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist, isHydrated]);

  const showToast = (msg: string) => {
    setLastToast(msg);
    setTimeout(() => {
      setLastToast((curr) => (curr === msg ? null : curr));
    }, 3200);
  };

  const addToCart = (newItem: Omit<CartItem, 'id'>) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (i) => i.productId === newItem.productId && i.size === newItem.size
      );
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += newItem.quantity;
        return updated;
      }
      return [...prev, { ...newItem, id: `${newItem.productId}-${newItem.size}-${Date.now()}` }];
    });
    showToast(`✓ ${newItem.name} (${newItem.size}) added to your bag`);
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedPromo(null);
  };

  // Wishlist actions
  const toggleWishlist = (product: Product) => {
    setWishlist((prev) => {
      const exists = prev.some((p) => p.id === product.id);
      if (exists) {
        showToast(`Removed ${product.name} from wishlist`);
        return prev.filter((p) => p.id !== product.id);
      } else {
        showToast(`✓ Saved ${product.name} to wishlist`);
        return [...prev, product];
      }
    });
  };

  const isInWishlist = (productId: string) => {
    return wishlist.some((p) => p.id === productId);
  };

  // Promo code actions
  const applyPromo = (code: string) => {
    const cleanCode = code.trim().toUpperCase();
    const found = PROMO_CODES.find((p) => p.code === cleanCode);

    if (!found) {
      return { success: false, message: 'Invalid promo code' };
    }

    if (found.minSpend && cartSubtotal < found.minSpend) {
      return {
        success: false,
        message: `Min. spend of ₹${found.minSpend.toLocaleString('en-IN')} required for ${found.code}`,
      };
    }

    setAppliedPromo(found);
    return { success: true, message: `Applied ${found.code} (${found.discountPercent}% OFF)` };
  };

  const removePromo = () => {
    setAppliedPromo(null);
  };

  // Review action
  const addReview = (review: Omit<Review, 'id'>) => {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      date: 'Just now',
    };
    setReviews((prev) => [newRev, ...prev]);
    showToast('✓ Thank you! Your review has been published.');
  };

  // Calculations
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
  const cartDiscount = appliedPromo
    ? Math.round((cartSubtotal * appliedPromo.discountPercent) / 100)
    : 0;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount);
  const wishlistCount = wishlist.length;

  return (
    <CartContext.Provider
      value={{
        cart,
        cartCount,
        cartSubtotal,
        cartDiscount,
        cartTotal,
        appliedPromo,
        applyPromo,
        removePromo,
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        lastToast,
        setLastToast,

        wishlist,
        wishlistCount,
        isWishlistOpen,
        setIsWishlistOpen,
        toggleWishlist,
        isInWishlist,

        isSearchOpen,
        setIsSearchOpen,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        isCheckoutOpen,
        setIsCheckoutOpen,
        isReviewModalOpen,
        setIsReviewModalOpen,

        quickViewProduct,
        setQuickViewProduct,

        reviews,
        addReview,

        lastOrder,
        setLastOrder,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
