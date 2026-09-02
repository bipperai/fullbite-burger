"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminNav } from "./AdminNav";
import { IyzicoStatusBanner } from "./IyzicoStatusBanner";
import { formatTRY } from "@/lib/format";
import {
  computeRevenueBreakdown,
  type DeductionConfig,
} from "@/lib/order-deductions";
import {
  computeOrderStats,
  filterOrdersByPeriod,
  orderMatchesSearch,
  type OrderPeriod,
} from "@/lib/order-stats";
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

type StatusFilter = "all" | Order["status"];

type Props = {
  orders: Order[];
  adminEmail: string;
  deductionConfig: DeductionConfig;
};

export function AdminOrdersPanel({
  orders,
  adminEmail,
  deductionConfig,
}: Props) {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [period, setPeriod] = useState<OrderPeriod>("all");
  const [search, setSearch] = useState("");

  const stats = useMemo(
    () => computeOrderStats(orders, deductionConfig),
    [orders, deductionConfig],
  );

  const filtered = useMemo(() => {
    let list = filterOrdersByPeriod(orders, period);
    if (statusFilter !== "all") {
      list = list.filter((order) => order.status === statusFilter);
    }
    if (search.trim()) {
      list = list.filter((order) => orderMatchesSearch(order, search));
    }
    return list;
  }, [orders, period, search, statusFilter]);

  const filteredBreakdown = useMemo(() => {
    const paidInView = filtered.filter((order) => order.status === "paid");
    const gross = paidInView.reduce((sum, order) => sum + order.total, 0);
    return computeRevenueBreakdown(gross, paidInView.length, deductionConfig);
  }, [filtered, deductionConfig]);

  async function logout() {
    await fetch("/api/yonetim/cikis", { method: "POST" });
    router.replace("/yonetim/giris");
    router.refresh();
  }

  const statusFilters: { id: StatusFilter; label: string; count: number }[] = [
    { id: "all", label: "Tümü", count: stats.totalOrders },
    { id: "paid", label: "Ödendi", count: stats.paidCount },
    { id: "pending", label: "Bekliyor", count: stats.pendingCount },
    { id: "failed", label: "Başarısız", count: stats.failedCount },
  ];

  const periods: { id: OrderPeriod; label: string }[] = [
    { id: "all", label: "Tüm zamanlar" },
    { id: "today", label: "Bugün" },
    { id: "week", label: "Bu hafta" },
    { id: "month", label: "Bu ay" },
  ];

  const commissionLabel = `iyzico (%${deductionConfig.iyzicoCommissionRate}${
    deductionConfig.iyzicoFixedFee > 0
      ? ` + ${formatTRY(deductionConfig.iyzicoFixedFee)}/işlem`
      : ""
  })`;

  return (
    <div className="pb-10">
      <AdminNav adminEmail={adminEmail} onLogout={logout} />
      <IyzicoStatusBanner />

      <div className="mx-auto mt-8 max-w-6xl px-4">
        <p className="text-sm text-[#f6ead7]/55">
          Brüt tutarlar ödenen siparişlerden; net kazanç KDV (%{deductionConfig.vatRate}), maliyet
          (%{deductionConfig.costRate}) ve {commissionLabel} düşüldükten sonra.
        </p>

        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <RevenuePeriodCard
            label="Bu hafta"
            breakdown={stats.week}
            vatRate={deductionConfig.vatRate}
            costRate={deductionConfig.costRate}
            commissionLabel={commissionLabel}
            accent
          />
          <RevenuePeriodCard
            label="Bu ay"
            breakdown={stats.month}
            vatRate={deductionConfig.vatRate}
            costRate={deductionConfig.costRate}
            commissionLabel={commissionLabel}
          />
          <RevenuePeriodCard
            label="Toplam"
            breakdown={stats.allTime}
            vatRate={deductionConfig.vatRate}
            costRate={deductionConfig.costRate}
            commissionLabel={commissionLabel}
          />
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MiniStat
            label="Bugün net"
            value={formatTRY(stats.today.net)}
            hint={`Brüt ${formatTRY(stats.today.gross)} · ${stats.today.paidCount} ödeme`}
          />
          <MiniStat
            label="Ortalama sepet"
            value={formatTRY(stats.averagePaidOrder)}
            hint="Ödenen siparişler (brüt)"
          />
          <MiniStat
            label="Bekleyen tutar"
            value={formatTRY(stats.pendingAmount)}
            hint={`${stats.pendingCount} sipariş henüz ödenmedi`}
          />
          <MiniStat
            label="Toplam sipariş"
            value={String(stats.totalOrders)}
            hint={`${stats.failedCount} başarısız`}
          />
        </div>

        <div className="mt-8 space-y-4 rounded-3xl border border-white/10 bg-[#1c1410] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex-1">
              <label
                htmlFor="order-search"
                className="text-xs uppercase tracking-[0.18em] text-[#f6ead7]/45"
              >
                Ara
              </label>
              <input
                id="order-search"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="İsim, e-posta, telefon veya sipariş no…"
                className="mt-2 w-full rounded-2xl border border-white/10 bg-[#140e0a] px-4 py-3 text-sm text-[#f6ead7] placeholder:text-[#f6ead7]/35 outline-none focus:border-[#e8a317]/50"
              />
            </div>
            <div className="lg:min-w-[280px]">
              <p className="text-xs uppercase tracking-[0.18em] text-[#f6ead7]/45">
                Dönem
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {periods.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setPeriod(item.id)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                      period === item.id
                        ? "bg-[#e8a317] text-[#140e0a]"
                        : "border border-white/10 text-[#f6ead7]/75 hover:border-[#e8a317]/40"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 border-t border-white/10 pt-4">
            {statusFilters.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setStatusFilter(item.id)}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  statusFilter === item.id
                    ? "bg-[#e8a317] text-[#140e0a]"
                    : "border border-white/10 text-[#f6ead7]/75 hover:border-[#e8a317]/40"
                }`}
              >
                {item.label} · {item.count}
              </button>
            ))}
          </div>

          {(search.trim() || period !== "all" || statusFilter !== "all") && (
            <FilteredSummary
              count={filtered.length}
              breakdown={filteredBreakdown}
              vatRate={deductionConfig.vatRate}
              costRate={deductionConfig.costRate}
              commissionLabel={commissionLabel}
            />
          )}
        </div>

        {filtered.length === 0 ? (
          <div className="mt-6 rounded-3xl border border-white/10 bg-[#1c1410] p-10 text-center text-[#f6ead7]/70">
            {orders.length === 0
              ? "Henüz sipariş yok."
              : "Arama veya filtreye uygun sipariş yok."}
          </div>
        ) : (
          <div className="mt-6 space-y-5">
            {filtered.map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RevenuePeriodCard({
  label,
  breakdown,
  vatRate,
  costRate,
  commissionLabel,
  accent,
}: {
  label: string;
  breakdown: import("@/lib/order-deductions").RevenueBreakdown;
  vatRate: number;
  costRate: number;
  commissionLabel: string;
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
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-xs uppercase tracking-[0.18em] text-[#f6ead7]/45">
          {label}
        </p>
        <p className="text-xs text-[#f6ead7]/45">{breakdown.paidCount} ödeme</p>
      </div>
      <p
        className={`mt-3 font-[family-name:var(--font-display)] text-3xl italic ${
          accent ? "text-[#e8a317]" : "text-[#f6ead7]"
        }`}
      >
        {formatTRY(breakdown.net)}
      </p>
      <p className="mt-1 text-sm text-[#f6ead7]/55">Net kazanç</p>

      <dl className="mt-4 space-y-2 border-t border-white/10 pt-4 text-sm">
        <div className="flex justify-between gap-3">
          <dt className="text-[#f6ead7]/55">Brüt</dt>
          <dd className="text-[#f6ead7]">{formatTRY(breakdown.gross)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-[#f6ead7]/55">KDV (%{vatRate})</dt>
          <dd className="text-[#ff8a75]">−{formatTRY(breakdown.vat)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-[#f6ead7]/55">Maliyet (%{costRate})</dt>
          <dd className="text-[#ff8a75]">−{formatTRY(breakdown.productCost)}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-[#f6ead7]/55">{commissionLabel}</dt>
          <dd className="text-[#ff8a75]">−{formatTRY(breakdown.iyzicoCommission)}</dd>
        </div>
      </dl>
    </div>
  );
}

function FilteredSummary({
  count,
  breakdown,
  vatRate,
  costRate,
  commissionLabel,
}: {
  count: number;
  breakdown: import("@/lib/order-deductions").RevenueBreakdown;
  vatRate: number;
  costRate: number;
  commissionLabel: string;
}) {
  return (
    <div className="rounded-2xl border border-[#e8a317]/20 bg-[#e8a317]/5 p-4 text-sm">
      <p className="font-medium text-[#f6ead7]">
        Filtre sonucu: {count} sipariş
        {breakdown.paidCount > 0 && (
          <>
            {" "}
            · {breakdown.paidCount} ödenen · net{" "}
            <span className="text-[#e8a317]">{formatTRY(breakdown.net)}</span>
          </>
        )}
      </p>
      {breakdown.paidCount > 0 && (
        <p className="mt-1 text-[#f6ead7]/55">
          Brüt {formatTRY(breakdown.gross)} · KDV −{formatTRY(breakdown.vat)} · Maliyet −
          {formatTRY(breakdown.productCost)} · {commissionLabel} −
          {formatTRY(breakdown.iyzicoCommission)}
        </p>
      )}
    </div>
  );
}

function MiniStat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-[#1c1410] p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-[#f6ead7]/45">
        {label}
      </p>
      <p className="mt-2 font-[family-name:var(--font-display)] text-2xl italic text-[#f6ead7]">
        {value}
      </p>
      <p className="mt-2 text-sm text-[#f6ead7]/55">{hint}</p>
    </div>
  );
}

function OrderCard({ order }: { order: Order }) {
  return (
    <article className="rounded-3xl border border-white/10 bg-[#1c1410] p-5 sm:p-6">
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
          <dd className="mt-1 text-sm text-[#f6ead7]">{order.customer.phone}</dd>
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
  );
}
