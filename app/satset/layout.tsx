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
