import type { Metadata } from "next";
import "../globals.css";
import "./agency.css";
import { bricolage } from "./fonts"; // after the stylesheets: see fonts.ts
import Navigation from "@/components/layouts/Navigation";
import { Footer } from "@/components/sections/Footer";

// ACTIVID-site defaults. Deliberately no `title.template`: every page under
// (main) already spells out its own "… | ACTIVID" suffix, and a template would
// double it.
export const metadata: Metadata = {
    title: {
        default: "ACTIVID | Creative Agency",
        template: "%s",
    },
    openGraph: {
        type: "website",
        locale: "id_ID",
        siteName: "ACTIVID",
    },
    twitter: {
        card: "summary_large_image",
    },
};

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={`agency ${bricolage.variable} min-h-svh font-sans antialiased`}>
            {/* Skip to main content link for keyboard navigation */}
            <a
                href="#main-content"
                className="btn sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50"
            >
                Skip to main content
            </a>
            <Navigation />
            <div id="main-content">{children}</div>
            <Footer />
        </div>
    );
}
