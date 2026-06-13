import type { Metadata } from "next";
import { Gabarito, Hanken_Grotesk, Space_Grotesk } from "next/font/google";
import "./loit.css";

const loitDisplay = Gabarito({
  subsets: ["latin"],
  weight: ["600", "700", "800"],
  variable: "--font-loit-display",
  display: "swap",
});

const loitBody = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-loit-body",
  display: "swap",
});

const loitNum = Space_Grotesk({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-loit-num",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LOIT — Uang bareng, semua jelas.",
  description:
    "Atur kas kelompok dan keuangan keluarga di satu ruang yang transparan. Foto struk, langsung tercatat. Jalan walau tanpa internet.",
  openGraph: {
    title: "LOIT — Uang bareng, semua jelas.",
    description:
      "Aplikasi keuangan bersama untuk kelompok dan keluarga. Transparan, scan struk pakai AI, jalan tanpa internet.",
    type: "website",
  },
};

export default function LoitLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`loit-root ${loitDisplay.variable} ${loitBody.variable} ${loitNum.variable} min-h-screen`}
    >
      {children}
    </div>
  );
}
