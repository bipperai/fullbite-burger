import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

export type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

export type Customer = {
  name: string;
  surname: string;
  email: string;
  phone: string;
  identityNumber: string;
  city: string;
  district: string;
  address: string;
  note?: string;
};

export type Order = {
  id: string;
  createdAt: string;
  status: "pending" | "paid" | "failed";
  paymentMethod?: "iyzico" | "cod";
  customer: Customer;
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  checkoutFormContent?: string;
  paymentPageUrl?: string;
  iyzicoToken?: string;
  paymentId?: string;
  paymentError?: string;
};

const filePath = path.join(process.cwd(), ".data", "orders.json");

async function readAll(): Promise<Record<string, Order>> {
  try {
    const raw = await readFile(filePath, "utf8");
    return JSON.parse(raw) as Record<string, Order>;
  } catch {
    return {};
  }
}

async function writeAll(orders: Record<string, Order>) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(orders, null, 2), "utf8");
}

export async function saveOrder(order: Order) {
  const orders = await readAll();
  orders[order.id] = order;
  await writeAll(orders);
}

export async function getOrder(id: string) {
  const orders = await readAll();
  return orders[id] ?? null;
}

export async function updateOrder(id: string, patch: Partial<Order>) {
  const orders = await readAll();
  const current = orders[id];
  if (!current) return null;
  const next = { ...current, ...patch };
  orders[id] = next;
  await writeAll(orders);
  return next;
}

export async function listOrders() {
  const orders = await readAll();
  return Object.values(orders).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
