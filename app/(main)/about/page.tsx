import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/Hero';
import { AboutBody } from '@/components/sections/AboutUs';
import { OurClients } from '@/components/sections/OurClients';
import { ServicesList } from '@/components/sections/ServicesList';
import { CTA } from '@/components/sections/CTA';
import { siteContent } from '@/lib/site-content';

export const metadata: Metadata = {
    title: 'About Us | ACTIVID',
    description: 'Activid is a creative agency specializing in branding, social media management, and digital production.',
};

// The agency at work: a camera over a plate during a product shoot.
const PHOTO = 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/another%20web%20asset/our_service_cover_2.jpg';

export default function AboutPage() {
    const { title, lead } = siteContent.aboutUs;

    return (
        <main>
            <PageHero
                title={title}
                cta={siteContent.hero.cta}
                media={{ src: PHOTO, alt: 'A camera held over a plated dish during a product shoot' }}
            >
                <p>{lead}</p>
            </PageHero>
            <div className="wrap pt-3 lg:pt-5">
                <AboutBody />
            </div>
            <OurClients />
            <ServicesList />
            <CTA />
        </main>
    );
}
