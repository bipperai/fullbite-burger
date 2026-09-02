"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminNav } from "./AdminNav";

type Status = {
  configured: boolean;
  source: string | null;
  baseUrl: string;
  callbackUrl: string;
  apiKeyPreview: string | null;
  sources: {
    hasEnvApiKey: boolean;
    hasEnvSecret: boolean;
    hasCombinedEnv: boolean;
    hasMemoryCache: boolean;
  };
};

export function AdminPaymentPanel({ adminEmail }: { adminEmail: string }) {
  const router = useRouter();
  const [status, setStatus] = useState<Status | null>(null);
  const [apiKey, setApiKey] = useState("");
  const [secretKey, setSecretKey] = useState("");
  const [baseUrl, setBaseUrl] = useState("https://api.iyzipay.com");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function loadStatus() {
    const response = await fetch("/api/yonetim/iyzico-durum");
    if (response.ok) {
      setStatus((await response.json()) as Status);
    }
  }

  useEffect(() => {
    loadStatus();
  }, []);

  async function logout() {
    await fetch("/api/yonetim/cikis", { method: "POST" });
    router.replace("/yonetim/giris");
    router.refresh();
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const response = await fetch("/api/yonetim/iyzico-ayarlar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, secretKey, baseUrl }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(data.error || "Kaydedilemedi.");
      setMessage("iyzico anahtarları kaydedildi. Müşteriler şimdi ödeme yapabilir.");
      setApiKey("");
      setSecretKey("");
      await loadStatus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Hata oluştu.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="pb-10">
      <AdminNav adminEmail={adminEmail} onLogout={logout} />

      <div className="mx-auto mt-8 max-w-2xl px-4">
        <div
          className={`rounded-3xl border p-5 ${
            status?.configured
              ? "border-emerald-500/30 bg-emerald-500/10"
              : "border-[#ff8a75]/30 bg-[#c23c22]/10"
          }`}
        >
          <p className="text-sm leading-6 text-[#f6ead7]">
            {status?.configured ? (
              <>
                Ödeme <strong className="text-emerald-300">aktif</strong>
                {status.apiKeyPreview ? ` (${status.apiKeyPreview})` : ""}
              </>
            ) : (
              <>
                Ödeme <strong className="text-[#ff8a75]">kapalı</strong> — müşteri
                sipariş veremiyor.
              </>
            )}
          </p>
          {status && (
            <p className="mt-2 text-xs text-[#f6ead7]/55">
              Callback: {status.callbackUrl}
            </p>
          )}
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-6 space-y-4 rounded-3xl border border-white/10 bg-[#1c1410] p-6"
        >
          <h2 className="font-[family-name:var(--font-display)] text-2xl italic text-[#f6ead7]">
            iyzico anahtarları
          </h2>
          <p className="text-sm leading-6 text-[#f6ead7]/60">
            Vercel&apos;de env boşsa buradan kaydedin. iyzico panelinden canlı API
            Key ve Secret Key yapıştırın.
          </p>

          <input
            value={apiKey}
            onChange={(event) => setApiKey(event.target.value)}
            placeholder="IYZI_API_KEY"
            className="w-full rounded-xl border border-white/10 bg-[#140e0a] px-4 py-3 text-sm text-[#f6ead7] outline-none focus:border-[#e8a317]"
          />
          <input
            value={secretKey}
            onChange={(event) => setSecretKey(event.target.value)}
            type="password"
            placeholder="IYZI_SECRET_KEY"
            className="w-full rounded-xl border border-white/10 bg-[#140e0a] px-4 py-3 text-sm text-[#f6ead7] outline-none focus:border-[#e8a317]"
          />
          <input
            value={baseUrl}
            onChange={(event) => setBaseUrl(event.target.value)}
            placeholder="https://api.iyzipay.com"
            className="w-full rounded-xl border border-white/10 bg-[#140e0a] px-4 py-3 text-sm text-[#f6ead7] outline-none focus:border-[#e8a317]"
          />

          {error ? <p className="text-sm text-[#ff8a75]">{error}</p> : null}
          {message ? <p className="text-sm text-emerald-300">{message}</p> : null}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-[#e8a317] py-3 text-sm font-semibold text-[#140e0a] disabled:opacity-60"
          >
            {loading ? "Kaydediliyor..." : "Kaydet ve ödemeyi aç"}
          </button>
        </form>
      </div>
    </div>
  );
}
