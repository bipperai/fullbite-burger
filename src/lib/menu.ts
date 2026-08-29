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
    id: "dadas-burger",
    name: "Dadaş Burger",
    description:
      "Çift dana köfte, sucuk, kaşar, isot tereyağı, karamelize soğan ve turşu.",
    price: 279,
    category: "burger",
    image: "/food/dadas.jpg",
    tags: ["Dadaş"],
  },
  {
    id: "fullbite-smash",
    name: "FullBite Smash",
    description:
      "İki kat smash dana, cheddar, karamelize soğan, turşu ve ev yapımı sos.",
    price: 289,
    category: "burger",
    image: "/food/smash.jpg",
  },
  {
    id: "classic-cheese",
    name: "Cheese Burger",
    description: "Dana köfte, amerikan peyniri, marul, domates, turşu.",
    price: 219,
    category: "burger",
    image: "/food/cheese.jpg",
  },
  {
    id: "double-stack",
    name: "Double Burger",
    description: "İki dana köfte, çift cheddar, burger sosu, çıtır turşu.",
    price: 269,
    category: "burger",
    image: "/food/double.jpg",
  },
  {
    id: "crispy-chicken",
    name: "Tavuk Burger",
    description: "Çıtır tavuk, acı bal sos, coleslaw ve turşu.",
    price: 249,
    category: "burger",
    image: "/food/chicken.jpg",
  },
  {
    id: "dadas-menu",
    name: "Dadaş Menü",
    description: "Dadaş Burger + patates + içecek. Toplu menü.",
    price: 359,
    category: "combo",
    image: "/food/dadas.jpg",
    tags: ["Toplu"],
  },
  {
    id: "smash-menu",
    name: "Smash Menü",
    description: "FullBite Smash + patates + içecek. Toplu menü.",
    price: 369,
    category: "combo",
    image: "/food/smash.jpg",
    tags: ["Toplu"],
  },
  {
    id: "cheese-menu",
    name: "Cheese Menü",
    description: "Cheese Burger + patates + içecek. Toplu menü.",
    price: 299,
    category: "combo",
    image: "/food/cheese.jpg",
    tags: ["Toplu"],
  },
  {
    id: "chicken-menu",
    name: "Tavuk Menü",
    description: "Tavuk Burger + patates + içecek. Toplu menü.",
    price: 329,
    category: "combo",
    image: "/food/chicken.jpg",
    tags: ["Toplu"],
  },
  {
    id: "fries",
    name: "Patates",
    description: "Çift kızartılmış, tuzlu. Porsiyon.",
    price: 79,
    category: "sides",
    image: "/food/fries.jpg",
  },
  {
    id: "fries-large",
    name: "Büyük Patates",
    description: "Paylaşımalık porsiyon, çıtır.",
    price: 109,
    category: "sides",
    image: "/food/fries.jpg",
  },
  {
    id: "cola",
    name: "Kola",
    description: "330 ml, buz gibi.",
    price: 45,
    category: "drinks",
    image: "/food/cola.jpg",
  },
  {
    id: "ayran",
    name: "Ayran",
    description: "Soğuk, köpüklü.",
    price: 35,
    category: "drinks",
    image: "/food/lemonade.jpg",
  },
  {
    id: "lemonade",
    name: "Limonata",
    description: "Taze sıkım limon, nane.",
    price: 55,
    category: "drinks",
    image: "/food/lemonade.jpg",
  },
  {
    id: "icetea",
    name: "Ice Tea",
    description: "Şeftali, 330 ml.",
    price: 45,
    category: "drinks",
    image: "/food/cola.jpg",
  },
];

export const DELIVERY_FEE = 29.9;
export const FREE_DELIVERY_OVER = 400;

export function getMenuItem(id: string) {
  return MENU.find((item) => item.id === id);
}

export function deliveryFeeFor(subtotal: number) {
  if (subtotal <= 0) return 0;
  return subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE;
}
