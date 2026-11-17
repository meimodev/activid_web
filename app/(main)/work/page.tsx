import type { Metadata } from 'next';
import { PageHero } from '@/components/sections/Hero';
import { FEATURED, Wall } from '@/components/sections/WorkWall';
import { CTA } from '@/components/sections/CTA';
import { siteContent } from '@/lib/site-content';
import { workTiles } from '@/lib/work';

export const metadata: Metadata = {
    title: 'Our Work | ACTIVID',
    description: 'Showcase of our latest creative projects including branding, social media, and production.',
};

// The home page's cut first, then everything else: one wall, every kind of work mixed.
const ARCHIVE = [...FEATURED, ...workTiles.filter(tile => !FEATURED.includes(tile))];

export default function WorkPage() {
    return (
        <main>
            <PageHero title={['Our work']} cta={siteContent.hero.cta}>
                <p>Foto, feed, film, podcast, dan aplikasi yang kami kerjakan untuk brand di Sulawesi Utara. Ketuk satu karya untuk melihat layanannya.</p>
            </PageHero>
            <div className="px-(--gutter) pt-12 lg:pt-20">
                <Wall tiles={ARCHIVE} />
            </div>
            <CTA />
        </main>
    );
}
