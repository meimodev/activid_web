import type { Metadata } from "next";
import type { Lang } from "./copy";
import { formatRupiah, SATSET_OFFER } from "./offer";
import { SATSET_PRODUCT_NAME } from "./brand";

export function getSatsetMetadata(lang: Lang): Metadata {
  const price = formatRupiah(SATSET_OFFER.monthlyPrice, lang);
  const title = SATSET_PRODUCT_NAME;
  const description = lang === "id"
    ? `${SATSET_PRODUCT_NAME} untuk pesanan, dapur, dan kasir lewat Wi-Fi lokal. Promo ${price}/outlet/bulan untuk ${SATSET_OFFER.monthlyOutletLimit} outlet baru pertama setiap bulan.`
    : `${SATSET_PRODUCT_NAME} connects orders, kitchen, and payments over local Wi-Fi. ${price}/outlet/month for the first ${SATSET_OFFER.monthlyOutletLimit} new outlets each month.`;

  return {
    title,
    description,
    alternates: {
      canonical: "/satset",
      languages: { "id-ID": "/satset", "en-US": "/satset?lang=en" },
    },
    openGraph: {
      title,
      description,
      type: "website",
      siteName: SATSET_PRODUCT_NAME,
      locale: lang === "id" ? "id_ID" : "en_US",
      images: [{ url: "/satset-hero-rds.webp", width: 1280, height: 853, alt: "SatSet / Restaurant Display System devices connected over local Wi-Fi" }],
    },
  };
}
