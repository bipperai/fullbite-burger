import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Yönetim | FullBite Burger",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: LayoutProps<"/yonetim">) {
  return children;
}
