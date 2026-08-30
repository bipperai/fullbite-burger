import { CheckoutForm } from "@/components/CheckoutForm";

export default function OrderPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <h1 className="font-[family-name:var(--font-display)] text-4xl italic text-[#f6ead7]">
        Sipariş
      </h1>
      <p className="mt-2 text-[#f6ead7]/70">Sepetini kontrol et, adresini yaz, öde.</p>
      <div className="mt-8">
        <CheckoutForm />
      </div>
    </div>
  );
}
