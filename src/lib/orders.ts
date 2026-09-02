import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { getRedis } from "./redis";

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

const REDIS_ORDERS_KEY = "fullbite:orders";
const REDIS_ORDER_INDEX_KEY = "fullbite:order-ids";

function getOrdersPath() {
  if (process.env.VERCEL) {
    return "/tmp/fullbite-orders.json";
  }
  return path.join(process.cwd(), ".data", "orders.json");
}

async function readAllFromFile(): Promise<Record<string, Order>> {
  try {
    const raw = await readFile(getOrdersPath(), "utf8");
    return JSON.parse(raw) as Record<string, Order>;
  } catch {
    return {};
  }
}

async function writeAllToFile(orders: Record<string, Order>) {
  const filePath = getOrdersPath();
  if (!process.env.VERCEL) {
    await mkdir(path.dirname(filePath), { recursive: true });
  }
  await writeFile(filePath, JSON.stringify(orders, null, 2), "utf8");
}

async function saveOrderToRedis(order: Order) {
  const redis = getRedis();
  if (!redis) return;

  await redis.hset(REDIS_ORDERS_KEY, { [order.id]: order });
  await redis.zadd(REDIS_ORDER_INDEX_KEY, {
    score: new Date(order.createdAt).getTime(),
    member: order.id,
  });
}

export async function saveOrder(order: Order) {
  const redis = getRedis();
  if (redis) {
    await saveOrderToRedis(order);
    return;
  }

  const orders = await readAllFromFile();
  orders[order.id] = order;
  await writeAllToFile(orders);
}

export async function getOrder(id: string) {
  const redis = getRedis();
  if (redis) {
    return (await redis.hget<Order>(REDIS_ORDERS_KEY, id)) ?? null;
  }

  const orders = await readAllFromFile();
  return orders[id] ?? null;
}

export async function updateOrder(id: string, patch: Partial<Order>) {
  const redis = getRedis();
  if (redis) {
    const current = await redis.hget<Order>(REDIS_ORDERS_KEY, id);
    if (!current) return null;
    const next = { ...current, ...patch };
    await redis.hset(REDIS_ORDERS_KEY, { [id]: next });
    return next;
  }

  const orders = await readAllFromFile();
  const current = orders[id];
  if (!current) return null;
  const next = { ...current, ...patch };
  orders[id] = next;
  await writeAllToFile(orders);
  return next;
}

export async function listOrders() {
  const redis = getRedis();
  if (redis) {
    const ids = await redis.zrange<string[]>(REDIS_ORDER_INDEX_KEY, 0, -1, {
      rev: true,
    });
    if (!ids.length) return [];

    const orders: Order[] = [];
    for (const id of ids) {
      const order = await redis.hget<Order>(REDIS_ORDERS_KEY, id);
      if (order) orders.push(order);
    }
    return orders;
  }

  const orders = await readAllFromFile();
  return Object.values(orders).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
