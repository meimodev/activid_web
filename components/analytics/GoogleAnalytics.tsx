'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { GA_MEASUREMENT_ID, pageview } from '@/lib/analytics';

/**
 * Component to handle page view tracking on route changes
 */
function PageViewTracker() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (pathname) {
            const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
            pageview(url);
        }
    }, [pathname, searchParams]);

    return null;
}

/**
 * Google Analytics component that initializes GA4 and tracks page views
 * Add this component to your root layout
 */
export function GoogleAnalytics() {
    // Don't render if no measurement ID is configured
    if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') {
        if (process.env.NODE_ENV === 'development') {
            console.warn(
                '⚠️ Google Analytics: No measurement ID configured. Set NEXT_PUBLIC_GA_MEASUREMENT_ID in your environment variables.'
            );
        }
        return null;
    }

    return (
        <>
            {/* Google Analytics Script */}
            <Script
                strategy="afterInteractive"
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
            />
            <Script
                id="google-analytics"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{
                    __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_path: window.location.pathname,
              send_page_view: true,
              cookie_flags: 'SameSite=None;Secure',
            });
          `,
                }}
            />
            {/* Page view tracker wrapped in Suspense for searchParams */}
            <Suspense fallback={null}>
                <PageViewTracker />
            </Suspense>
        </>
    );
}

export default GoogleAnalytics;
