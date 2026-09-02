import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";
import { AppProviders } from "@/components/SiteShell";
import { getMenu } from "@/lib/menu";
import "./globals.css";

const display = Fraunces({
  variable: "--font-display",
  subsets: ["latin", "latin-ext"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
});

const body = Outfit({
  variable: "--font-body",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "FullBite Burger | Smash burger, teslimat ve iyzico ödeme",
  description:
    "FullBite Burger — Erzurum’da 1986’dan beri besicilik, 2026’da Ankara Bahçelievler’de ilk şube.",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const initialMenu = await getMenu();

  return (
    <html
      lang="tr"
      className={`${display.variable} ${body.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <AppProviders initialMenu={initialMenu}>{children}</AppProviders>
      </body>
    </html>
  );
}
