"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { BrandMark } from "./BrandMark";
import { useCart } from "./CartProvider";

const LINKS = [
  { href: "/", label: "Menü" },
  { href: "/hakkimizda", label: "Hakkımızda" },
  { href: "/siparis", label: "Sipariş" },
];

export function Header() {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#140e0a]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <BrandMark />

        <nav className="hidden items-center gap-7 sm:flex">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`text-[0.95rem] font-medium tracking-wide transition ${
                pathname === link.href
                  ? "text-[#e8a317]"
                  : "text-[#f6ead7]/75 hover:text-[#f6ead7]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/siparis"
            className="relative rounded-full border border-[#e8a317]/40 px-4 py-2 text-sm font-medium text-[#e8a317] hover:bg-[#e8a317] hover:text-[#140e0a]"
          >
            Sepetim
            {count > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-[#c23c22] px-1 text-[11px] text-white">
                {count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-[#f6ead7] sm:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Menüyü aç"
          >
            ☰
          </button>
        </div>
      </div>
      {open ? (
        <div className="border-t border-white/10 px-4 py-4 sm:hidden">
          <nav className="flex flex-col gap-3">
            {LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base text-[#f6ead7]"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      ) : null}
    </header>
  );
}
