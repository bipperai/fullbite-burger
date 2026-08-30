import Image from "next/image";
import Link from "next/link";

export function BrandMark({ size = "md" }: { size?: "md" | "lg" }) {
  const box =
    size === "lg"
      ? "h-[7.5rem] w-[9.4rem]"
      : "h-[3.65rem] w-[4.55rem] sm:h-[4.35rem] sm:w-[5.4rem]";

  return (
    <Link href="/" className="flex items-center" aria-label="FullBite Burger">
      <span className={`relative block overflow-hidden rounded-xl ${box}`}>
        <Image
          src="/logo.png"
          alt="FullBite Burger — Dolu. Lezzetli. Unutulmaz."
          fill
          sizes="(max-width: 640px) 88px, 160px"
          className="object-cover"
          priority={size === "md"}
        />
      </span>
    </Link>
  );
}
