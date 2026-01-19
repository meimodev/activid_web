import type { Metadata } from "next";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";

export const metadata: Metadata = {
  title: {
    default: "Premium Landing Page | Build Beautiful Experiences",
    template: "%s | Premium Landing Page",
  },
  description: "A sophisticated multi-page landing page with immersive animations, 60fps performance, and exceptional user experience. Built with Next.js and Framer Motion.",
  keywords: ['landing page', 'web design', 'web development', 'animations', 'framer motion', 'next.js', 'performance', 'accessibility', 'responsive design'],
  authors: [{ name: 'Premium Landing Page Team' }],
  creator: 'Premium Landing Page Team',
  publisher: 'Premium Landing Page',
  metadataBase: new URL('https://example.com'), // Replace with actual domain
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'Premium Landing Page',
    title: 'Premium Landing Page | Build Beautiful Experiences',
    description: 'A sophisticated multi-page landing page with immersive animations, 60fps performance, and exceptional user experience.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Premium Landing Page | Build Beautiful Experiences',
    description: 'A sophisticated multi-page landing page with immersive animations, 60fps performance, and exceptional user experience.',
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
      <GoogleAnalytics />
      <body>
        {children}
      </body>
    </html>
  );
}
