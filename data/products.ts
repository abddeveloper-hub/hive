import { Product, Review } from '@/types';

export const DENIM_PRODUCTS: Product[] = [
  {
    id: 'denim-1',
    name: 'Vintage Bootcut (Deep Blue)',
    category: 'denim',
    fit: 'bootcut',
    colorway: 'Deep Blue',
    price: 1199,
    originalPrice: 1499,
    discountBadge: '20% OFF',
    badgeLabel: 'BOOTCUT',
    sizes: ['28', '30', '32', '34', '36'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDmKvjEc1A6hZL5zh90Hd27k9Wk5t1mozeTHXDKQJg4RTARxcfdtp-rApFCnCCs5Eq4_mvTLQWVJ6mURufYpOVsNgRVeJitLEoYoW8erqJQwWzd4Y-R-wW1vxPcj2hps_-Ein8kpkEKL6E8MWUOs0FsqLYLoxotsxEKUCoX407pf2P8MXW--7vq1ytuTSABrFZ034G4b8jZBStiy2wAewoNKPA0uo48Mqpd6XZfwlE',
    alt: "Streetwear studio catalog photography of men's Vintage Bootcut Denim in deep blue wash, clean brutalist front view showing relaxed knee flare, worn on model with heavy work boots, studio high-contrast lighting."
  },
  {
    id: 'denim-2',
    name: 'Vintage Bootcut (Black Rinse)',
    category: 'denim',
    fit: 'bootcut',
    colorway: 'Black Rinse',
    price: 1199,
    originalPrice: 1499,
    discountBadge: '20% OFF',
    badgeLabel: 'BOOTCUT',
    sizes: ['28', '30', '32', '34', '36'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWT4xtXTi5HNreGyUa8ukpBmWYTFjVl5ILSHP9qPDdh2weVsgRYdCcQV64q1lgssHEDujgskqFB-LUamFHUG6rCe8e8O01k84viHb2PITEBkl_irEIa9FMYZfIHTRhEfQn1uFPLy1KrC89DVLbzqudwCGilqQH8GTNuo4dE8S8RmJkG1jjDNRCiWEDP6XEl8gW2U2ZwbO7q8k1RLWS15xsIQvQZ0Bz0Kp8pKbJT9M',
    alt: "Editorial look of men's raw Black Rinse Vintage Bootcut denim jeans, dark monochrome tonal look with clean industrial aesthetic, crisp creases, premium streetwear silhouette."
  },
  {
    id: 'denim-3',
    name: 'Vintage Bootcut (Coastal Blue)',
    category: 'denim',
    fit: 'bootcut',
    colorway: 'Coastal Blue',
    price: 1199,
    originalPrice: 1499,
    discountBadge: '20% OFF',
    badgeLabel: 'BOOTCUT',
    sizes: ['28', '30', '32', '34', '36'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-jNSgMRHICUCzP14SymAS1Jm2VLiWiHwiT33pSJnmmSN-ZyprXBFToUETiJ_vdUiAnmqmS42TqfQtB3l7Z5gRI9T-jMXgd6UtzOx9c58RNsA2to3KgMoPZKTMkzza96wFcLUJr_NcYtPBffAq08MsA-D5Qbd1p8gYHN_w1WflxUPvoWgbvWtCs5tqLs_bMrSljpOb0DWW9iS-RM6Z2OLMxDJ0uweR23qX0iIBEPk',
    alt: "High angle streetwear photo of men's Coastal Blue flared bootcut jeans draped over heavy industrial metal staircase, natural daylight highlights faded whiskering."
  },
  {
    id: 'denim-4',
    name: 'Straight Fit (Rustic Wash)',
    category: 'denim',
    fit: 'straight',
    colorway: 'Rustic Wash',
    price: 1199,
    originalPrice: 1499,
    discountBadge: '20% OFF',
    badgeLabel: 'STRAIGHT',
    sizes: ['28', '30', '32', '34', '36'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOSqVU0ofkJ_rAX6RuNC5Fqz1hPuNYd2GWQ5yZOKCQNTI7zVTp6458uK0nYzpWkO8GEDko8zAkKBkZZNyJid78kCDPVAjjvReLIe9cN8S4C_sadau-YNkXjwLJcN_0xfHFm8XKrFdMV6perbz1jmvo_FWMklhT9XfMLjfuMMrh1oJ0PplCzP1_RnF1gDGhrLmGVn0jHElga9pXDG2jNHu3kuk6c11Hjij38TKkVR4',
    alt: "Minimalist streetwear product shot of Straight Fit Jeans in Rustic Wash tone, heavy cotton texture, raw hem details, moody dark backdrop with directional studio rim light."
  },
  {
    id: 'denim-5',
    name: 'Baggy Fit (Rustic Wash)',
    category: 'denim',
    fit: 'baggy',
    colorway: 'Rustic Wash',
    price: 1199,
    originalPrice: 1499,
    discountBadge: '20% OFF',
    badgeLabel: 'BAGGY',
    sizes: ['28', '30', '32', '34', '36', '38'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCv8QU2oYUEfixLDcj1zzcq0lPStZUN_likORjq2vCxz6qappOFVgUAdsKDgmXveNfWChWvCOEc_TVx4y67lpx9V2yJ9hdrptQmzXGGdJ043Dyzdu55M-seB63j3XPJllOLy1IFmzUop4GyUzdCINNYKmqCiFzTzZ6d3wfJJkQrw73tnVcr8ukAAdz3p6QWZ1Kh0NiwyZ65wjq6ueQK8_KPkZQ-seIZqV1mOjfRPV8',
    alt: "Streetwear model standing sideways showcasing oversized Baggy Fit Denim in Rustic Wash, wide leg opening pooling gracefully over chunky skate sneakers, brutalist raw background."
  },
  {
    id: 'denim-6',
    name: 'Baggy Fit (Sun-faded Blue)',
    category: 'denim',
    fit: 'baggy',
    colorway: 'Sun-faded Blue',
    price: 1199,
    originalPrice: 1499,
    badgeLabel: 'BAGGY',
    isSoldOut: true,
    sizes: ['28', '30', '32', '34', '36'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAR9qcuWx9ZYV_Wpbw7p3HdgdGVeKTx_gz4wfX9grJItBViTm67zEmjb_nJtCpnKreZ6tyu7sqPcsIjuvNjW3oXC0QCzf2k1tAM9y2qrGtDQJYehTemn8ddaeTUXQ2oha6sWEZf1BaTUmPiHM7M55qoIvHBe9-5VUwSboWz1p_8PaCJD9MjgxeIqdnCzvOzQhY8m6hpd4CW0f-jxrhUr9ui9e0lkZoqNwuBP6u6aWc',
    alt: "Editorial product view of Sun-faded Blue Baggy Fit Denim jeans laid flat on raw black steel slab, muted pastel indigo tones, distressed vintage wash, soft natural shadow."
  },
  {
    id: 'denim-7',
    name: 'Barrel Fit (Carbon Blue)',
    category: 'denim',
    fit: 'barrel',
    colorway: 'Carbon Blue',
    price: 1199,
    originalPrice: 1499,
    discountBadge: '20% OFF',
    badgeLabel: 'BARREL',
    sizes: ['28', '30', '32', '34', '36'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAF_YvoJSB3u-B_Tzeuhhd6OQ1NynO8P96-W2TjpS913DluMWl9K-UGpZApNZ6XSuWOMDnBbu3wP2nCfHBazf2vHv3yW_3yTzGEvIiLWzhrfY52fi5gMjEWON0XbWvK6Tfnfrp9YMKrukHv4vcOzdoXSqGZCfprQ_famE5JarXYpuds9YgVzV5Xp03CSgf6KBVJ1OUoIkjmBmYH3JDfmgA23IvNEe0k-YF5mUckKMI',
    alt: "Contemporary fashion shot of Barrel Fit Denim in Carbon Blue, distinct curved exaggerated outer leg seam, futuristic urban tailoring, model against charcoal architectural concrete."
  },
  {
    id: 'denim-8',
    name: 'Vintage Bootcut (Midnight)',
    category: 'denim',
    fit: 'bootcut',
    colorway: 'Midnight',
    price: 1199,
    originalPrice: 1499,
    discountBadge: '20% OFF',
    badgeLabel: 'BOOTCUT',
    sizes: ['28', '30', '32', '34', '36'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA6x4GiQkXOgJvv4hZ28J1eQkodwq8PrFrEGQe3FimhYnWTILqT_5qqlRE4Z7tKrn7nwuwW4CscRvspXF9yOliXudOvLNaS51kEbu8ozi2-R6jMG1Vt195rGqQlUwHE2Vv3ytbl0P4etlgR5VNlau14PfLWeuZf0iyMFVn1eimswBP9voMcMUD-KPc3js6K2okPt451j2mcXA2y8TmG9dB8i4T2uMjO4fO1AAFtvJ4',
    alt: "Editorial look of deep Midnight Blue Vintage Bootcut denim jeans with subtle whiskers, styled with heavy Cuban heel boots, dark minimal luxury urban fashion aesthetic."
  }
];

export const SPOTLIGHT_PRODUCT = {
  id: 'spotlight-1',
  name: 'Vintage Bootcut Denim',
  colorway: 'Dust Blue // Cut #04',
  price: 1199,
  originalPrice: 1499,
  discountTag: '20% OFF TODAY ONLY',
  sizes: ['28', '30', '32', '34', '36'],
  defaultSize: '32',
  image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD9o1oKQuUz3juTfjPJaTrm1SKBPKcPDQtDq1ak87mZ2voftPh2Phyh9GcCUgBdsQPxAkfq8uSfjPPeHr04hj9RdM4ZR9YPZbSe1H40qj9YEH-WotMrcUCETAtUgaxLfpx0cJqcW8jBP-zKBp3FKtPQLsvsk8bHe-m-XXzY9WsP9rm7FHXIsbffrky_mHpFcIF3i1QoS7Mlvf7W9jM1uZpH9xG_Bthw2pcdsCE7ngQ',
  alt: 'Editorial lookbook spotlight hero product photo of Vintage Bootcut Denim in Dust Blue finish. Clean dramatic front view showing distinctive subtle wash patterns, crisp denim grain, luxury streetwear drape and tailored hem.'
};

export const TOPWEAR_PRODUCTS: Product[] = [
  {
    id: 'topwear-1',
    name: 'Astral Shirt (Blue)',
    category: 'shirts',
    price: 899,
    originalPrice: 1099,
    discountBadge: '18% OFF',
    badgeLabel: 'SHIRT',
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgvDYRXt75ybCCwynREMTqhWQ5RUE8Ogo10FluhNH6MqI8Hf4lsiQeZwVnqQsZbEPmIUgSVywWStrKV4ODBDIjyPntO2YPZhiF1S28eGNqQaKYCyh_AgE5Rta7xqjEunXVNdXQfI4VgnScJdUNrN1qy2SCKvPd8OzZwot1UEmObK5VzPg4Uu8LuIZiT6RKKPSCixEx9GHroHHSfkBNBYGA0fS5qhihpNTnsh5PYvo',
    alt: 'Editorial lookbook photo of Astral Shirt in relaxed cobalt blue, cuban collar street styling, model in brutalist architecture shadows, crisp high fashion streetwear aesthetic.'
  },
  {
    id: 'topwear-2',
    name: 'Atelier Soc. Shirt',
    category: 'shirts',
    price: 899,
    originalPrice: 1099,
    discountBadge: '18% OFF',
    badgeLabel: 'SHIRT',
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAZ_YCL9TfaMFwxapoIUpcpGVhgGrVRhHAauzYqPusAzXQZttFh0yAay7nisy4m1ArvQpJJBX0xSQQJvGtSE_x8LnUpMbmfFUyGqqJQHJi-C_1H0R8k1ezDTOt3TO07pJulX89w2T-wy695vDA5qM24tUdvgU4sHKkOq9souKrQC0MdwueRgT3Edg7aeODYFGhpBksUwvMGyCnFpSM8v7Zb-zs3pqHgPmwbhTXB1GU',
    alt: 'Monochrome studio portrait of model wearing Atelier Society tailored woven shirt with raw edge chest pocket detail, modern avant-garde street silhouette.'
  },
  {
    id: 'topwear-3',
    name: 'Washed Olive Tee',
    category: 'tshirts',
    price: 899,
    originalPrice: 1099,
    discountBadge: '18% OFF',
    badgeLabel: 'TEE',
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAx_nh7u5NMuYWbwzorPCX5UGSNLtDgXAfIzrRXFU62wcfso4YYoaqbS8Sdo0MhF_byp9QJMGawmcn-ysbZK4Txa8IKxaOCbHo-Al9e5KBgnB1wWn12ByfdrKYRAfbsfqin7dg0jMnB4EIyxAXEYwpcGdUn_fi6gETcT0a3TDIAFI7keCvPhtRp6jFtg-WqjTegG2GGU2p8wHZltceG5HpNUgdoN9bEa8OwrwCTmAo',
    alt: 'Editorial product shot of heavyweight 280 GSM Washed Olive Oversized Tee, dropped shoulder streetwear fit, vintage stone-washed dye effect against minimalist concrete surface.'
  },
  {
    id: 'topwear-4',
    name: 'Work Jacket (Olive)',
    category: 'jackets',
    price: 3199,
    originalPrice: 3799,
    discountBadge: '15% OFF',
    badgeLabel: 'JACKET',
    sizes: ['S', 'M', 'L', 'XL'],
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD2d99J1QFDsAieviXnBdRjOnakP2zGcucd0122IOaDjneIgbfDP_pFbRVVbrIPrge7DCjhfHjZwlFPbqSsJffiPeI0rRffb9gf2PXA7Ah5qFQf0DDnuGQbOaarmmYPIb6zbsFTbc1PvaTQW4Hh4u7hzd6vvK2d7sSRGHpL5sv2XKVn1HSdLgg7c2Netml8YQPcLhrjKMn1p5YDrZsPIhiYs4VF-1wFHY_nnTKwhMk',
    alt: 'Rugged utilitarian heavy canvas Work Jacket in Olive Drab tone with brass zipper and corduroy collar details, worn over raw denim, industrial warehouse background.'
  }
];

export const CURATED_LOOK = {
  id: 'look-04',
  title: 'DRIVE JACKET + VINTAGE BOOTCUT',
  label: 'LOOK // 04',
  heroImage: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBZgu1q-cgt2lJx0hyfnx4QPQpWPIiYWGrN9-DQg7VjQVgrwOQvmH-XT55PJDXZZUymgAPkBTSSABMyUdAOXz3CKK5NfutHCIL5bMBQnYoklR0dzzs3R2aMY3F4dBdUlEe04ypGhl6xZf1WNOJxxJiSrduJFq3-dOAKL6-Qq7Nq8afWHqt-39dSWifPSW3tyfAELDphrmHn83_BLvuVej7zuj4SvMdF9ym8-bQoFOU',
  items: [
    {
      id: 'look-jacket',
      name: 'Drive Jacket (Burgundy)',
      price: 7649.10,
      originalPrice: 8499,
      size: 'Size M',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB3K-5H5GiVjTqiTcUIM2d0-XoA7Wu8DbWPExQMnNvxgDzQj1xNeUfhByTVJAA9DY9-u6e_TL8j2fHwN00R-MkhiQauzrYGM-ay2qIuTrv7p20ViLwzifqrMXXDznVDSGNjVY4kTOZgoDOBmx-LayhScRpzgH_aIC-DH6DIjuLSww9dMv-JjM5xBPalJ4x5xTKoAKyoSZV3owPqo9OcIk7yAk_6tgxQntHJzxpahUw'
    },
    {
      id: 'look-denim',
      name: 'Vintage Bootcut Denim',
      price: 1199.00,
      originalPrice: 1499,
      size: 'Size 32',
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBYLhp0CjyagyUARsHCeul9HEujXwchHszuPS42flE82hNA0hc936cBSNOUC8HWmppQM0ZyFfJ7odg2kIVcWxrX3HVwaHnuRBNVPTIziMwEFyoer3aVdB39x0-KqMf24vamZaDDvj6vhpC0KsRIWbJ7AljftEp5M0CJ7zhWSVOibrwL4etpkrjMy2qCL4DjXJmuDjNZ6egEGXI2baiicKMS5vGOh1RZzIApPZMDMuc'
    }
  ],
  bundlePrice: 8848.10
};

export const REVIEWS: Review[] = [
  {
    id: 'rev-1',
    author: 'Arun M.',
    rating: 5,
    content: '“love ur service btw and also the quality is insane. The fit on the vintage bootcut is unlike anything else in India right now.”',
    verified: true
  },
  {
    id: 'rev-2',
    author: 'Mohammed Rayyan',
    rating: 5,
    content: '“Superb quality clothes at affordable prices. Really loved the fit and finish of the clothes. Highly recommend.”',
    verified: true
  },
  {
    id: 'rev-3',
    author: 'Pranav C.',
    rating: 5,
    content: '“The wait to get the drop was slightly longer, but absolutely worth it. The brand, the aesthetic, the denim weight. I’m hooked.”',
    verified: true
  },
  {
    id: 'rev-4',
    author: 'Faheem Fazil',
    rating: 5,
    content: '“Customer service at the Bandra shop was genuinely attentive. The baggy cuts sit so naturally over sneakers.”',
    verified: true
  }
];
