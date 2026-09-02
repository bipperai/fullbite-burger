import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";
import { DEFAULT_MENU } from "./menu-defaults";
import type { MenuItem } from "./menu-types";

const filePath = path.join(process.cwd(), ".data", "menu.json");

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
