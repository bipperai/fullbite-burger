import { redirect } from "next/navigation";
import { AdminMenuPanel } from "@/components/AdminMenuPanel";
import { getAdminSession } from "@/lib/admin-session-server";
import { getMenu } from "@/lib/menu";

export default async function AdminMenuPage() {
  const session = await getAdminSession();
  if (!session) {
    redirect("/yonetim/giris");
  }

  const menu = await getMenu();

  return <AdminMenuPanel menu={menu} adminEmail={session.email} />;
}
