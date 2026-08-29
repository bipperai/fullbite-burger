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
            FullBite Burger, 2021’de Cihangir’de küçük bir smash tezgâhı olarak
            açıldı. Amacımız gösterişli menüler değil; her ısırıkta duyulan çıtır
            ses, eriyen cheddar ve ev yapımı sos.
          </p>
          <p>
            Etlerimizi her sabah öğütüyor, brioche’ları tereyağında mühürlüyor,
            soğanı yavaş yavaş karamelize ediyoruz. Teslimatta burgerin dağılmaması
            için özel kutu ve ısı yalıtımı kullanıyoruz.
          </p>
          <p>
            Online siparişlerde ödemeler iyzico üzerinden alınır. Kart bilgileriniz
            bizim sunucularımıza gelmez.
          </p>
          <div className="rounded-3xl border border-white/10 bg-[#1c1410] p-6">
            <p className="text-xs uppercase tracking-[0.28em] text-[#e8a317]">
              Mutfağa uğra
            </p>
            <p className="mt-3">Cihangir, Beyoğlu / İstanbul</p>
            <p>0212 000 00 00 · merhaba@fullbiteburger.com</p>
            <p className="mt-2 text-sm">Hafta içi 12:00–23:30 · Hafta sonu 12:00–00:30</p>
          </div>
        </div>
      </div>
    </div>
  );
}
