import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session-server";
import { getIyzicoEnvStatus } from "@/lib/iyzico-config";
import { probeIyzicoEnv } from "@/lib/iyzico-credentials-store";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  return NextResponse.json({
    ...(await getIyzicoEnvStatus()),
    probe: probeIyzicoEnv(),
  });
}
