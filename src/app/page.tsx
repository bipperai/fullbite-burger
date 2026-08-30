import { ProductCard } from "@/components/ProductCard";
import { MENU, MENU_SECTIONS } from "@/lib/menu";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <h1 className="font-[family-name:var(--font-display)] text-5xl italic text-[#f6ead7] md:text-6xl">
        Menü
      </h1>
      <p className="mt-2 text-[#f6ead7]/70">
        Üçlü menü: hamburger, patates, içecek.
      </p>

      {MENU_SECTIONS.map((section) => {
        const items = MENU.filter((item) => item.category === section.id);
        return (
          <section key={section.id} className="mt-12">
            <h2 className="font-[family-name:var(--font-display)] text-3xl italic text-[#e8a317]">
              {section.title}
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <ProductCard key={item.id} item={item} />
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
