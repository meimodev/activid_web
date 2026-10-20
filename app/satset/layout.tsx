import localFont from "next/font/local";
import "./satset.css";

const satsetDisplay = localFont({
  src: [
    { path: "../fonts/google/bricolagegrotesque/normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/google/bricolagegrotesque/normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/google/bricolagegrotesque/normal.woff2", weight: "700", style: "normal" },
    { path: "../fonts/google/bricolagegrotesque/normal.woff2", weight: "800", style: "normal" },
  ],
  variable: "--font-satset-display",
  display: "swap",
});

const satsetBody = localFont({
  src: [
    { path: "../fonts/google/hankengrotesk/normal.woff2", weight: "400", style: "normal" },
    { path: "../fonts/google/hankengrotesk/normal.woff2", weight: "500", style: "normal" },
    { path: "../fonts/google/hankengrotesk/normal.woff2", weight: "600", style: "normal" },
    { path: "../fonts/google/hankengrotesk/normal.woff2", weight: "700", style: "normal" },
  ],
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
