import type { Metadata } from "next";
import type { Lang } from "./copy";
import { formatRupiah, SATSET_OFFER } from "./offer";

export function getSatsetMetadata(lang: Lang): Metadata {
  const price = formatRupiah(SATSET_OFFER.monthlyPrice, lang);
  const title = lang === "id"
    ? `SatSet | Sistem restoran di Wi-Fi lokal, promo ${price}/bulan`
    : `SatSet | Local Wi-Fi restaurant system, ${price}/month offer`;
  const description = lang === "id"
    ? `Jalankan layanan restoran lewat Wi-Fi lokal. Promo ${price} per outlet per bulan untuk ${SATSET_OFFER.monthlyOutletLimit} outlet baru pertama yang mulai berlangganan setiap bulan kalender.`
    : `Run restaurant service over local Wi-Fi. ${price} per outlet per month for the first ${SATSET_OFFER.monthlyOutletLimit} new outlets starting a subscription each calendar month.`;

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
      locale: lang === "id" ? "id_ID" : "en_US",
      images: [{ url: "/satset-hero.webp", width: 1280, height: 853, alt: "SatSet restaurant devices on local Wi-Fi" }],
    },
  };
}
