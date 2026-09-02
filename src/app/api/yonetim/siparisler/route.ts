import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session-server";
import { listOrders } from "@/lib/orders";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const orders = await listOrders();
  return NextResponse.json({ orders, adminEmail: session.email });
}
