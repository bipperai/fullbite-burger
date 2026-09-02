import type { Order } from "./orders";
import {
  computeRevenueBreakdown,
  type DeductionConfig,
  type RevenueBreakdown,
} from "./order-deductions";

export type OrderPeriod = "all" | "today" | "week" | "month";

export type OrderStats = {
  totalOrders: number;
  paidCount: number;
  pendingCount: number;
  failedCount: number;
  totalRevenue: number;
  pendingAmount: number;
  today: RevenueBreakdown;
  week: RevenueBreakdown;
  month: RevenueBreakdown;
  allTime: RevenueBreakdown;
  averagePaidOrder: number;
};

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfWeek(date = new Date()) {
  const d = startOfDay(date);
  const day = d.getDay();
  const daysFromMonday = day === 0 ? 6 : day - 1;
  d.setDate(d.getDate() - daysFromMonday);
  return d;
}

function startOfMonth(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getPeriodStart(period: Exclude<OrderPeriod, "all">, date = new Date()) {
  if (period === "today") return startOfDay(date);
  if (period === "week") return startOfWeek(date);
  return startOfMonth(date);
}

export function filterOrdersByPeriod(orders: Order[], period: OrderPeriod) {
  if (period === "all") return orders;
  const start = getPeriodStart(period);
  return orders.filter((order) => new Date(order.createdAt) >= start);
}

export function orderMatchesSearch(order: Order, query: string) {
  const q = query.trim().toLocaleLowerCase("tr-TR");
  if (!q) return true;

  const haystack = [
    order.id,
    order.customer.name,
    order.customer.surname,
    `${order.customer.name} ${order.customer.surname}`,
    order.customer.email,
    order.customer.phone,
    order.customer.address,
    order.customer.city,
    order.customer.district,
  ]
    .join(" ")
    .toLocaleLowerCase("tr-TR");

  return haystack.includes(q);
}

function breakdownForPaidOrders(
  paid: Order[],
  config: DeductionConfig,
): RevenueBreakdown {
  const gross = paid.reduce((sum, order) => sum + order.total, 0);
  return computeRevenueBreakdown(gross, paid.length, config);
}

export function computeOrderStats(
  orders: Order[],
  config: DeductionConfig,
): OrderStats {
  const paid = orders.filter((order) => order.status === "paid");
  const pending = orders.filter((order) => order.status === "pending");
  const failed = orders.filter((order) => order.status === "failed");

  const totalRevenue = paid.reduce((sum, order) => sum + order.total, 0);
  const pendingAmount = pending.reduce((sum, order) => sum + order.total, 0);

  const todayStart = startOfDay();
  const weekStart = startOfWeek();
  const monthStart = startOfMonth();

  const todayPaid = paid.filter(
    (order) => new Date(order.createdAt) >= todayStart,
  );
  const weekPaid = paid.filter(
    (order) => new Date(order.createdAt) >= weekStart,
  );
  const monthPaid = paid.filter(
    (order) => new Date(order.createdAt) >= monthStart,
  );

  return {
    totalOrders: orders.length,
    paidCount: paid.length,
    pendingCount: pending.length,
    failedCount: failed.length,
    totalRevenue,
    pendingAmount,
    today: breakdownForPaidOrders(todayPaid, config),
    week: breakdownForPaidOrders(weekPaid, config),
    month: breakdownForPaidOrders(monthPaid, config),
    allTime: breakdownForPaidOrders(paid, config),
    averagePaidOrder: paid.length ? totalRevenue / paid.length : 0,
  };
}
