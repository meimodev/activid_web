import type { Metadata } from 'next';
import { Hero } from '@/components/sections/Hero';
import { OurClients } from '@/components/sections/OurClients';
import { AboutUs } from '@/components/sections/AboutUs';
import { ServicesList } from '@/components/sections/ServicesList';
import { WorkWall } from '@/components/sections/WorkWall';
import { Testimonials } from '@/components/sections/Testimonials';
import { CTA } from '@/components/sections/CTA';

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

export default function Home() {
  return (
    <main>
      <Hero />
      <OurClients />
      <AboutUs />
      <ServicesList />
      <WorkWall />
      <Testimonials />
      <CTA />
    </main>
  );
}
