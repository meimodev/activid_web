import localFont from "next/font/local";

// One variable grotesk does every job on this surface: heavy and narrow for
// the poster type (see .poster in agency.css), regular for reading.
//
// It lives in its own module, imported by the layout AFTER globals.css, on
// purpose. Declared in the layout itself, its @font-face was bundled into the
// front of the stylesheet that carries globals.css, which every surface loads,
// so /satset, /loit and the rest all preloaded this 205 KB file. e2e/satset
// counts preloaded fonts and catches it if this regresses.
export const bricolage = localFont({
    src: "../fonts/google/bricolagegrotesque/normal.woff2",
    variable: "--font-bricolage",
    weight: "200 800",
    display: "swap",
});
