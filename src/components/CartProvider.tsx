"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { deliveryFeeFor, getMenuItem, type MenuItem } from "@/lib/menu";

export type CartLine = {
  id: string;
  quantity: number;
};

type CartContextValue = {
  lines: CartLine[];
  add: (id: string, quantity?: number) => void;
  remove: (id: string) => void;
  setQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  count: number;
  items: Array<CartLine & { product: MenuItem }>;
  subtotal: number;
  deliveryFee: number;
  total: number;
};

const STORAGE_KEY = "fullbite-cart";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      setLines([]);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const add = useCallback((id: string, quantity = 1) => {
    setLines((current) => {
      const existing = current.find((line) => line.id === id);
      if (existing) {
        return current.map((line) =>
          line.id === id
            ? { ...line, quantity: line.quantity + quantity }
            : line,
        );
      }
      return [...current, { id, quantity }];
    });
  }, []);

  const remove = useCallback((id: string) => {
    setLines((current) => current.filter((line) => line.id !== id));
  }, []);

  const setQuantity = useCallback((id: string, quantity: number) => {
    setLines((current) => {
      if (quantity <= 0) return current.filter((line) => line.id !== id);
      return current.map((line) =>
        line.id === id ? { ...line, quantity } : line,
      );
    });
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo(() => {
    const items = lines
      .map((line) => {
        const product = getMenuItem(line.id);
        return product ? { ...line, product } : null;
      })
      .filter((line): line is CartLine & { product: MenuItem } =>
        Boolean(line),
      );
    const subtotal = items.reduce(
      (sum, line) => sum + line.product.price * line.quantity,
      0,
    );
    const deliveryFee = deliveryFeeFor(subtotal);
    return {
      lines,
      add,
      remove,
      setQuantity,
      clear,
      count: items.reduce((sum, line) => sum + line.quantity, 0),
      items,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee,
    };
  }, [add, clear, lines, remove, setQuantity]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart CartProvider içinde kullanılmalı");
  return ctx;
}
