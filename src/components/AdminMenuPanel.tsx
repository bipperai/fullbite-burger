"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminNav } from "./AdminNav";
import { formatTRY } from "@/lib/format";
import type { MenuItem } from "@/lib/menu-types";
import { MENU_SECTIONS } from "@/lib/menu-types";

type Props = {
  menu: MenuItem[];
  adminEmail: string;
};

export function AdminMenuPanel({ menu: initialMenu, adminEmail }: Props) {
  const router = useRouter();
  const [menu, setMenu] = useState(initialMenu);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function logout() {
    await fetch("/api/yonetim/cikis", { method: "POST" });
    router.replace("/yonetim/giris");
    router.refresh();
  }

  async function saveItem(event: FormEvent<HTMLFormElement>, id: string) {
    event.preventDefault();
    setSavingId(id);
    setMessage("");
    const form = new FormData(event.currentTarget);

    try {
      const response = await fetch("/api/yonetim/menu", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          name: form.get("name"),
          description: form.get("description"),
          price: Number(form.get("price")),
        }),
      });
      const data = (await response.json()) as {
        item?: MenuItem;
        error?: string;
      };
      if (!response.ok || !data.item) {
        throw new Error(data.error || "Kaydedilemedi.");
      }

      setMenu((current) =>
        current.map((item) => (item.id === id ? data.item! : item)),
      );
      setMessage(`${data.item.name} güncellendi. Sitede hemen görünür.`);
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Kaydedilemedi.");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="pb-10">
      <AdminNav adminEmail={adminEmail} onLogout={logout} />

      <div className="mx-auto mt-8 max-w-6xl px-4">
        {message ? (
          <p className="mb-5 rounded-2xl border border-[#e8a317]/30 bg-[#e8a317]/10 px-4 py-3 text-sm text-[#f6ead7]">
            {message}
          </p>
        ) : null}

        {MENU_SECTIONS.map((section) => {
          const items = menu.filter((item) => item.category === section.id);
          return (
            <section key={section.id} className="mb-10">
              <h2 className="font-[family-name:var(--font-display)] text-2xl italic text-[#e8a317]">
                {section.title}
              </h2>
              <div className="mt-4 space-y-4">
                {items.map((item) => (
                  <form
                    key={item.id}
                    onSubmit={(event) => saveItem(event, item.id)}
                    className="rounded-3xl border border-white/10 bg-[#1c1410] p-5"
                  >
                    <div className="grid gap-4 lg:grid-cols-[1fr_1fr_120px_auto] lg:items-end">
                      <div>
                        <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#f6ead7]/45">
                          Ürün adı
                        </label>
                        <input
                          name="name"
                          defaultValue={item.name}
                          required
                          className="w-full rounded-xl border border-white/10 bg-[#140e0a] px-4 py-3 text-[#f6ead7] outline-none focus:border-[#e8a317]"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#f6ead7]/45">
                          Açıklama
                        </label>
                        <input
                          name="description"
                          defaultValue={item.description}
                          className="w-full rounded-xl border border-white/10 bg-[#140e0a] px-4 py-3 text-[#f6ead7] outline-none focus:border-[#e8a317]"
                        />
                      </div>
                      <div>
                        <label className="mb-2 block text-xs uppercase tracking-[0.18em] text-[#f6ead7]/45">
                          Fiyat (₺)
                        </label>
                        <input
                          name="price"
                          type="number"
                          min="0"
                          step="1"
                          defaultValue={item.price}
                          required
                          className="w-full rounded-xl border border-white/10 bg-[#140e0a] px-4 py-3 text-[#f6ead7] outline-none focus:border-[#e8a317]"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={savingId === item.id}
                        className="rounded-full bg-[#e8a317] px-5 py-3 text-sm font-semibold text-[#140e0a] disabled:opacity-60"
                      >
                        {savingId === item.id ? "..." : "Kaydet"}
                      </button>
                    </div>
                    <p className="mt-3 text-xs text-[#f6ead7]/45">
                      Mevcut: {formatTRY(item.price)} · id: {item.id}
                    </p>
                  </form>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
