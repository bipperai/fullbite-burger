import Image from "next/image";
import Link from "next/link";

export function BrandMark({ size = "md" }: { size?: "md" | "lg" }) {
  const box =
    size === "lg"
      ? "h-[9.5rem] w-[11.75rem] bg-[#c4a574]"
      : "h-[3.85rem] w-[4.75rem] bg-[#c4a574] sm:h-[4.35rem] sm:w-[5.4rem]";

  return (
    <Link href="/" className="flex items-center" aria-label="FullBite Burger">
      <span className={`relative block overflow-hidden rounded-xl ${box}`}>
        <Image
          src="/logo.png"
          alt="FullBite Burger — Dolu. Lezzetli. Unutulmaz."
          fill
          sizes="(max-width: 640px) 88px, 188px"
          className="object-contain object-center"
          priority={size === "md"}
        />
      </span>
    </Link>
  );
}
