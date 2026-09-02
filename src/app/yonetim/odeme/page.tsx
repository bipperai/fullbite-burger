import { redirect } from "next/navigation";
import { AdminPaymentPanel } from "@/components/AdminPaymentPanel";
import { getAdminSession } from "@/lib/admin-session-server";

export default async function AdminPaymentPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/yonetim/giris");
  }

  return <AdminPaymentPanel adminEmail={session.email} />;
}
