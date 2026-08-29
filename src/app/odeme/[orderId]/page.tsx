import { IyzicoCheckout } from "@/components/IyzicoCheckout";
import { getOrder } from "@/lib/orders";
import { notFound } from "next/navigation";

export default async function PaymentPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrder(orderId);
  if (!order?.checkoutFormContent) notFound();

  return (
    <div className="mx-auto max-w-4xl px-4 py-12">
      <p className="text-xs uppercase tracking-[0.28em] text-[#e8a317]">Güvenli ödeme</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl text-[#f6ead7]">
        iyzico ile öde
      </h1>
      <p className="mt-3 max-w-2xl text-sm text-[#f6ead7]/70">
        Kart bilgileriniz FullBite sunucularına gelmez; ödeme iyzico altyapısında
        tamamlanır.
      </p>
      <div className="mt-8">
        <IyzicoCheckout
          html={order.checkoutFormContent}
          paymentPageUrl={order.paymentPageUrl}
        />
      </div>
    </div>
  );
}
