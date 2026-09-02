import { NextResponse } from "next/server";
import { isIyzicoConfigured } from "@/lib/iyzico-config";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json({
    iyzico: await isIyzicoConfigured(),
    cod: true,
  });
}
