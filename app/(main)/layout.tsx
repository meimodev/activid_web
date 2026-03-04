import localFont from "next/font/local";
import "../globals.css";
import SmoothScroll from "@/components/layouts/SmoothScroll";
import Navigation from "@/components/layouts/Navigation";
import PageTransition from "@/components/layouts/PageTransition";
import { ProgressIndicator } from "@/components/animations/ProgressIndicator";
import { Footer } from "@/components/sections/Footer";

const geistSans = localFont({
    src: "../../public/fonts/poppins-regular.ttf",
    variable: "--font-geist-sans",
    display: "swap",
});

const geistMono = localFont({
    src: "../../public/fonts/poppins-regular.ttf",
    variable: "--font-geist-mono",
    display: "swap",
});

const bricolageGrotesque = localFont({
    src: "../../public/fonts/garet-book.ttf",
    variable: "--font-bricolage",
    display: "swap",
});

export default function MainLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <div className={`${geistSans.variable} ${geistMono.variable} ${bricolageGrotesque.variable} antialiased font-sans text-foreground bg-background min-h-screen`}>
            {/* Skip to main content link for keyboard navigation */}
            <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-100 focus:px-4 focus:py-2 focus:bg-purple-600 focus:text-white focus:rounded-md focus:outline-none focus:ring-2 focus:ring-purple-400"
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
        </div>
    );
}
