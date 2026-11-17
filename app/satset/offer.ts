export const SATSET_OFFER = {
  monthlyPrice: 399_000,
  regularMonthlyPrice: 1_200_000,
} as const;

export function formatRupiah(amount: number, lang: "id" | "en") {
  return `Rp${new Intl.NumberFormat(lang === "id" ? "id-ID" : "en-US").format(amount)}`;
}
