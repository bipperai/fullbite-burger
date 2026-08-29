export function formatTRY(value: number) {
  return new Intl.NumberFormat("tr-TR", {
    style: "currency",
    currency: "TRY",
  }).format(value);
}

export function toIyzicoPrice(value: number) {
  return value.toFixed(2);
}
