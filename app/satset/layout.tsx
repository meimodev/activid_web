import localFont from "next/font/local";
import "./satset.css";

const satsetDisplay = localFont({
  src: "./fonts/bricolage-latin.woff2",
  weight: "700",
  variable: "--font-satset-display",
  display: "swap",
});

const satsetBody = localFont({
  src: "./fonts/hanken-latin.woff2",
  weight: "100 900",
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
