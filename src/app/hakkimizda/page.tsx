import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16">
      <p className="text-xs uppercase tracking-[0.28em] text-[#e8a317]">Hikâye</p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-5xl italic text-[#f6ead7]">
        Hakkımızda
      </h1>
      <div className="mt-10 grid items-center gap-10 md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
          <Image
            src="/food/kitchen.jpg"
            alt="FullBite mutfak"
            fill
            className="object-cover"
          />
        </div>
        <div className="space-y-5 text-[#f6ead7]/80 leading-7">
          <p>
            FullBite Burger’in kökü Erzurum’un bin dört yüz metrelik yaylalarına
            dayanır. 1986’dan beri kendi hayvanlarımızla, kendi meramızda
            besicilik yapıyoruz. Soğuk iklim, temiz hava ve yavaş büyüyen dana;
            tabağa gelen her ısırığın arkasındaki asıl lezzet bu.
          </p>
          <p>
            Kırk yıllık bu emeği 2026’da hamburger tezgâhına taşıdık. Et hâlâ
            aynı yerden, aynı aileden; sadece şekli değişti: ince smash, eriyen
            kaşar, ev yapımı sos. Gösteriş değil, dadaş usulü tok bir ısırık
            istedik.
          </p>
          <p>
            Türkiye’deki ilk şubemizi Ankara Bahçelievler’de açtık. Mutfakta
            brioche’u tereyağında mühürler, soğanı yavaş karamelize ederiz.
            Teslimatta burgerin dağılmaması için özel kutu ve ısı yalıtımı
            kullanırız.
          </p>
          <p>
            Online siparişlerde ödemeler iyzico üzerinden alınır. Kart
            bilgileriniz bizim sunucularımıza gelmez.
          </p>
          <div className="rounded-3xl border border-white/10 bg-[#1c1410] p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-[#e8a317]">
              Mutfağa uğra
            </p>
            <p className="mt-3">Bahçelievler / Ankara</p>
            <p>İlk şube · 2026</p>
            <p>0312 000 00 00 · merhaba@fullbiteburger.com</p>
            <p className="mt-2 text-sm">Hafta içi 12:00–23:30 · Hafta sonu 12:00–00:30</p>
          </div>
        </div>
      </div>
    </div>
  );
}
