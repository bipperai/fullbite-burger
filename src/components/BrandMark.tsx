import Image from "next/image";
import Link from "next/link";

export function BrandMark({ size = "md" }: { size?: "md" | "lg" }) {
  const logo = size === "lg" ? "h-20 w-20" : "h-14 w-14";
  const title = size === "lg" ? "text-4xl" : "text-[1.7rem]";

  return (
    <Link href="/" className="flex items-center gap-3">
      <span
        className={`relative shrink-0 overflow-hidden rounded-full border border-[#e8a317]/40 bg-[#f4ead8] shadow-[0_0_0_3px_rgba(20,14,10,0.4)] ${logo}`}
      >
        <Image
          src="/logo.png"
          alt="FullBite Burger boğa logosu"
          fill
          sizes="80px"
          className="object-cover object-[center_12%]"
          priority={size === "md"}
        />
      </span>
      <span className="leading-none">
        <span
          className={`block font-[family-name:var(--font-display)] italic text-[#f6ead7] ${title}`}
        >
          FullBite
        </span>
        <span className="mt-1 block font-[family-name:var(--font-body)] text-[0.68rem] font-medium uppercase tracking-[0.32em] text-[#e8a317]">
          Burger
        </span>
      </span>
    </Link>
  );
}
