import { Allura, Plus_Jakarta_Sans } from "next/font/google";

export const venusBody = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-venus-body",
  weight: ["200", "300", "400", "500", "600", "700"],
});

export const venusScript = Allura({
  subsets: ["latin"],
  weight: ["400"],
});
