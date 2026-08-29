"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { formatTRY } from "@/lib/format";

export function CartSummary() {
  const { total, count } = useCart();

  return (
    <aside className="rounded-3xl border border-white/10 bg-[#1c1410] p-6">
      <p className="text-[#f6ead7]/70">Toplam</p>
      <p className="mt-1 font-[family-name:var(--font-display)] text-3xl text-[#e8a317]">
        {formatTRY(total)}
      </p>
      <Link
        href="/siparis"
        className={`mt-6 block rounded-full py-3 text-center text-sm font-semibold ${
          count === 0
            ? "pointer-events-none bg-white/10 text-white/30"
            : "bg-[#e8a317] text-[#140e0a]"
        }`}
      >
        Siparişe geç
      </Link>
    </aside>
  );
}
