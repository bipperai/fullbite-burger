"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { useCart } from "./CartProvider";
import { MenuImage } from "./MenuImage";
import { formatTRY } from "@/lib/format";

type PaymentMethod = "iyzico" | "cod";

export function CheckoutForm() {
  const router = useRouter();
  const { items, setQuantity, remove, total, count } = useCart();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [iyzicoAvailable, setIyzicoAvailable] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");

  useEffect(() => {
    fetch("/api/payment-options")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { iyzico?: boolean } | null) => {
        const available = Boolean(data?.iyzico);
        setIyzicoAvailable(available);
        setPaymentMethod(available ? "iyzico" : "cod");
      })
      .catch(() => {
        setIyzicoAvailable(false);
        setPaymentMethod("cod");
      });
  }, []);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (count === 0) {
      setError("Sepetiniz boş.");
      return;
    }
    const form = new FormData(event.currentTarget);
    const fullName = String(form.get("fullName") || "").trim();
    const parts = fullName.split(/\s+/);
    const name = parts[0] || "";
    const surname = parts.slice(1).join(" ") || name;
    const phone = String(form.get("phone") || "").replace(/\s/g, "");
    setLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          paymentMethod,
          customer: {
            name,
            surname,
            email: `${phone.replace(/\D/g, "") || "siparis"}@fullbite.local`,
            phone,
            address: form.get("address"),
          },
          items: items.map((line) => ({
            id: line.id,
            name: line.product.name,
            price: line.product.price,
            quantity: line.quantity,
          })),
        }),
      });
      const data = (await response.json()) as {
        orderId?: string;
        paymentMethod?: PaymentMethod;
        error?: string;
      };
      if (!response.ok || !data.orderId) {
        throw new Error(data.error || "Sipariş oluşturulamadı.");
      }
      if (data.paymentMethod === "cod") {
        router.push(`/siparis/basarili?order=${data.orderId}&method=cod`);
        return;
      }
      router.push(`/odeme/${data.orderId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Bir hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  if (count === 0) {
    return (
      <div className="rounded-3xl border border-white/10 bg-[#1c1410] p-8 text-center">
        <p className="text-[#f6ead7]/70">Sepetin boş.</p>
        <Link
          href="/"
          className="mt-5 inline-block rounded-full bg-[#e8a317] px-6 py-3 text-sm font-semibold text-[#140e0a]"
        >
          Hamburgerlere dön
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <ul className="space-y-3">
        {items.map((line) => (
          <li
            key={line.id}
            className="flex items-center gap-3 rounded-2xl border border-white/10 bg-[#1c1410] p-3"
          >
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl">
              <MenuImage
                src={line.product.image}
                alt={line.product.name}
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate font-[family-name:var(--font-display)] text-lg">
                {line.product.name}
              </p>
              <p className="text-sm text-[#e8a317]">
                {formatTRY(line.product.price)}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setQuantity(line.id, line.quantity - 1)}
                className="h-8 w-8 rounded-full border border-white/20"
              >
                −
              </button>
              <span className="w-4 text-center">{line.quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity(line.id, line.quantity + 1)}
                className="h-8 w-8 rounded-full border border-white/20"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={() => remove(line.id)}
              className="text-xs text-[#f6ead7]/40"
            >
              Sil
            </button>
          </li>
        ))}
      </ul>

      <div className="space-y-4 rounded-2xl border border-white/10 bg-[#1c1410] p-5">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">Teslimat</h2>
        <input
          name="fullName"
          required
          placeholder="Ad soyad"
          className="w-full rounded-xl border border-white/10 bg-[#140e0a] px-4 py-3 text-[#f6ead7] outline-none focus:border-[#e8a317]"
        />
        <input
          name="phone"
          required
          placeholder="Telefon"
          className="w-full rounded-xl border border-white/10 bg-[#140e0a] px-4 py-3 text-[#f6ead7] outline-none focus:border-[#e8a317]"
        />
        <textarea
          name="address"
          required
          rows={2}
          placeholder="Adres"
          className="w-full rounded-xl border border-white/10 bg-[#140e0a] px-4 py-3 text-[#f6ead7] outline-none focus:border-[#e8a317]"
        />
      </div>

      <div className="space-y-3 rounded-2xl border border-white/10 bg-[#1c1410] p-5">
        <h2 className="font-[family-name:var(--font-display)] text-2xl">Ödeme</h2>
        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-[#140e0a] px-4 py-3">
          <input
            type="radio"
            name="payment"
            checked={paymentMethod === "cod"}
            onChange={() => setPaymentMethod("cod")}
          />
          <span className="text-sm text-[#f6ead7]">Kapıda ödeme (nakit/kart)</span>
        </label>
        {iyzicoAvailable ? (
          <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-[#140e0a] px-4 py-3">
            <input
              type="radio"
              name="payment"
              checked={paymentMethod === "iyzico"}
              onChange={() => setPaymentMethod("iyzico")}
            />
            <span className="text-sm text-[#f6ead7]">Kart ile öde (iyzico)</span>
          </label>
        ) : null}
      </div>

      {error ? <p className="text-sm text-[#ff8a75]">{error}</p> : null}

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#e8a317] py-4 text-sm font-semibold uppercase tracking-[0.16em] text-[#140e0a] disabled:opacity-60"
      >
        {loading
          ? "Hazırlanıyor..."
          : paymentMethod === "cod"
            ? `Sipariş ver · ${formatTRY(total)}`
            : `Öde · ${formatTRY(total)}`}
      </button>
    </form>
  );
}
