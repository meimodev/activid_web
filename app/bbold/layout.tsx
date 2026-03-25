import type { Metadata } from "next";
import localFont from "next/font/local";
import { BBOLD_META } from "./data";

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
  weight: "700",
  style: "normal",
  display: "swap",
});

export const metadata: Metadata = {
  title: BBOLD_META.title,
  description: BBOLD_META.description,
};

export default function BboldLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${bboldDisplay.variable} ${bboldBody.variable} min-h-screen bg-[#1f2937] text-stone-100`}>
      {children}
    </div>
  );
}
