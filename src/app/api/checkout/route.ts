import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { initializeCheckout, isIyzicoConfigured } from "@/lib/iyzico";
import { saveOrder, type Customer, type OrderItem } from "@/lib/orders";
import { deliveryFeeFor, getMenuItem } from "@/lib/menu";

type Body = {
  customer: Customer;
  items: OrderItem[];
};

export async function POST(request: Request) {
  try {
    if (!isIyzicoConfigured()) {
      return NextResponse.json(
        {
          error:
            "iyzico anahtarları eksik. .env.local içine IYZI_API_KEY ve IYZI_SECRET_KEY ekleyin.",
        },
        { status: 500 },
      );
    }

    const body = (await request.json()) as Body;
    if (!body.customer?.name || !body.customer?.phone || !body.customer?.address || !body.items?.length) {
      return NextResponse.json({ error: "Eksik sipariş bilgisi." }, { status: 400 });
    }

    const items = body.items
      .map((line) => {
        const product = getMenuItem(line.id);
        if (!product) return null;
        return {
          id: product.id,
          name: product.name,
          price: product.price,
          quantity: Math.max(1, Number(line.quantity) || 1),
        };
      })
      .filter((line): line is OrderItem => Boolean(line));

    if (!items.length) {
      return NextResponse.json({ error: "Sepet geçersiz." }, { status: 400 });
    }

    const subtotal = items.reduce((sum, line) => sum + line.price * line.quantity, 0);
    const deliveryFee = deliveryFeeFor(subtotal);
    const total = Number((subtotal + deliveryFee).toFixed(2));
    const phone = String(body.customer.phone).replace(/\s/g, "");
    const gsmNumber = phone.startsWith("+") ? phone : `+90${phone.replace(/^0/, "")}`;

    const order = {
      id: randomUUID(),
      createdAt: new Date().toISOString(),
      status: "pending" as const,
      customer: {
        name: body.customer.name,
        surname: body.customer.surname || body.customer.name,
        email:
          body.customer.email ||
          `${phone.replace(/\D/g, "") || "siparis"}@fullbite.local`,
        phone: gsmNumber,
        identityNumber: body.customer.identityNumber || "74300864791",
        city: body.customer.city || "İstanbul",
        district: body.customer.district || "—",
        address: body.customer.address,
        note: body.customer.note,
      },
      items,
      subtotal,
      deliveryFee,
      total,
    };

    const forwarded = request.headers.get("x-forwarded-for");
    const ip = forwarded?.split(",")[0]?.trim() || "85.34.78.112";
    const result = await initializeCheckout(order, ip);

    if (result.status !== "success") {
      return NextResponse.json(
        { error: result.errorMessage || "iyzico ödeme formu oluşturulamadı." },
        { status: 400 },
      );
    }

    await saveOrder({
      ...order,
      checkoutFormContent: result.checkoutFormContent,
      paymentPageUrl: result.paymentPageUrl,
      iyzicoToken: result.token,
    });

    return NextResponse.json({ orderId: order.id });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sunucu hatası";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
