import localFont from "next/font/local";

// One calm sans does every job on this surface, at two weights (400 and 500).
//
// It lives in its own module, imported by the layout AFTER globals.css, on
// purpose. Declared in the layout itself, its @font-face was bundled into the
// front of the stylesheet that carries globals.css, which every surface loads,
// so /satset, /loit and the rest all preloaded this file. e2e/satset counts
// preloaded fonts and catches it if this regresses.
export const sans = localFont({
    src: "../fonts/google/dmsans/normal.woff2",
    variable: "--font-agency",
    weight: "400 600",
    display: "swap",
});
