import type { Order } from "./orders";

export type OrderStats = {
  totalOrders: number;
  paidCount: number;
  pendingCount: number;
  failedCount: number;
  totalRevenue: number;
  pendingAmount: number;
  todayRevenue: number;
  todayPaidCount: number;
  monthRevenue: number;
  monthPaidCount: number;
  averagePaidOrder: number;
};

function startOfDay(date = new Date()) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function startOfMonth(date = new Date()) {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function computeOrderStats(orders: Order[]): OrderStats {
  const paid = orders.filter((order) => order.status === "paid");
  const pending = orders.filter((order) => order.status === "pending");
  const failed = orders.filter((order) => order.status === "failed");

  const totalRevenue = paid.reduce((sum, order) => sum + order.total, 0);
  const pendingAmount = pending.reduce((sum, order) => sum + order.total, 0);

  const todayStart = startOfDay();
  const monthStart = startOfMonth();

  const todayPaid = paid.filter(
    (order) => new Date(order.createdAt) >= todayStart,
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
    todayRevenue: todayPaid.reduce((sum, order) => sum + order.total, 0),
    todayPaidCount: todayPaid.length,
    monthRevenue: monthPaid.reduce((sum, order) => sum + order.total, 0),
    monthPaidCount: monthPaid.length,
    averagePaidOrder: paid.length ? totalRevenue / paid.length : 0,
  };
}
