import { NextResponse } from "next/server";
import { readMenuImage } from "@/lib/menu-images";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const image = await readMenuImage(id);
  if (!image) {
    return NextResponse.json({ error: "Resim bulunamadı." }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(image.data), {
    headers: {
      "Content-Type": image.mime,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
