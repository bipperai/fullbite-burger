import { mkdir, readFile, unlink, writeFile } from "fs/promises";
import path from "path";

const dir = path.join(process.cwd(), ".data", "menu-images");

const EXT_FOR_MIME: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

export function menuImagePath(id: string) {
  return `/api/menu-image/${id}`;
}

export async function saveMenuImage(id: string, buffer: Buffer, mime: string) {
  const ext = EXT_FOR_MIME[mime];
  if (!ext) {
    throw new Error("Sadece JPG, PNG veya WebP yükleyebilirsin.");
  }

  await mkdir(dir, { recursive: true });

  for (const oldExt of ["jpg", "png", "webp"]) {
    try {
      await unlink(path.join(dir, `${id}.${oldExt}`));
    } catch {
      // ignore missing files
    }
  }

  await writeFile(path.join(dir, `${id}.${ext}`), buffer);
  return menuImagePath(id);
}

export async function readMenuImage(id: string) {
  for (const ext of ["jpg", "png", "webp"]) {
    const filePath = path.join(dir, `${id}.${ext}`);
    try {
      const data = await readFile(filePath);
      const mime =
        ext === "png"
          ? "image/png"
          : ext === "webp"
            ? "image/webp"
            : "image/jpeg";
      return { data, mime };
    } catch {
      // try next extension
    }
  }
  return null;
}
