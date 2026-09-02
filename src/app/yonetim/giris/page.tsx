import { Suspense } from "react";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { getAdminUsers, sessionSecret } from "@/lib/admin-auth";

export default function AdminLoginPage() {
  const configured = getAdminUsers().length > 0 && Boolean(sessionSecret());

  return (
    <div className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-16">
      <p className="text-xs uppercase tracking-[0.28em] text-[#e8a317]">
        FullBite
      </p>
      <h1 className="mt-2 font-[family-name:var(--font-display)] text-4xl italic text-[#f6ead7]">
        Yönetim paneli
      </h1>
      <p className="mt-2 text-sm text-[#f6ead7]/65">
        Yetkili e-posta ve şifre ile giriş yapın.
      </p>

      {!configured ? (
        <div className="mt-8 rounded-3xl border border-[#c23c22]/30 bg-[#1c1410] p-6 text-sm leading-7 text-[#f6ead7]/85">
          <p className="font-medium text-[#ff8a75]">
            Canlı sitede yönetim hesabı henüz tanımlı değil.
          </p>
          <p className="mt-3">
            Bilgisayarındaki ayar dosyası canlıyı etkilemez. Vercel panelinde
            şu 3 değişkeni <strong className="text-[#f6ead7]">Production</strong>{" "}
            için ekle, sonra Redeploy yap:
          </p>
          <ol className="mt-4 list-decimal space-y-2 pl-5 text-[#f6ead7]/75">
            <li>
              <code className="text-[#e8a317]">ADMIN_EMAIL</code>
            </li>
            <li>
              <code className="text-[#e8a317]">ADMIN_PASSWORD</code>
            </li>
            <li>
              <code className="text-[#e8a317]">ADMIN_SESSION_SECRET</code>{" "}
              (uzun rastgele metin)
            </li>
          </ol>
          <p className="mt-4 text-[#f6ead7]/55">
            vercel.com → fullbite-burger → Settings → Environment Variables
          </p>
        </div>
      ) : null}

      <div className="mt-8 rounded-3xl border border-white/10 bg-[#1c1410] p-6">
        <Suspense fallback={<p className="text-sm text-[#f6ead7]/60">Yükleniyor...</p>}>
          <AdminLoginForm disabled={!configured} />
        </Suspense>
      </div>
    </div>
  );
}
