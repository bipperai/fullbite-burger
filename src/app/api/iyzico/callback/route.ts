import { NextResponse } from "next/server";
import { retrieveCheckout } from "@/lib/iyzico";
import { getOrder, updateOrder } from "@/lib/orders";

export async function POST(request: Request) {
  const form = await request.formData();
  const token = String(form.get("token") || "");
  const conversationId = String(form.get("conversationId") || "");
  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

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
