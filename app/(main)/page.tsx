import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/Skeleton';
import { AnimatedGradientBackground } from '@/components/ui';
import Navigation from '@/components/layouts/Navigation';
import type { HeroContent } from '@/types/hero.types';
import type { Testimonial } from '@/components/sections/Testimonials';
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

const ScrollExpandableCards = dynamic(() => import('@/components/sections').then(mod => ({ default: mod.ScrollExpandableCards })), {
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

  const getServiceIcon = (id: string) => {
    const props = {
      xmlns: "http://www.w3.org/2000/svg",
      width: "24",
      height: "24",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round" as const,
      strokeLinejoin: "round" as const,
    };

    switch (id) {
      case 'branding':
        return (
          <svg {...props}>
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        );
      case 'social-media':
        return (
          <svg {...props}>
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
            <path d="M2 12h20" />
          </svg>
        );
      case 'event-documentation':
        return (
          <svg {...props}>
            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
            <circle cx="12" cy="13" r="4" />
          </svg>
        );
      case 'video-podcast':
        return (
          <svg {...props}>
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        );
      case 'website-app':
        return (
          <svg {...props}>
            <circle cx="12" cy="12" r="10" />
            <line x1="2" y1="12" x2="22" y2="12" />
            <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
          </svg>
        );
      case 'product-photography':
        return (
          <svg {...props}>
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <circle cx="8.5" cy="8.5" r="1.5" />
            <polyline points="21 15 16 10 5 21" />
          </svg>
        );
      default:
        return null;
    }
  };

  const expandableCards = servicesData.items.map(service => ({
    ...service,
    icon: getServiceIcon(service.id),
  }));

  return (
    <main className="min-h-screen">
      <AnimatedGradientBackground className="fixed -z-50" />
      <Hero content={heroContent} />
      <Navigation position="sticky" />
      <OurClients />
      <AboutUs />
      <ScrollExpandableCards cards={expandableCards} title={servicesData.title} />
      <Testimonials
        title={testimonialData.title}
        testimonials={testimonialData.items}
      />
      <CTA />
    </main>
  );
}
