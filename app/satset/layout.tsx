import type { Metadata } from "next";
import { Bricolage_Grotesque, Hanken_Grotesk } from "next/font/google";
import "./satset.css";

const satsetDisplay = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-satset-display",
  display: "swap",
});

const satsetBody = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-satset-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SatSet — Sistem restoran yang jalan di Wi-Fi kamu sendiri.",
  description:
    "Ubah HP dan tablet Android biasa jadi sistem pemesanan yang lengkap. Pairing lewat QR dalam hitungan detik. Tanpa internet, tanpa tagihan cloud bulanan, tanpa langganan untuk mencatat pesanan.",
  openGraph: {
    title: "SatSet — Sistem restoran yang jalan di Wi-Fi kamu sendiri.",
    description:
      "Sistem pemesanan restoran yang jalan di Wi-Fi sendiri. Tetap jalan offline, tanpa langganan, datamu tetap di jaringanmu.",
    type: "website",
  },
};

export default function SatsetLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`satset-root ${satsetDisplay.variable} ${satsetBody.variable}`}
    >
      {children}
    </div>
  );
}
