const CART_COUNT_KEY = "sellexa-cart-count";

export function getCartCount() {
  if (typeof window === "undefined") return 0;

  const rawValue = Number(localStorage.getItem(CART_COUNT_KEY) ?? "0");
  return Number.isFinite(rawValue) && rawValue >= 0 ? rawValue : 0;
}

export function setCartCount(nextCount: number) {
  const safeValue = Math.max(0, Math.floor(nextCount));

  if (typeof window !== "undefined") {
    localStorage.setItem(CART_COUNT_KEY, String(safeValue));
    window.dispatchEvent(new Event("sellexa-cart-count-changed"));
  }

  return safeValue;
}

export function addToCartCount(delta: number) {
  return setCartCount(getCartCount() + delta);
}
