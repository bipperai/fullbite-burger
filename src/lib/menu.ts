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

export const MENU: MenuItem[] = [
  {
    id: "dadas-menu",
    name: "Dadaş Üçlü",
    description: "Dadaş Burger + patates + içecek.",
    price: 539,
    category: "combo",
    image: "/food/combo.jpg",
    tags: ["3'lü"],
  },
  {
    id: "smash-menu",
    name: "Smash Üçlü",
    description: "FullBite Smash + patates + içecek.",
    price: 554,
    category: "combo",
    image: "/food/combo.jpg",
    tags: ["3'lü"],
  },
  {
    id: "cheese-menu",
    name: "Cheese Üçlü",
    description: "Cheese Burger + patates + içecek.",
    price: 449,
    category: "combo",
    image: "/food/combo.jpg",
    tags: ["3'lü"],
  },
  {
    id: "chicken-menu",
    name: "Tavuk Üçlü",
    description: "Tavuk Burger + patates + içecek.",
    price: 494,
    category: "combo",
    image: "/food/combo.jpg",
    tags: ["3'lü"],
  },
  {
    id: "double-menu",
    name: "Double Üçlü",
    description: "Double Burger + patates + içecek.",
    price: 524,
    category: "combo",
    image: "/food/combo.jpg",
    tags: ["3'lü"],
  },
  {
    id: "dadas-burger",
    name: "Dadaş Burger",
    description:
      "Çift dana köfte, sucuk, kaşar, isot tereyağı, karamelize soğan ve turşu.",
    price: 419,
    category: "burger",
    image: "/food/dadas.jpg",
    tags: ["Dadaş"],
  },
  {
    id: "fullbite-smash",
    name: "FullBite Smash",
    description:
      "İki kat smash dana, cheddar, karamelize soğan, turşu ve ev yapımı sos.",
    price: 434,
    category: "burger",
    image: "/food/smash.jpg",
  },
  {
    id: "classic-cheese",
    name: "Cheese Burger",
    description: "Dana köfte, amerikan peyniri, marul, domates, turşu.",
    price: 329,
    category: "burger",
    image: "/food/cheese.jpg",
  },
  {
    id: "double-stack",
    name: "Double Burger",
    description: "İki dana köfte, çift cheddar, burger sosu, çıtır turşu.",
    price: 404,
    category: "burger",
    image: "/food/double.jpg",
  },
  {
    id: "crispy-chicken",
    name: "Tavuk Burger",
    description: "Çıtır tavuk, acı bal sos, coleslaw ve turşu.",
    price: 374,
    category: "burger",
    image: "/food/chicken.jpg",
  },
  {
    id: "fries",
    name: "Patates",
    description: "Çift kızartılmış, tuzlu. Porsiyon.",
    price: 119,
    category: "sides",
    image: "/food/fries.jpg",
  },
  {
    id: "fries-large",
    name: "Büyük Patates",
    description: "Paylaşımalık porsiyon, çıtır.",
    price: 164,
    category: "sides",
    image: "/food/fries.jpg",
  },
  {
    id: "cola",
    name: "Kola",
    description: "330 ml, buz gibi.",
    price: 68,
    category: "drinks",
    image: "/food/kola.jpg",
  },
  {
    id: "ayran",
    name: "Ayran",
    description: "Soğuk, köpüklü.",
    price: 53,
    category: "drinks",
    image: "/food/ayran.jpg",
  },
  {
    id: "lemonade",
    name: "Limonata",
    description: "Taze sıkım limon, nane.",
    price: 83,
    category: "drinks",
    image: "/food/limonata.jpg",
  },
  {
    id: "icetea",
    name: "Ice Tea",
    description: "Şeftali, 330 ml.",
    price: 68,
    category: "drinks",
    image: "/food/icetea.jpg",
  },
  {
    id: "reyhan",
    name: "Reyhan",
    description: "Ev yapımı reyhan şerbeti, buz gibi.",
    price: 75,
    category: "drinks",
    image: "/food/reyhan.jpg",
  },
];

export const MENU_SECTIONS: { id: MenuCategory; title: string }[] = [
  { id: "combo", title: "Üçlü Menü" },
  { id: "burger", title: "Hamburger" },
  { id: "sides", title: "Patates" },
  { id: "drinks", title: "İçecek" },
];

export const DELIVERY_FEE = 44.9;
export const FREE_DELIVERY_OVER = 600;

export function getMenuItem(id: string) {
  return MENU.find((item) => item.id === id);
}

export function deliveryFeeFor(subtotal: number) {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
}
