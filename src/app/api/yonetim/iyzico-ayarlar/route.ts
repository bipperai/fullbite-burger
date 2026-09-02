import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session-server";
import { saveIyzicoCredentials } from "@/lib/iyzico-credentials-store";

type Body = {
  apiKey?: string;
  secretKey?: string;
  baseUrl?: string;
};

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = (await request.json()) as Body;
  const apiKey = String(body.apiKey || "").trim();
  const secretKey = String(body.secretKey || "").trim();
  const baseUrl = String(body.baseUrl || "https://api.iyzipay.com").trim();

  if (!apiKey || !secretKey) {
    return NextResponse.json(
      { error: "API Key ve Secret Key zorunlu." },
      { status: 400 },
    );
  }

  await saveIyzicoCredentials({ apiKey, secretKey, baseUrl });

  return NextResponse.json({ ok: true });
}
