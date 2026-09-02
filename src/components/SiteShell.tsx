"use client";

import { usePathname } from "next/navigation";
import type { MenuItem } from "@/lib/menu-types";
import { CartProvider } from "./CartProvider";
import { Footer } from "./Footer";
import { Header } from "./Header";
import { MenuProvider } from "./MenuProvider";

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

export function AppProviders({
  children,
  initialMenu,
}: {
  children: React.ReactNode;
  initialMenu?: MenuItem[];
}) {
  return (
    <MenuProvider initialMenu={initialMenu}>
      <CartProvider>
        <SiteShell>{children}</SiteShell>
      </CartProvider>
    </MenuProvider>
  );
}
