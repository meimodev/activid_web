import type { Metadata } from "next";
import type { Lang } from "./copy";
import { formatRupiah, SATSET_OFFER } from "./offer";
import { SATSET_PRODUCT_NAME } from "./brand";

export function getSatsetMetadata(lang: Lang): Metadata {
  const price = formatRupiah(SATSET_OFFER.monthlyPrice, lang);
  const title = SATSET_PRODUCT_NAME;
  const description = lang === "id"
    ? `${SATSET_PRODUCT_NAME} menghubungkan pelayan, dapur, dan kasir dalam satu sistem lewat Wi-Fi lokal. Mulai dari ${price}/outlet/bulan, gratis 7 hari.`
    : `${SATSET_PRODUCT_NAME} connects servers, kitchen, and cashier in one system over local Wi-Fi. From ${price}/outlet/month, free for 7 days.`;

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
