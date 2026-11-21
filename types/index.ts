export interface Product {
  id: string;
  name: string;
  category: 'denim' | 'shirts' | 'tshirts' | 'jackets';
  fit?: 'bootcut' | 'straight' | 'baggy' | 'barrel';
  colorway?: string;
  price: number;
  originalPrice: number;
  discountBadge?: string;
  badgeLabel?: string;
  sizes: string[];
  image: string;
  gallery?: string[];
  alt: string;
  isSoldOut?: boolean;
  fabricSpecs?: {
    weight?: string;
    composition?: string;
    weave?: string;
    wash?: string;
  };
  description?: string;
}

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  originalPrice?: number;
  size: string;
  quantity: number;
  image: string;
  colorway?: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  content: string;
  verified: boolean;
  date?: string;
  fitFeedback?: string;
}

export interface CommunityLook {
  id: string;
  instagramHandle: string;
  image: string;
  location: string;
  taggedProduct: {
    id: string;
    name: string;
    price: number;
  };
}

export interface PromoCode {
  code: string;
  discountPercent: number;
  description: string;
  minSpend?: number;
}

export interface OrderDetails {
  orderId: string;
  customerName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  pincode: string;
  paymentMethod: 'upi' | 'card' | 'cod' | 'whatsapp';
  items: CartItem[];
  total: number;
  date: string;
}
