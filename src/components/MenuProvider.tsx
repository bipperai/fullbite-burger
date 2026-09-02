"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type { MenuItem } from "@/lib/menu-types";

type MenuContextValue = {
  menu: MenuItem[];
  ready: boolean;
  getMenuItem: (id: string) => MenuItem | undefined;
  refreshMenu: () => Promise<void>;
};

const MenuContext = createContext<MenuContextValue | null>(null);

export function MenuProvider({
  children,
  initialMenu,
}: {
  children: React.ReactNode;
  initialMenu?: MenuItem[];
}) {
  const [menu, setMenu] = useState<MenuItem[]>(initialMenu ?? []);
  const [ready, setReady] = useState(Boolean(initialMenu?.length));

  const refreshMenu = useCallback(async () => {
    const response = await fetch("/api/menu", { cache: "no-store" });
    if (!response.ok) return;
    const data = (await response.json()) as { items: MenuItem[] };
    setMenu(data.items);
    setReady(true);
  }, []);

  useEffect(() => {
    if (initialMenu?.length) return;
    void refreshMenu();
  }, [initialMenu, refreshMenu]);

  const value = useMemo(
    () => ({
      menu,
      ready,
      getMenuItem: (id: string) => menu.find((item) => item.id === id),
      refreshMenu,
    }),
    [menu, ready, refreshMenu],
  );

  return <MenuContext.Provider value={value}>{children}</MenuContext.Provider>;
}

export function useMenu() {
  const ctx = useContext(MenuContext);
  if (!ctx) throw new Error("useMenu MenuProvider içinde kullanılmalı");
  return ctx;
}
