"use client";

import { useRouter } from "next/navigation";
import { formatTRY } from "@/lib/format";
import type { Order } from "@/lib/orders";

const STATUS_LABEL: Record<Order["status"], string> = {
  pending: "Bekliyor",
  paid: "Ödendi",
  failed: "Başarısız",
};

const STATUS_CLASS: Record<Order["status"], string> = {
  pending: "bg-[#e8a317]/15 text-[#e8a317]",
  paid: "bg-emerald-500/15 text-emerald-300",
  failed: "bg-[#c23c22]/15 text-[#ff8a75]",
};

type Props = {
  orders: Order[];
  adminEmail: string;
};

export function AdminOrdersPanel({ orders, adminEmail }: Props) {
  const router = useRouter();

  async function logout() {
    await fetch("/api/yonetim/cikis", { method: "POST" });
    router.replace("/yonetim/giris");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#e8a317]">
            Yönetim
          </p>
          <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl italic text-[#f6ead7]">
            Siparişler
          </h1>
          <p className="mt-2 text-sm text-[#f6ead7]/60">
            Giriş: {adminEmail}
          </p>
        </div>
        <button
          type="button"
          onClick={logout}
          className="rounded-full border border-white/15 px-5 py-2 text-sm text-[#f6ead7]/80 hover:border-[#e8a317]/40 hover:text-[#e8a317]"
        >
          Çıkış
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-white/10 bg-[#1c1410] p-10 text-center text-[#f6ead7]/70">
          Henüz sipariş yok.
        </div>
      ) : (
        <div className="mt-10 space-y-5">
          {orders.map((order) => (
            <article
              key={order.id}
              className="rounded-3xl border border-white/10 bg-[#1c1410] p-5 sm:p-6"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[#f6ead7]/45">
                    {new Date(order.createdAt).toLocaleString("tr-TR")}
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-display)] text-2xl italic text-[#f6ead7]">
                    {order.customer.name} {order.customer.surname}
                  </p>
                  <p className="mt-1 break-all text-sm text-[#f6ead7]/55">
                    Sipariş no: {order.id}
                  </p>
                </div>
                <div className="text-right">
                  <span
                    className={`inline-block rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider ${STATUS_CLASS[order.status]}`}
                  >
                    {STATUS_LABEL[order.status]}
                  </span>
                  <p className="mt-2 font-[family-name:var(--font-display)] text-2xl text-[#e8a317]">
                    {formatTRY(order.total)}
                  </p>
                </div>
              </div>

              <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div>
                  <dt className="text-xs uppercase tracking-[0.18em] text-[#f6ead7]/45">
                    E-posta
                  </dt>
                  <dd className="mt-1 break-all text-sm text-[#f6ead7]">
                    {order.customer.email}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs uppercase tracking-[0.18em] text-[#f6ead7]/45">
                    Telefon
                  </dt>
                  <dd className="mt-1 text-sm text-[#f6ead7]">
                    {order.customer.phone}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-xs uppercase tracking-[0.18em] text-[#f6ead7]/45">
                    Adres
                  </dt>
                  <dd className="mt-1 text-sm leading-6 text-[#f6ead7]">
                    {order.customer.address}
                    {order.customer.city ? ` · ${order.customer.city}` : ""}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 rounded-2xl border border-white/10 bg-[#140e0a]/70 p-4">
                <p className="text-xs uppercase tracking-[0.18em] text-[#f6ead7]/45">
                  Ürünler
                </p>
                <ul className="mt-3 space-y-2">
                  {order.items.map((item) => (
                    <li
                      key={`${order.id}-${item.id}`}
                      className="flex items-center justify-between gap-3 text-sm"
                    >
                      <span className="text-[#f6ead7]">
                        {item.quantity}× {item.name}
                      </span>
                      <span className="text-[#e8a317]">
                        {formatTRY(item.price * item.quantity)}
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 flex flex-wrap gap-4 border-t border-white/10 pt-4 text-sm text-[#f6ead7]/70">
                  <span>Ara toplam: {formatTRY(order.subtotal)}</span>
                  <span>Teslimat: {formatTRY(order.deliveryFee)}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
