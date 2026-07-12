import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Fraunces } from "next/font/google";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { isKenanganEnabled } from "@/lib/kenangan-event";
import "./kenangan.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--kk-font-display",
  display: "swap",
});

const satoshi = localFont({
  src: "../fonts/Satoshi-Variable.woff2",
  weight: "300 900",
  variable: "--kk-font-ui",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "KenanganKita",
    template: "%s | KenanganKita",
  },
  description:
    "Galeri foto langsung untuk acaramu. Tamu memotret dari ponsel, foto muncul seketika.",
  icons: { icon: "/favicon.ico" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function KenanganLayout({ children }: { children: ReactNode }) {
  if (!isKenanganEnabled()) notFound();

  return (
    <div className={`${fraunces.variable} ${satoshi.variable} kk-root`}>
      {children}
    </div>
  );
}
