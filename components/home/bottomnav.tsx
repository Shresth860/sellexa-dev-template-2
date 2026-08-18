"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  ShoppingCart,
  Heart,
  Package,
} from "lucide-react";
import { useCart } from "@/context/CartContext";

const navItems = [
  {
    label: "Home",
    href: "/",
    icon: Home,
  },
  {
    label: "Cart",
    href: "/cart",
    icon: ShoppingCart,
  },
  {
    label: "Wishlist",
    href: "/wishlist",
    icon: Heart,
  },
  {
    label: "Orders",
    href: "/orders",
    icon: Package,
  },
];

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, wishlistCount } = useCart();

  const getBadgeCount = (href: string) => {
    if (href === "/cart") return cartCount;
    if (href === "/wishlist") return wishlistCount;
    return 0;
  };

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white px-2 pb-safe dark:border-gray-800 dark:bg-[#111] md:hidden">
      <div className="mx-auto flex h-16 max-w-md items-center justify-around">
        {navItems.map((item) => {
          const Icon = item.icon;

          const isActive =
            pathname === item.href ||
            (item.href !== "/" && pathname.startsWith(item.href));

          const badgeCount = getBadgeCount(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex h-full min-w-[64px] flex-col items-center justify-center gap-1 text-xs font-medium transition-colors ${
                isActive
                  ? "text-[#16522d]"
                  : "text-gray-500 hover:text-[#16522d] dark:text-gray-400"
              }`}
            >
              <div className="relative">
                <Icon
                  size={21}
                  strokeWidth={isActive ? 2.5 : 2}
                />

                {badgeCount > 0 && (
                  <span className="absolute -right-3 -top-2 flex min-w-[17px] h-[17px] items-center justify-center rounded-full bg-[#ff8a1f] px-1 text-[9px] font-bold text-black">
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </span>
                )}
              </div>

              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}