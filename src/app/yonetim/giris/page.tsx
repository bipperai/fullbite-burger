import { Suspense } from "react";
import { AdminLoginForm } from "@/components/AdminLoginForm";
import { getAdminUsers } from "@/lib/admin-auth";

export default function AdminLoginPage() {
  const configured = getAdminUsers().length > 0;

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
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
        <div className="mt-8 rounded-3xl border border-[#c23c22]/30 bg-[#1c1410] p-6 text-sm leading-6 text-[#ff8a75]">
          Yönetim hesapları tanımlı değil. Sunucuda{" "}
          <code className="text-[#f6ead7]">ADMIN_USERS</code> ve{" "}
          <code className="text-[#f6ead7]">ADMIN_SESSION_SECRET</code> ayarlayın.
        </div>
      ) : (
        <div className="mt-8 rounded-3xl border border-white/10 bg-[#1c1410] p-6">
          <Suspense fallback={<p className="text-sm text-[#f6ead7]/60">Yükleniyor...</p>}>
            <AdminLoginForm />
          </Suspense>
        </div>
      )}
    </div>
  );
}
