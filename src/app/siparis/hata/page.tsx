import Link from "next/link";

export default async function FailPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center">
      <p className="text-xs uppercase tracking-[0.28em] text-[#ff8a75]">Ödeme tamamlanmadı</p>
      <h1 className="mt-3 font-[family-name:var(--font-display)] text-5xl text-[#f6ead7]">
        Bir şeyler ters gitti
      </h1>
      <p className="mt-4 text-[#f6ead7]/70">
        iyzico ödemesi alınamadı. Sepetin duruyor; tekrar deneyebilirsin.
      </p>
      {reason ? (
        <p className="mt-4 text-sm text-[#f6ead7]/50">{reason}</p>
      ) : null}
      <Link
        href="/siparis"
        className="mt-10 inline-block rounded-full bg-[#e8a317] px-6 py-3 text-sm font-semibold uppercase tracking-[0.18em] text-[#140e0a]"
      >
        Tekrar dene
      </Link>
    </div>
  );
}
