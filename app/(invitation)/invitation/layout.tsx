import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Activid Invitation | Template Undangan Digital",
    description:
        "Jelajahi template undangan digital premium Activid. Tersedia untuk pernikahan, ulang tahun, acara, dan syukuran. Lihat harga promo dan order via WhatsApp.",
    alternates: {
        canonical: "/invitation",
    },
    openGraph: {
        title: "Activid Invitation | Template Undangan Digital",
        description:
            "Jelajahi template undangan digital premium Activid. Tersedia untuk pernikahan, ulang tahun, acara, dan syukuran. Lihat harga promo dan order via WhatsApp.",
        url: "/invitation",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Activid Invitation | Template Undangan Digital",
        description:
            "Jelajahi template undangan digital premium Activid. Tersedia untuk pernikahan, ulang tahun, acara, dan syukuran. Lihat harga promo dan order via WhatsApp.",
    },
    keywords: [
        "undangan digital",
        "undangan website",
        "undangan pernikahan",
        "undangan ulang tahun",
        "undangan acara",
        "undangan syukuran",
        "template undangan",
        "Activid Invitation",
    ],
};

export default function InvitationLandingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return children;
}
