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

export default function AboutPage() {
    const { title, lead } = siteContent.aboutUs;

    return (
        <main>
            <PageHero title={[title]} cta={siteContent.hero.cta}>
                <p>{lead}</p>
            </PageHero>
            <div className="px-(--gutter) pt-12 pb-(--gap-section) lg:pt-20">
                <AboutBody />
            </div>
            <OurClients />
            <ServicesList />
            <CTA />
        </main>
    );
}
