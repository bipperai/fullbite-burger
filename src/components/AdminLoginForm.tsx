"use client";

import { FormEvent, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/yonetim";
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);
    const form = new FormData(event.currentTarget);
    try {
      const response = await fetch("/api/yonetim/giris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.get("email"),
          password: form.get("password"),
        }),
      });
      const data = (await response.json()) as { error?: string };
      if (!response.ok) {
        throw new Error(data.error || "Giriş başarısız.");
      }
      router.replace(next);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Giriş başarısız.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-2 block text-sm text-[#f6ead7]/70">
          E-posta
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="w-full rounded-xl border border-white/10 bg-[#140e0a] px-4 py-3 text-[#f6ead7] outline-none focus:border-[#e8a317]"
        />
      </div>
      <div>
        <label htmlFor="password" className="mb-2 block text-sm text-[#f6ead7]/70">
          Şifre
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-xl border border-white/10 bg-[#140e0a] px-4 py-3 text-[#f6ead7] outline-none focus:border-[#e8a317]"
        />
      </div>
      {error ? <p className="text-sm text-[#ff8a75]">{error}</p> : null}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-full bg-[#e8a317] py-3 text-sm font-semibold uppercase tracking-[0.16em] text-[#140e0a] disabled:opacity-60"
      >
        {loading ? "Giriş yapılıyor..." : "Giriş yap"}
      </button>
    </form>
  );
}
