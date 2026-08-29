import Link from "next/link";
import { ClearCartOnSuccess } from "@/components/ClearCartOnSuccess";

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string; payment?: string }>;
}) {
  const { order, payment } = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <ClearCartOnSuccess />
      <p className="text-xs uppercase tracking-[0.28em] text-[#e8a317]">Ödeme alındı</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl text-[#f6ead7]">
        Afiyet olsun
      </h1>
      <p className="mt-4 text-[#f6ead7]/70">
        Siparişin iyzico üzerinden onaylandı. Mutfak hazırlığa geçti.
      </p>
      {order ? (
        <p className="mt-6 text-sm text-[#f6ead7]/50">Sipariş no: {order}</p>
      ) : null}
      {payment ? (
        <p className="text-sm text-[#f6ead7]/50">Ödeme no: {payment}</p>
      ) : null}
      <Link
        href="/"
        className="mt-10 inline-block rounded-full bg-[#e8a317] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#140e0a]"
      >
        Yeni sipariş
      </Link>
    </div>
  );
}
