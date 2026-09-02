"use client";

import { FormEvent, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminNav } from "./AdminNav";
import { MenuImage } from "./MenuImage";
import { formatTRY } from "@/lib/format";
import type { MenuItem } from "@/lib/menu-types";
import { MENU_SECTIONS } from "@/lib/menu-types";

type Props = {
  menu: MenuItem[];
  adminEmail: string;
};

function imagePreviewSrc(src: string, version: number) {
  const base = src.split("?")[0];
  return version ? `${base}?v=${version}` : src;
}

export function AdminMenuPanel({ menu: initialMenu, adminEmail }: Props) {
  const router = useRouter();
  const [menu, setMenu] = useState(initialMenu);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [imageVersions, setImageVersions] = useState<Record<string, number>>({});
  const [message, setMessage] = useState("");
  const fileInputs = useRef<Record<string, HTMLInputElement | null>>({});

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

  async function uploadImage(id: string, file: File) {
    setUploadingId(id);
    setMessage("");
    const form = new FormData();
    form.append("id", id);
    form.append("file", file);

    try {
      const response = await fetch("/api/yonetim/menu/upload", {
        method: "POST",
        body: form,
      });
      const data = (await response.json()) as {
        item?: MenuItem;
        error?: string;
      };
      if (!response.ok || !data.item) {
        throw new Error(data.error || "Resim yüklenemedi.");
      }

      setMenu((current) =>
        current.map((item) => (item.id === id ? data.item! : item)),
      );
      setImageVersions((current) => ({
        ...current,
        [id]: Date.now(),
      }));
      setMessage(`${data.item.name} resmi güncellendi.`);
      router.refresh();
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Resim yüklenemedi.");
    } finally {
      setUploadingId(null);
      const input = fileInputs.current[id];
      if (input) input.value = "";
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
                    <div className="grid gap-5 lg:grid-cols-[140px_1fr]">
                      <div>
                        <div className="relative aspect-square overflow-hidden rounded-2xl border border-white/10 bg-[#140e0a]">
                          <MenuImage
                            src={imagePreviewSrc(
                              item.image,
                              imageVersions[item.id] || 0,
                            )}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <label className="mt-3 flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-white/15 px-3 py-3 text-center text-xs text-[#f6ead7]/70 hover:border-[#e8a317]/40 hover:text-[#e8a317]">
                          <input
                            ref={(node) => {
                              fileInputs.current[item.id] = node;
                            }}
                            type="file"
                            accept="image/jpeg,image/png,image/webp"
                            className="hidden"
                            disabled={uploadingId === item.id}
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (file) void uploadImage(item.id, file);
                            }}
                          />
                          {uploadingId === item.id ? "Yükleniyor..." : "Resim seç"}
                        </label>
                      </div>

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
                    </div>
                    <p className="mt-3 text-xs text-[#f6ead7]/45">
                      Mevcut: {formatTRY(item.price)} · JPG/PNG/WebP · max 5 MB
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
