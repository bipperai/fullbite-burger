import { NextResponse } from "next/server";
import {
  adminCookieOptions,
  createSessionToken,
  getAdminUsers,
  verifyAdminCredentials,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!getAdminUsers().length) {
    return NextResponse.json(
      { error: "Yönetim hesapları yapılandırılmamış." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as { email?: string; password?: string };
  const email = String(body.email || "").trim();
  const password = String(body.password || "");

  if (!email || !password) {
    return NextResponse.json(
      { error: "E-posta ve şifre gerekli." },
      { status: 400 },
    );
  }

  if (!verifyAdminCredentials(email, password)) {
    return NextResponse.json(
      { error: "E-posta veya şifre hatalı." },
      { status: 401 },
    );
  }

  try {
    const token = await createSessionToken(email);
    const response = NextResponse.json({ ok: true });
    response.cookies.set(adminCookieOptions(token));
    return response;
  } catch {
    return NextResponse.json(
      { error: "Oturum oluşturulamadı. ADMIN_SESSION_SECRET kontrol edin." },
      { status: 500 },
    );
  }
}
