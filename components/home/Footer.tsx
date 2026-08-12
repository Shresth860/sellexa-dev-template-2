import { ArrowUpRight } from "lucide-react";

const footerLinks = {
  Shop: [
    { label: "All Products", href: "#shop" },
    { label: "New Arrivals", href: "#new" },
    { label: "Deals", href: "#shop" },
    { label: "Categories", href: "#categories" },
  ],
  Company: [
    { label: "About Sellexa", href: "#shop" },
    { label: "Contact Us", href: "#new" },
    { label: "Careers", href: "#shop" },
    { label: "Support", href: "#shop" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "#shop" },
    { label: "Terms & Conditions", href: "#shop" },
    { label: "Refund Policy", href: "#shop" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-zinc-200 bg-white">
      <div className="mx-auto w-[calc(100%-28px)] max-w-[1720px]">
        {/* Main Footer */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:py-16">
          {/* Brand */}
          <div>
            <a
              href="/"
              className="inline-flex items-center gap-2 text-xl font-black tracking-[-0.04em] text-zinc-950"
            >
              <span className="grid size-8 place-items-center rounded-[9px] bg-[#171a18] text-white">
                S
              </span>

              SELLEXA
            </a>

            <p className="mt-5 max-w-xs text-sm leading-6 text-zinc-500">
              Discover better products, better prices, and a
              better way to shop.
            </p>

            <a
              href="#shop"
              className="mt-5 inline-flex items-center gap-1 text-[10px] font-bold text-zinc-800 transition hover:text-zinc-500"
            >
              Explore Sellexa
              <ArrowUpRight size={13} />
            </a>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(
            ([title, links]) => (
              <div key={title}>
                <h3 className="text-[12px] font-extrabold uppercase tracking-[0.12em] text-zinc-900">
                  {title}
                </h3>

                <nav className="mt-5 flex flex-col gap-3">
                  {links.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      className="w-fit text-[12px] text-zinc-500 transition hover:text-zinc-950"
                    >
                      {link.label}
                    </a>
                  ))}
                </nav>
              </div>
            ),
          )}
        </div>

        {/* Bottom Footer */}
        <div className="flex flex-col gap-4 border-t border-zinc-200 py-6 text-[12px] text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <span>
            © 2026 Sellexa. All rights reserved.
          </span>

          <span >
            Made for smarter shopping.
          </span>
        </div>
      </div>
    </footer>
  );
}