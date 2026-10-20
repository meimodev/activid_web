import localFont from "next/font/local";

export const royalSerif = localFont({
  src: [
    { path: "../../../app/fonts/google/cormorantgaramond/normal.woff2", weight: "300", style: "normal" },
    { path: "../../../app/fonts/google/cormorantgaramond/normal.woff2", weight: "400", style: "normal" },
    { path: "../../../app/fonts/google/cormorantgaramond/normal.woff2", weight: "500", style: "normal" },
    { path: "../../../app/fonts/google/cormorantgaramond/normal.woff2", weight: "600", style: "normal" },
    { path: "../../../app/fonts/google/cormorantgaramond/normal.woff2", weight: "700", style: "normal" },
    { path: "../../../app/fonts/google/cormorantgaramond/italic.woff2", weight: "300", style: "italic" },
    { path: "../../../app/fonts/google/cormorantgaramond/italic.woff2", weight: "400", style: "italic" },
    { path: "../../../app/fonts/google/cormorantgaramond/italic.woff2", weight: "500", style: "italic" },
    { path: "../../../app/fonts/google/cormorantgaramond/italic.woff2", weight: "600", style: "italic" },
    { path: "../../../app/fonts/google/cormorantgaramond/italic.woff2", weight: "700", style: "italic" },
  ],
  variable: "--font-royal-serif",
  display: "swap",
});

export const royalScript = localFont({
  src: [
    { path: "../../../app/fonts/google/pinyonscript/normal.woff2", weight: "400", style: "normal" },
  ],
  variable: "--font-royal-script",
  display: "swap",
});

export const royalSans = localFont({
  src: [
    { path: "../../../app/fonts/google/inter/normal.woff2", weight: "300", style: "normal" },
    { path: "../../../app/fonts/google/inter/normal.woff2", weight: "400", style: "normal" },
    { path: "../../../app/fonts/google/inter/normal.woff2", weight: "500", style: "normal" },
    { path: "../../../app/fonts/google/inter/normal.woff2", weight: "600", style: "normal" },
  ],
  variable: "--font-royal-sans",
  display: "swap",
});
