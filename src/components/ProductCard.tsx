"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { useCart } from "./CartProvider";
import { formatTRY } from "@/lib/format";
import type { MenuItem } from "@/lib/menu";

function tap() {
  try {
    navigator.vibrate?.(18);
  } catch {
    /* ignore */
  }
}

export function ProductCard({ item }: { item: MenuItem }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function order() {
    tap();
    add(item.id);
    setAdded(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1200);
  }

  return (
    <article className="group overflow-hidden rounded-3xl border border-white/10 bg-[#1c1410] shadow-[0_20px_50px_rgba(0,0,0,0.25)]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
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
          onClick={order}
          className={`w-full origin-center rounded-full py-3.5 text-sm font-semibold uppercase tracking-[0.18em] transition duration-150 ease-out will-change-transform active:scale-[0.93] ${
            added
              ? "animate-bite-flash bg-[#2f9e62] text-white shadow-[0_0_32px_rgba(47,158,98,0.5)]"
              : "bg-[#e8a317] text-[#140e0a] shadow-[0_10px_28px_rgba(232,163,23,0.38)] hover:bg-[#f3ba3a] hover:shadow-[0_16px_40px_rgba(232,163,23,0.55)]"
          }`}
        >
          {added ? "Sepette ✓" : "Sipariş ver"}
        </button>
      </div>
    </article>
  );
}
