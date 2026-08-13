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
  images?: string[];
  color?: string;
  inStock?: boolean;
};

export const categories = [
  "All",
  "Electronics",
  "Fashion",
  "Home & Living",
  "Beauty",
  "Sports",
];

const img = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&h=570&q=90`;

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
    color: "Titanium Gray",
    keywords: [
      "phone",
      "phones",
      "smartphone",
      "mobile",
      "camera",
    ],
    image: img("photo-1511707171634-5f897ff02aa9"),
    images: [
      img("photo-1511707171634-5f897ff02aa9"),
      img("photo-1592899677977-9c10ca588bbd"),
      img("photo-1598327105666-5b89351aff97"),
      img("photo-1556656793-08538906a9f8"),
      img("photo-1533228100845-08145b01de14"),
    ],
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
    color: "Blue",
    keywords: [
      "headphones",
      "headphone",
      "audio",
      "wireless",
      "earbuds",
    ],
    image: img("photo-1505740420928-5e560c06d30e"),
    images: [
      img("photo-1505740420928-5e560c06d30e"),
      img("photo-1484704849700-f032a568e944"),
      img("photo-1577174881658-0f30ed549adc"),
      img("photo-1583394838336-acd977736f90"),
      img("photo-1546435770-a3e426bf472b"),
    ],
  },

  {
    id: 3,
    name: "Apex Watch S2",
    category: "Electronics",
    price: 18999,
    rating: 4.6,
    reviews: 94,
    color: "Black",
    keywords: [
      "watch",
      "smartwatch",
      "wearable",
      "fitness",
      "smart watch",
    ],
    image: img("photo-1523275335684-37898b6baf30"),
    images: [
      img("photo-1523275335684-37898b6baf30"),
      img("photo-1508685096489-7aacd43bd3b1"),
      img("photo-1544117519-31a4b719223d"),
      img("photo-1434493789847-2f02dc6ca35d"),
      img("photo-1579586337278-3befd40fd17a"),
    ],
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
    color: "White",
    keywords: [
      "shoes",
      "sneakers",
      "fashion",
      "running",
      "sports shoes",
    ],
    image: img("photo-1542291026-7eec264c27ff"),
    images: [
      img("photo-1542291026-7eec264c27ff"),
      img("photo-1549298916-b41d501d3772"),
      img("photo-1552346154-21d32810aba3"),
      img("photo-1600185365483-26d7a4cc7519"),
      img("photo-1460353581641-37baddab0fa2"),
    ],
  },

  {
    id: 5,
    name: "Vision Cam 4K",
    category: "Electronics",
    price: 45999,
    rating: 4.8,
    reviews: 76,
    color: "Black",
    keywords: [
      "camera",
      "dslr",
      "mirrorless",
      "photography",
      "video",
      "4k",
    ],
    image: img("photo-1516035069371-29a1b244cc32"),
    images: [
      img("photo-1516035069371-29a1b244cc32"),
      img("photo-1502920917128-1aa500764cbd"),
      img("photo-1512790182412-b19e6d62bc39"),
      img("photo-1606986628253-3d2e5a3e4c3b"),
      img("photo-1607462109225-6b64ae2dd3cb"),
    ],
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
    color: "Silver",
    keywords: [
      "laptop",
      "notebook",
      "computer",
      "ultrabook",
      "macbook",
    ],
    image: img("photo-1496181133206-80ce9b88a853"),
    images: [
      img("photo-1496181133206-80ce9b88a853"),
      img("photo-1517336714739-489689fd1ca8"),
      img("photo-1541807084-5c52b6b3adef"),
      img("photo-1593642702821-c8da6771f0c6"),
      img("photo-1588872657578-7efd1f1555ed"),
    ],
  },

  {
    id: 7,
    name: "Minimal Chair",
    category: "Home & Living",
    price: 8999,
    oldPrice: 10999,
    rating: 4.6,
    reviews: 72,
    color: "Walnut Brown",
    keywords: [
      "chair",
      "furniture",
      "home",
      "office",
      "interior",
    ],
    image: img("photo-1503602642458-232111445657"),
    images: [
      img("photo-1503602642458-232111445657"),
      img("photo-1592078615290-033ee584e267"),
      img("photo-1580480055273-228ff5388ef8"),
      img("photo-1549497538-303791108f95"),
      img("photo-1598300042247-d088f8ab3a91"),
    ],
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
    keywords: [
      "beauty",
      "skincare",
      "skin",
      "cosmetics",
      "face care",
    ],
    image: img("photo-1556228578-8c89e6adf883"),
    images: [
      img("photo-1556228578-8c89e6adf883"),
      img("photo-1598440947619-2c35fc9aa908"),
      img("photo-1571781926291-c477ebfd024b"),
      img("photo-1612817288484-6f916006741a"),
      img("photo-1608248543803-ba4f8c70ae0b"),
    ],
  },
];