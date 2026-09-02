import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin-session-server";
import {
  createMenuItem,
  deleteMenuItem,
  getMenu,
  updateMenuItem,
} from "@/lib/menu";
import type { MenuCategory } from "@/lib/menu-types";

const CATEGORIES = new Set<MenuCategory>(["burger", "combo", "sides", "drinks"]);

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const items = await getMenu();
  return NextResponse.json({ items, adminEmail: session.email });
}

type PatchBody = {
  id?: string;
  name?: string;
  description?: string;
  price?: number;
  image?: string;
};

type CreateBody = {
  name?: string;
  description?: string;
  price?: number;
  category?: MenuCategory;
};

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = (await request.json()) as CreateBody;
  const name = String(body.name || "").trim();
  const description = String(body.description || "").trim();
  const category = body.category;

  if (!name) {
    return NextResponse.json({ error: "Ürün adı gerekli." }, { status: 400 });
  }

  if (!category || !CATEGORIES.has(category)) {
    return NextResponse.json({ error: "Geçerli kategori seç." }, { status: 400 });
  }

  const price = Number(body.price);
  if (!Number.isFinite(price) || price < 0) {
    return NextResponse.json({ error: "Geçerli fiyat gir." }, { status: 400 });
  }

  const item = await createMenuItem({
    name,
    description: description || name,
    price,
    category,
    tags: category === "combo" ? ["3'lü"] : undefined,
  });

  if (!item) {
    return NextResponse.json({ error: "Ürün eklenemedi." }, { status: 500 });
  }

  return NextResponse.json({ item }, { status: 201 });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const body = (await request.json()) as PatchBody;
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

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Yetkisiz." }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = String(searchParams.get("id") || "").trim();
  if (!id) {
    return NextResponse.json({ error: "Ürün id gerekli." }, { status: 400 });
  }

  const ok = await deleteMenuItem(id);
  if (!ok) {
    return NextResponse.json({ error: "Ürün bulunamadı." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
