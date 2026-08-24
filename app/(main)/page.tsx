import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/Skeleton';
import Navigation from '@/components/layouts/Navigation';
import { Hero } from '@/components/sections/Hero';
import type { Metadata } from 'next';
import { siteContent } from '@/lib/site-content';

const TITLE = 'ACTIVID | Creative Agency';
const DESCRIPTION =
  'We are a creative agency that specializes in branding, social media management, event documentation, video production, and website development.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    type: 'website',
    locale: 'id_ID',
    siteName: 'ACTIVID',
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
  },
};

// Below-the-fold sections are lazy-loaded with skeleton fallbacks.
// SSR stays on for SSG compatibility.
//
// Import the concrete files, NOT the '@/components/sections' barrel: every
// dynamic() pointing at the barrel resolves the same module, so webpack emits
// one chunk holding every section the barrel re-exports (Features,
// TeamShowcase, ProjectShowcase, …) instead of one chunk per section.
//
// Hero is a plain static import — it is the LCP element, so a chunk round-trip
// before it can paint is exactly the wrong trade.
const AboutUs = dynamic(() => import('@/components/sections/AboutUs').then(mod => ({ default: mod.AboutUs })), {
  loading: () => <Skeleton className="h-96" />,
});

const Testimonials = dynamic(() => import('@/components/sections/Testimonials').then(mod => ({ default: mod.Testimonials })), {
  loading: () => <Skeleton className="h-96" />,
});

const ServiceStack = dynamic(() => import('@/components/sections/ServiceStack').then(mod => ({ default: mod.ServiceStack })), {
  loading: () => <Skeleton className="min-h-screen" />,
});

const OurClients = dynamic(() => import('@/components/sections/OurClients').then(mod => ({ default: mod.OurClients })), {
  loading: () => <Skeleton className="h-48" />,
});

const CTA = dynamic(() => import('@/components/sections/CTA').then(mod => ({ default: mod.CTA })), {
  loading: () => <Skeleton className="h-96" />,
});

/**
 * Home page - Premium landing page with immersive animations
 * Implements SSG (Static Site Generation) for optimal performance
 * Requirements: 1.1, 5.4
 */
export default function Home() {
  const { hero: heroContent, testimonials: testimonialData, services: servicesData } = siteContent;

  return (
    <main className="min-h-screen">
      {/* No AnimatedGradientBackground here: at `fixed -z-50` inside <main> it
          painted behind the opaque bg on the .dark wrapper in the layout, which
          creates no stacking context — so it rendered nothing while running a
          permanent animation. Removed rather than un-hidden; the sections all
          carry their own background. */}
      <Hero content={heroContent} />
      <Navigation position="sticky" />
      <OurClients />
      <AboutUs />
      <ServiceStack
        services={servicesData.items}
        title={servicesData.title}
        subtitle={servicesData.subtitle}
      />
      <Testimonials
        title={testimonialData.title}
        testimonials={testimonialData.items}
      />
      <CTA />
    </main>
  );
}
