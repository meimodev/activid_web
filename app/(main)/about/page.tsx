import type { Metadata } from 'next';
import { AboutUs } from '@/components/sections/AboutUs';
import { siteContent } from '@/lib/site-content';

export const metadata: Metadata = {
    title: 'About Us | ACTIVID',
    description: 'Activid is a creative agency specializing in branding, social media management, and digital production.',
};

export default function AboutPage() {
    return (
        <main className="min-h-screen pt-20">
            <AboutUs className="bg-transparent" />
        </main>
    );
}
