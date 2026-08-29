import { ProductCard } from "@/components/ProductCard";
import { MENU } from "@/lib/menu";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-[family-name:var(--font-display)] text-5xl italic text-[#f6ead7] md:text-6xl">
        Menü
      </h1>
      <p className="mt-2 text-[#f6ead7]/70">
        Hamburger, patates, içecek ve toplu menüler — hepsi bir arada.
      </p>
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {MENU.map((item) => (
          <ProductCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}
