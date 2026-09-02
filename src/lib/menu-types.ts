export type MenuCategory = "burger" | "combo" | "sides" | "drinks";

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  image: string;
  tags?: string[];
};

export const MENU_SECTIONS: { id: MenuCategory; title: string }[] = [
  { id: "combo", title: "Üçlü Menü" },
  { id: "burger", title: "Hamburger" },
  { id: "sides", title: "Patates" },
  { id: "drinks", title: "İçecek" },
];

export const DELIVERY_FEE = 44.9;
export const FREE_DELIVERY_OVER = 600;

export function deliveryFeeFor(subtotal: number) {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
}
