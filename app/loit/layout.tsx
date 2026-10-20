import localFont from "next/font/local";
import type { Metadata } from "next";
import "./loit.css";

const loitDisplay = localFont({
  src: [
    { path: "../fonts/google/gabarito/normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/google/gabarito/normal.woff2", weight: "700", style: "normal" },
    { path: "../fonts/google/gabarito/normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-loit-display",
  display: "swap",
});

const loitBody = localFont({
  src: [
    { path: "../fonts/google/hankengrotesk/normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/google/hankengrotesk/normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/google/hankengrotesk/normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-loit-body",
  display: "swap",
});

const loitNum = localFont({
  src: [
    { path: "../fonts/google/spacegrotesk/normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/google/spacegrotesk/normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/google/spacegrotesk/normal.woff2", weight: "700", style: "normal" },
  ],
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
