import Link from "next/link";
import { BrandMark } from "./BrandMark";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0d0907] text-[#f6ead7]/75">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3">
        <div>
          <BrandMark size="lg" />
          <p className="mt-4 max-w-sm text-sm leading-6">
            Erzurum yaylasından Ankara’ya. 1986’dan beri kendi etimiz, 2026’dan
            beri FullBite.
          </p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#e8a317]">
            Saatler
          </p>
          <p className="mt-3 text-sm">Hafta içi 12:00 – 23:30</p>
          <p className="text-sm">Hafta sonu 12:00 – 00:30</p>
          <p className="mt-4 text-sm">Bahçelievler / Ankara</p>
          <p className="text-sm">0312 000 00 00</p>
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-[#e8a317]">
            Keşfet
          </p>
          <div className="mt-3 flex flex-col gap-2 text-sm">
            <Link href="/">Menü</Link>
            <Link href="/hakkimizda">Hakkımızda</Link>
            <Link href="/siparis">Sipariş</Link>
          </div>
        </div>
      </div>
      <p className="border-t border-white/10 py-4 text-center text-xs text-[#f6ead7]/50">
        Ödemeler iyzico güvencesiyle alınır. © {new Date().getFullYear()} FullBite
        Burger
      </p>
    </footer>
  );
}
