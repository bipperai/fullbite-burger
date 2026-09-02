"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/yonetim", label: "Siparişler" },
  { href: "/yonetim/menu", label: "Menü & Fiyat" },
];

export function AdminNav({
  adminEmail,
  onLogout,
}: {
  adminEmail: string;
  onLogout: () => void;
}) {
  const pathname = usePathname();

  return (
    <div className="mx-auto max-w-6xl px-4 pt-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#e8a317]">
            Yönetim
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl italic text-[#f6ead7]">
            Panel
          </h1>
          <p className="mt-2 text-sm text-[#f6ead7]/60">Giriş: {adminEmail}</p>
        </div>
        <button
          type="button"
          onClick={onLogout}
          className="rounded-full border border-white/15 px-5 py-2 text-sm text-[#f6ead7]/80 hover:border-[#e8a317]/40 hover:text-[#e8a317]"
        >
          Çıkış
        </button>
      </div>

      <nav className="mt-8 flex gap-2">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`rounded-full px-5 py-2.5 text-sm font-medium transition ${
              pathname === tab.href
                ? "bg-[#e8a317] text-[#140e0a]"
                : "border border-white/10 text-[#f6ead7]/75 hover:border-[#e8a317]/40 hover:text-[#f6ead7]"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
