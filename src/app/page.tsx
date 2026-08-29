import { ProductCard } from "@/components/ProductCard";
import { OrderLink } from "@/components/OrderButton";
import { MENU, MENU_SECTIONS } from "@/lib/menu";
import Image from "next/image";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <section className="relative mb-12 overflow-hidden rounded-[2rem] border border-white/10">
        <div className="relative aspect-[16/9] min-h-[220px] sm:aspect-[21/9] sm:min-h-[280px]">
          <Image
            src="/food/box.jpg"
            alt="FullBite burger kutusu"
            fill
            priority
            className="object-cover object-center"
            sizes="(max-width: 768px) 100vw, 1152px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#140e0a] via-[#140e0a]/45 to-transparent" />
        </div>
        <div className="absolute inset-x-0 bottom-0 space-y-3 p-6 sm:p-8">
          <p className="text-xs uppercase tracking-[0.28em] text-[#e8a317]">
            Üçlü menü · kola · patates
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl italic text-[#f6ead7] sm:text-5xl">
            Menü
          </h1>
          <p className="max-w-xl text-sm text-[#f6ead7]/80 sm:text-base">
            130 gr et, cheddar, domates, karamelize soğan, marul, özel sos, dana
            füme.
          </p>
          <OrderLink href="#menu" className="inline-flex px-8 py-3.5 text-sm">
            Sipariş ver
          </OrderLink>
        </div>
      </section>

      <div id="menu" className="scroll-mt-28">
        {MENU_SECTIONS.map((section) => {
          const items = MENU.filter((item) => item.category === section.id);
          return (
            <section key={section.id} className="mt-12 first:mt-0">
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
    </div>
  );
}
