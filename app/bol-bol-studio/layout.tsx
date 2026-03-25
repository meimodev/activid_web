import type { Metadata } from "next";
import { Bungee } from "next/font/google";
import localFont from "next/font/local";

const studioDisplay = Bungee({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-studio-display",
  display: "swap",
});

const studioBody = localFont({
  src: "../../public/fonts/poppins-regular.ttf",
  variable: "--font-studio-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Bol-bol Studio",
  description:
    "Self photo studio, bebaskan ekspresimu untuk mengabadikan momen-momen terindah, gunakan gaya suka-sukamu di Bol-bol Studio.",
};

export default function BolBolStudioLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${studioDisplay.className} ${studioDisplay.variable} ${studioBody.variable} min-h-screen bg-[#372f2d] text-stone-100`}>
      {children}
    </div>
  );
}
