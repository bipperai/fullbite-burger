"use client";

import { OrderLink } from "./OrderButton";
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
      {count === 0 ? (
        <p className="mt-6 rounded-full bg-white/10 py-3 text-center text-sm text-white/30">
          Sepet boş
        </p>
      ) : (
        <OrderLink href="/siparis" className="mt-6 py-3 text-sm">
          Sipariş ver
        </OrderLink>
      )}
    </aside>
  );
}
