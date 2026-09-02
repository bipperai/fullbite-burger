import { redirect } from "next/navigation";
import { AdminOrdersPanel } from "@/components/AdminOrdersPanel";
import { getAdminSession } from "@/lib/admin-session-server";
import { getDeductionConfig } from "@/lib/order-deductions";
import { listOrders } from "@/lib/orders";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/yonetim/giris");
  }

  const orders = await listOrders();

  return (
    <AdminOrdersPanel
      orders={orders}
      adminEmail={session.email}
      deductionConfig={getDeductionConfig()}
    />
  );
}
