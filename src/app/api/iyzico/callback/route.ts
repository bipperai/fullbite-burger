import { NextResponse } from "next/server";
import { retrieveCheckout } from "@/lib/iyzico";
import { getPublicBaseUrl } from "@/lib/iyzico-config";
import { getOrder, updateOrder } from "@/lib/orders";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const form = await request.formData();
  const token = String(form.get("token") || "");
  const conversationId = String(form.get("conversationId") || "");
  const base = getPublicBaseUrl();

  if (!token) {
    return NextResponse.redirect(`${base}/siparis/hata?reason=token`);
  }

  const pending =
    (conversationId && (await getOrder(conversationId))) ||
    null;

  const result = await retrieveCheckout(token, pending?.id || conversationId || "na");

  if (result.status === "success" && result.paymentStatus === "SUCCESS") {
    const orderId = result.basketId || pending?.id;
    if (orderId) {
      await updateOrder(orderId, {
        status: "paid",
        paymentId: result.paymentId,
      });
    }
    return NextResponse.redirect(
      `${base}/siparis/basarili?order=${orderId || ""}&payment=${result.paymentId || ""}`,
    );
  }

  const orderId = result.basketId || pending?.id;
  if (orderId) {
    await updateOrder(orderId, {
      status: "failed",
      paymentError: result.errorMessage || result.paymentStatus || "failed",
    });
  }

  return NextResponse.redirect(
    `${base}/siparis/hata?reason=${encodeURIComponent(result.errorMessage || result.paymentStatus || "failed")}`,
  );
}
