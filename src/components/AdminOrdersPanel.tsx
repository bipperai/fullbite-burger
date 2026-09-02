"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminNav } from "./AdminNav";
import { formatTRY } from "@/lib/format";
import { computeOrderStats } from "@/lib/order-stats";
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

type Filter = "all" | Order["status"];

type Props = {
  orders: Order[];
  adminEmail: string;
};

export function AdminOrdersPanel({ orders, adminEmail }: Props) {
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>("all");

  const stats = useMemo(() => computeOrderStats(orders), [orders]);

  const filtered = useMemo(() => {
    if (filter === "all") return orders;
    return orders.filter((order) => order.status === filter);
  }, [filter, orders]);

  async function logout() {
    await fetch("/api/yonetim/cikis", { method: "POST" });
    router.replace("/yonetim/giris");
    router.refresh();
  }

  const filters: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "Tümü", count: stats.totalOrders },
    { id: "paid", label: "Ödendi", count: stats.paidCount },
    { id: "pending", label: "Bekliyor", count: stats.pendingCount },
    { id: "failed", label: "Başarısız", count: stats.failedCount },
  ];

  return (
    <div className="pb-10">
      <AdminNav adminEmail={adminEmail} onLogout={logout} />

      <div className="mx-auto mt-8 max-w-6xl px-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="Toplam kazanç"
            value={formatTRY(stats.totalRevenue)}
            hint={`${stats.paidCount} ödenen sipariş`}
            accent
          />
          <StatCard
            label="Bugün"
            value={formatTRY(stats.todayRevenue)}
            hint={`${stats.todayPaidCount} ödeme`}
          />
          <StatCard
            label="Bu ay"
            value={formatTRY(stats.monthRevenue)}
            hint={`${stats.monthPaidCount} ödeme`}
          />
          <StatCard
            label="Ortalama sepet"
            value={formatTRY(stats.averagePaidOrder)}
            hint="Ödenen siparişler"
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <StatCard
            label="Bekleyen tutar"
            value={formatTRY(stats.pendingAmount)}
            hint={`${stats.pendingCount} sipariş henüz ödenmedi`}
          />
          <StatCard
            label="Toplam sipariş"
            value={String(stats.totalOrders)}
            hint="Geçmiş + aktif"
          />
          <StatCard
            label="Başarısız"
            value={String(stats.failedCount)}
            hint="Ödeme tamamlanmadı"
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setFilter(item.id)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                filter === item.id
                  ? "bg-[#e8a317] text-[#140e0a]"
                  : "border border-white/10 text-[#f6ead7]/75 hover:border-[#e8a317]/40"
              }`}
            >
              {item.label} · {item.count}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-white/10 bg-[#1c1410] p-10 text-center text-[#f6ead7]/70">
            {orders.length === 0
              ? "Henüz sipariş yok."
              : "Bu filtrede sipariş yok."}
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {filtered.map((order) => (
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
                    <p className="mt-1 text-xs text-[#f6ead7]/45">
                      Ürün {formatTRY(order.subtotal)} · Teslimat{" "}
                      {formatTRY(order.deliveryFee)}
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
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-3xl border p-5 ${
        accent
          ? "border-[#e8a317]/35 bg-[#e8a317]/10"
          : "border-white/10 bg-[#1c1410]"
      }`}
    >
      <p className="text-xs uppercase tracking-[0.18em] text-[#f6ead7]/45">
        {label}
      </p>
      <p
        className={`mt-2 font-[family-name:var(--font-display)] text-3xl italic ${
          accent ? "text-[#e8a317]" : "text-[#f6ead7]"
        }`}
      >
        {value}
      </p>
      <p className="mt-2 text-sm text-[#f6ead7]/55">{hint}</p>
    </div>
  );
}
