"use client";

import { MenuImage } from "./MenuImage";
import { useCart } from "./CartProvider";
import { formatTRY } from "@/lib/format";
import type { MenuItem } from "@/lib/menu-types";

export function ProductCard({ item }: { item: MenuItem }) {
  const { add } = useCart();

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-[#1c1410] shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <MenuImage
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {item.tags?.[0] ? (
          <span className="absolute left-4 top-4 rounded-full bg-[#c23c22] px-3 py-1 text-xs uppercase tracking-wider text-white">
            {item.tags[0]}
          </span>
        ) : null}
      </div>
      <div className="space-y-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-[family-name:var(--font-display)] text-[1.65rem] italic text-[#f6ead7]">
            {item.name}
          </h3>
          <p className="shrink-0 text-[#e8a317]">{formatTRY(item.price)}</p>
        </div>
        <p className="text-sm leading-6 text-[#f6ead7]/70">{item.description}</p>
        <button
          type="button"
          onClick={() => add(item.id)}
          className="w-full rounded-full bg-[#e8a317] py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#140e0a] transition hover:bg-[#f3ba3a]"
        >
          Sepete ekle
        </button>
      </div>
    </article>
  );
}
