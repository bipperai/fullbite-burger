import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session-server";
import { saveMenuImage } from "@/lib/menu-images";
import { updateMenuItem } from "@/lib/menu";

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp"]);

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const form = await request.formData();
  const id = String(form.get("id") || "").trim();
  const file = form.get("file");

  if (!id) {
    return NextResponse.json({ error: "Ürün id gerekli." }, { status: 400 });
  }

  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "Resim dosyası gerekli." }, { status: 400 });
  }

  if (!ALLOWED.has(file.type)) {
    return NextResponse.json(
      { error: "Sadece JPG, PNG veya WebP yükleyebilirsin." },
      { status: 400 },
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json(
      { error: "Resim en fazla 5 MB olabilir." },
      { status: 400 },
    );
  }

  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const imagePath = await saveMenuImage(id, buffer, file.type);
    const item = await updateMenuItem(id, { image: imagePath });
    if (!item) {
      return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
    }

    return NextResponse.json({
      item,
      image: `${imagePath}?v=${Date.now()}`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Yükleme başarısız.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
