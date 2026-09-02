import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session-server";
import { getMenu, updateMenuItem } from "@/lib/menu";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const items = await getMenu();
  return NextResponse.json({ items, adminEmail: session.email });
}

type Body = {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
};

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = (await request.json()) as Body;
  const id = String(body.id || "").trim();
  if (!id) {
    return NextResponse.json({ error: "Ürün id gerekli." }, { status: 400 });
  }

  const patch: {
    name?: string;
    description?: string;
    price?: number;
    image?: string;
  } = {};

  if (body.name !== undefined) {
    const name = String(body.name).trim();
    if (!name) {
      return NextResponse.json({ error: "Ürün adı boş olamaz." }, { status: 400 });
    }
    patch.name = name;
  }

  if (body.description !== undefined) {
    patch.description = String(body.description).trim();
  }

  if (body.price !== undefined) {
    const price = Number(body.price);
    if (!Number.isFinite(price) || price < 0) {
      return NextResponse.json({ error: "Geçersiz fiyat." }, { status: 400 });
    }
    patch.price = price;
  }

  if (body.image !== undefined) {
    const image = String(body.image).trim();
    if (!image.startsWith("/")) {
      return NextResponse.json({ error: "Geçersiz resim yolu." }, { status: 400 });
    }
    patch.image = image;
  }

  if (!Object.keys(patch).length) {
    return NextResponse.json({ error: "Güncellenecek alan yok." }, { status: 400 });
  }

  const item = await updateMenuItem(id, patch);
  if (!item) {
    return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
  }

  return NextResponse.json({ item });
}
