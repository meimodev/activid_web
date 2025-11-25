import type { Metadata } from "next";
import { Geist, Geist_Mono, Bricolage_Grotesque } from "next/font/google";
import "./globals.css";
import SmoothScroll from "@/components/layouts/SmoothScroll";
import Navigation from "@/components/layouts/Navigation";
import PageTransition from "@/components/layouts/PageTransition";
import { ProgressIndicator } from "@/components/animations/ProgressIndicator";
import { Footer } from "@/components/sections/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const bricolageGrotesque = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});

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
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${bricolageGrotesque.variable} antialiased`}
      >
        {/* Skip to main content link for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          Skip to main content
        </a>
        <SmoothScroll>
          <Navigation isGlobal={true} />
          <ProgressIndicator type="line" position="top" color="#3b82f6" thickness={3} />
          <PageTransition>
            <div id="main-content">
              {children}
            </div>
          </PageTransition>
          <Footer />
        </SmoothScroll>
      </body>
    </html>
  );
}
