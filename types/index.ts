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
  alt: string;
  isSoldOut?: boolean;
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
}
