"use client";

import { usePathname } from "next/navigation";
import { CartProvider } from "./CartProvider";
import { Footer } from "./Footer";
import { Header } from "./Header";

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/yonetim");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <SiteShell>{children}</SiteShell>
    </CartProvider>
  );
}
