import { cookies } from "next/headers";
import { parseSessionToken } from "@/lib/admin-auth";

export async function getAdminSession() {
  const store = await cookies();
  const token = store.get("fullbite-admin")?.value;
  return parseSessionToken(token);
}
