import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/sections/Hero';
import { Split } from '@/components/sections/Split';
import { CTA } from '@/components/sections/CTA';
import { siteContent } from '@/lib/site-content';

export const metadata: Metadata = {
    title: 'Our Services | ACTIVID',
    description: 'Explore our range of creative services from branding and social media to video production and web development.',
};

const FIELDS = ['ink', 'pop', 'tone'] as const;

export default function ServicesPage() {
    const { title, subtitle, items } = siteContent.services;

    return (
        <main>
            <PageHero title={[title]} cta={siteContent.hero.cta}>
                <p>{subtitle}</p>
            </PageHero>

            <div className="mt-12 lg:mt-20">
                {items.map((service, i) => (
                    <Split
                        key={service.id}
                        media={{ src: service.image, alt: service.imageAlt }}
                        field={FIELDS[i % FIELDS.length]}
                        flip={i % 2 === 1}
                    >
                        <h2 data-rise className="t-head">{service.title}</h2>
                        <p data-rise style={{ '--i': 1 } as React.CSSProperties} className="max-w-[46ch]">
                            {service.description}
                        </p>
                        <Link href={service.buttonLink} className="btn mt-2">
                            See {service.short.toLowerCase()} work
                        </Link>
                    </Split>
                ))}
            </div>

            <CTA />
        </main>
    );
}
