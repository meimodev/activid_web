import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/Skeleton';
import { AnimatedGradientBackground } from '@/components/ui';
import Navigation from '@/components/layouts/Navigation';
import type { Metadata } from 'next';
import { siteContent } from '@/lib/site-content';

export const metadata: Metadata = {
  title: 'ACTIVID | Creative Agency',
  description: 'We are a creative agency that specializes in branding, social media management, event documentation, video production, and website development.',
  keywords: ['web design', 'web development', 'animations', 'framer motion', 'next.js', 'performance', 'accessibility'],
  authors: [{ name: 'ACTIVID Team' }],
  openGraph: {
    title: 'ACTIVID | Creative Agency',
    description: 'We are a creative agency that specializes in branding, social media management, event documentation, video production, and website development.',
    type: 'website',
    locale: 'en_US',
    siteName: 'ACTIVID',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ACTIVID | Creative Agency',
    description: 'We are a creative agency that specializes in branding, social media management, event documentation, video production, and website development.',
  },
};

// Dynamic imports with loading fallbacks for heavy animation components
// Requirements: 5.4 - Display skeleton screens during dynamic import
// Note: SSR is enabled for SSG (Static Site Generation) compatibility
const Hero = dynamic(() => import('@/components/sections').then(mod => ({ default: mod.Hero })), {
  loading: () => <Skeleton className="min-h-screen" />,
});

const AboutUs = dynamic(() => import('@/components/sections').then(mod => ({ default: mod.AboutUs })), {
  loading: () => <Skeleton className="h-96" />,
});

const Testimonials = dynamic(() => import('@/components/sections').then(mod => ({ default: mod.Testimonials })), {
  loading: () => <Skeleton className="h-96" />,
});

const ServiceStack = dynamic(() => import('@/components/sections').then(mod => ({ default: mod.ServiceStack })), {
  loading: () => <Skeleton className="min-h-screen" />,
});

const OurClients = dynamic(() => import('@/components/sections').then(mod => ({ default: mod.OurClients })), {
  loading: () => <Skeleton className="h-48" />,
});

const CTA = dynamic(() => import('@/components/sections').then(mod => ({ default: mod.CTA })), {
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
      <AnimatedGradientBackground className="fixed -z-50" />
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
