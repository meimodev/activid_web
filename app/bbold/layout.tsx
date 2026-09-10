import type { Metadata } from "next";
import localFont from "next/font/local";
import { BBOLD_META } from "./data";

const bboldBrand = localFont({
  src: "../../public/fonts/poppins-bold.ttf",
  variable: "--font-bbold-brand",
  weight: "700",
  style: "normal",
  display: "swap",
});

const bboldDisplay = localFont({
  src: "../../public/fonts/lemon-milk-bold.otf",
  variable: "--font-bbold-display",
  weight: "700",
  style: "normal",
  display: "swap",
});

const bboldBody = localFont({
  src: "../../public/fonts/poppins-regular.ttf",
  variable: "--font-bbold-body",
  weight: "400",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: BBOLD_META.title,
  description: BBOLD_META.description,
};

export default function BboldLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${bboldBrand.variable} ${bboldDisplay.variable} ${bboldBody.variable} min-h-screen bg-[#d4c3b0] text-[#241a15]`}>
      {children}
    </div>
  );
}
