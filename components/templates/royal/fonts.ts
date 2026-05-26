import { Cormorant_Garamond, Pinyon_Script, Inter } from "next/font/google";

export const royalSerif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-royal-serif",
  display: "swap",
});

export const royalScript = Pinyon_Script({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-royal-script",
  display: "swap",
});

export const royalSans = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-royal-sans",
  display: "swap",
});
