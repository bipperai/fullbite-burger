import { mkdir, readFile, writeFile } from "fs/promises";
import { randomUUID } from "crypto";
import path from "path";
import { DEFAULT_MENU } from "./menu-defaults";
import type { MenuCategory, MenuItem } from "./menu-types";

const filePath = path.join(process.cwd(), ".data", "menu.json");

const DEFAULT_IMAGES: Record<MenuCategory, string> = {
  combo: "/food/combo.jpg",
  burger: "/food/cheese.jpg",
  sides: "/food/fries.jpg",
  drinks: "/food/kola.jpg",
};

function slugify(name: string) {
  return name
    .toLowerCase()
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ş/g, "s")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 32);
}

function uniqueId(menu: MenuItem[], name: string) {
  const base = slugify(name) || "urun";
  if (!menu.some((item) => item.id === base)) return base;
  return `${base}-${randomUUID().slice(0, 6)}`;
}

export async function getMenu() {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed = JSON.parse(raw) as MenuItem[];
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
  } catch {
    // fall through to defaults
  }
  return DEFAULT_MENU;
}

export async function saveMenu(items: MenuItem[]) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(items, null, 2), "utf8");
}

export async function getMenuItem(id: string) {
  const menu = await getMenu();
  return menu.find((item) => item.id === id) ?? null;
}

export async function updateMenuItem(
  id: string,
  patch: Partial<Pick<MenuItem, "name" | "description" | "price" | "image">>,
) {
  const menu = await getMenu();
  const index = menu.findIndex((item) => item.id === id);
  if (index < 0) return null;

  const next = { ...menu[index], ...patch };
  if (typeof next.price === "number") {
    next.price = Math.max(0, Number(next.price.toFixed(2)));
  }

  menu[index] = next;
  await saveMenu(menu);
  return next;
}

export async function createMenuItem(input: {
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image?: string;
  tags?: string[];
}) {
  const menu = await getMenu();
  const name = input.name.trim();
  if (!name) return null;

  const item: MenuItem = {
    id: uniqueId(menu, name),
    name,
    description: input.description.trim(),
    price: Math.max(0, Number(input.price.toFixed(2))),
    category: input.category,
    image: input.image?.trim() || DEFAULT_IMAGES[input.category],
    tags: input.tags,
  };

  menu.push(item);
  await saveMenu(menu);
  return item;
}

export async function deleteMenuItem(id: string) {
  const menu = await getMenu();
  const filtered = menu.filter((item) => item.id !== id);
  if (filtered.length === menu.length) return false;
  await saveMenu(filtered);
  return true;
}
