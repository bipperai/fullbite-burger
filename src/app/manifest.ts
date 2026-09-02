import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FullBite Burger",
    short_name: "FullBite",
    description:
      "FullBite Burger — Erzurum’dan Ankara’ya. Online sipariş ve iyzico ödeme.",
    start_url: "/",
    display: "standalone",
    background_color: "#140e0a",
    theme_color: "#140e0a",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
