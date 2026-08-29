import { CheckoutForm } from "@/components/CheckoutForm";
import Image from "next/image";

export default function OrderPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-12">
      <div className="relative mb-8 overflow-hidden rounded-3xl border border-white/10">
        <div className="relative aspect-[16/8]">
          <Image
            src="/food/box.jpg"
            alt="FullBite sipariş"
            fill
            className="object-cover"
            sizes="576px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140e0a] to-transparent" />
        </div>
        <div className="absolute bottom-4 left-5 right-5">
          <h1 className="font-[family-name:var(--font-display)] text-4xl italic text-[#f6ead7]">
            Sipariş
          </h1>
          <p className="mt-1 text-sm text-[#f6ead7]/75">
            Sepetini kontrol et, adresini yaz, öde.
          </p>
        </div>
      </div>
      <CheckoutForm />
    </div>
  );
}
