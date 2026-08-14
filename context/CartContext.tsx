"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type CartItems = Record<number, number>;
export type WishlistItems = Record<number, boolean>;

interface CartContextType {
  cartItems: CartItems;
  wishlistItems: WishlistItems;
  cartCount: number;
  wishlistCount: number;
  addToCart: (productId: number, quantity?: number) => void;
  updateCartQuantity: (productId: number, nextQuantity: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  toggleWishlist: (productId: number, isActive?: boolean) => void;
}

const CART_STORAGE_KEY = "sellexa-cart-items";
const WISHLIST_STORAGE_KEY = "sellexa-wishlist-items";

const CartContext = createContext<CartContextType | undefined>(undefined);

function readStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const rawValue = window.localStorage.getItem(key);
    return rawValue ? (JSON.parse(rawValue) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItems>({});
  const [wishlistItems, setWishlistItems] = useState<WishlistItems>({});
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const syncFromStorage = () => {
      const nextCartItems = readStorage<CartItems>(CART_STORAGE_KEY, {});
      const nextWishlistItems = readStorage<WishlistItems>(WISHLIST_STORAGE_KEY, {});

      setCartItems((current) => {
        const currentValue = JSON.stringify(current);
        const nextValue = JSON.stringify(nextCartItems);
        return currentValue === nextValue ? current : nextCartItems;
      });

      setWishlistItems((current) => {
        const currentValue = JSON.stringify(current);
        const nextValue = JSON.stringify(nextWishlistItems);
        return currentValue === nextValue ? current : nextWishlistItems;
      });
    };

    syncFromStorage();
    setIsHydrated(true);

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === CART_STORAGE_KEY || event.key === WISHLIST_STORAGE_KEY) {
        syncFromStorage();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
    };
  }, []);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
  }, [cartItems, isHydrated]);

  useEffect(() => {
    if (!isHydrated || typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      WISHLIST_STORAGE_KEY,
      JSON.stringify(wishlistItems)
    );
  }, [wishlistItems, isHydrated]);

  const cartCount = useMemo(
    () => Object.values(cartItems).reduce((total, quantity) => total + quantity, 0),
    [cartItems]
  );

  const wishlistCount = useMemo(
    () => Object.keys(wishlistItems).length,
    [wishlistItems]
  );

  const addToCart = (productId: number, quantity = 1) => {
    setCartItems((prev) => {
      const currentQuantity = prev[productId] ?? 0;
      return {
        ...prev,
        [productId]: currentQuantity + quantity,
      };
    });
  };

  const updateCartQuantity = (productId: number, nextQuantity: number) => {
    setCartItems((prev) => {
      const currentQuantity = prev[productId] ?? 0;
      if (nextQuantity <= 0) {
        if (!currentQuantity) return prev;

        const updated = { ...prev };
        delete updated[productId];
        return updated;
      }

      if (currentQuantity === nextQuantity) return prev;

      return {
        ...prev,
        [productId]: nextQuantity,
      };
    });
  };

  const removeFromCart = (productId: number) => {
    updateCartQuantity(productId, 0);
  };

  const clearCart = () => {
    setCartItems({});
  };

  const toggleWishlist = (productId: number, isActive = true) => {
    setWishlistItems((prev) => {
      const next = { ...prev };

      if (isActive) {
        next[productId] = true;
      } else {
        delete next[productId];
      }

      return next;
    });
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        cartCount,
        wishlistCount,
        addToCart,
        updateCartQuantity,
        removeFromCart,
        clearCart,
        toggleWishlist,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }

  return context;
}
