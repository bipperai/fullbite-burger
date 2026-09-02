"use client";

import { useEffect, useState } from "react";

type Status = {
  configured: boolean;
  apiKeyName: string | null;
  secretKeyName: string | null;
  baseUrl: string;
  callbackUrl: string;
  apiKeyPreview: string | null;
};

export function IyzicoStatusBanner() {
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    fetch("/api/yonetim/iyzico-durum")
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => setStatus(data))
      .catch(() => setStatus(null));
  }, []);

  if (!status) return null;

  if (status.configured) {
    return (
      <div className="mx-auto mt-4 max-w-6xl px-4">
        <p className="rounded-2xl border border-emerald-500/25 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-200">
          iyzico bağlı ({status.apiKeyName}) · callback: {status.callbackUrl}
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-4 max-w-6xl px-4">
      <p className="rounded-2xl border border-[#ff8a75]/30 bg-[#c23c22]/10 px-4 py-3 text-sm leading-6 text-[#ff8a75]">
        iyzico anahtarları canlıda okunamıyor. Vercel → Settings → Environment
        Variables → Production: <strong>IYZI_API_KEY</strong>,{" "}
        <strong>IYZI_SECRET_KEY</strong>, <strong>IYZI_BASE_URL</strong>{" "}
        (https://api.iyzipay.com), <strong>NEXT_PUBLIC_BASE_URL</strong>{" "}
        (https://www.fullbiteburger.com) — kaydedip <strong>Redeploy</strong> yapın.
      </p>
    </div>
  );
}
