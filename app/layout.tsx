import type { Metadata } from "next";
import { Manrope } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";
import { CartProvider } from "@/context/CartContext";
import MobileBottomNav from "@/components/home/bottomnav";
import { SearchProvider } from "@/context/SearchContext";
const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Sellexa",
  description: "Shop smarter with Sellexa",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${manrope.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="h-full" suppressHydrationWarning>
        <AuthProvider>
          <CartProvider>
            <SearchProvider>
            {children}
            </SearchProvider>
            <MobileBottomNav />
            <AuthModal />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}