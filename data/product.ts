export type Product = {
  id: number;
  name: string;
  category: string;
  price: number;
  oldPrice?: number;
  rating: number;
  reviews: number;
  badge?: string;
  keywords?: string[];
  image: string;
};

export const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Home & Living",
  "Beauty",
  "Sports",
];

export const products: Product[] = [
   {
    id: 1,
    name: "Nova Pro Max",
    category: "Electronics",
    price: 79999,
    oldPrice: 84999,
    rating: 4.8,
    reviews: 312,
    badge: "Best Seller",
    keywords: ["phone", "phones", "smartphone", "mobile", "camera"],
    image:
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    name: "AirPulse Pro",
    category: "Electronics",
    price: 12999,
    oldPrice: 14999,
    rating: 4.7,
    reviews: 186,
    badge: "Popular",
    keywords: ["headphones", "headphone", "audio", "wireless", "earbuds"],
    image:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    name: "Apex Watch S2",
    category: "Electronics",
    price: 18999,
    rating: 4.6,
    reviews: 94,
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 4,
    name: "Stride X1",
    category: "Fashion",
    price: 7499,
    oldPrice: 8999,
    rating: 4.7,
    reviews: 128,
    badge: "New",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 5,
    name: "Vision Cam 4K",
    category: "Electronics",
    price: 45999,
    rating: 4.8,
    reviews: 76,
    image:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 6,
    name: "ZenBook Air",
    category: "Electronics",
    price: 68999,
    oldPrice: 72999,
    rating: 4.9,
    reviews: 58,
    badge: "Top Rated",
    keywords: ["laptop", "notebook", "computer", "ultrabook"],
    image:
      "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 7,
    name: "Minimal Chair",
    category: "Home & Living",
    price: 8999,
    oldPrice: 10999,
    rating: 4.6,
    reviews: 72,
    image:
      "https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 8,
    name: "Essential Skin Set",
    category: "Beauty",
    price: 2499,
    oldPrice: 2999,
    rating: 4.8,
    reviews: 214,
    badge: "Trending",
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80",
  },
];