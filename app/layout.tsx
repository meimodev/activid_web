import "./globals.css";
import type { Metadata } from "next";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

// Root metadata is inherited by every product in this app — the ACTIVID site
// under (main), plus invitation, kenangan, bbold, bol-bol-studio, satset and
// loit, which are separate brands with their own layout metadata. So keep this
// to what is genuinely shared: no `title.template` (it would suffix every
// brand's title) and no `alternates.canonical` (a root '/' canonical is
// inherited by every page that doesn't override it). Brand-specific metadata
// belongs in the route group's own layout.
export const metadata: Metadata = {
  title: "ACTIVID",
  description:
    "ACTIVID is a creative agency in Manado - Tondano: social media management, event documentation, video production, product photography, and website development.",
  metadataBase: new URL("https://www.activid.id"),
  openGraph: {
    type: "website",
    locale: "id_ID",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <GoogleAnalytics />
        {children}
      </body>
    </html>
  );
}
