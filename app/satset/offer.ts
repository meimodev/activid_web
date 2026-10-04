export const SATSET_OFFER = {
  monthlyPrice: 400_000,
  regularMonthlyPrice: 1_000_000,
  monthlyOutletLimit: 10,
} as const;

export function formatRupiah(amount: number, lang: "id" | "en") {
  return `Rp${new Intl.NumberFormat(lang === "id" ? "id-ID" : "en-US").format(amount)}`;
}
