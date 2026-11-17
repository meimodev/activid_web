import { Metadata } from "next";
import { ServiceHero } from "@/components/sections/Hero";
import { Statement } from "@/components/sections/Statement";
import { Wall } from "@/components/sections/WorkWall";
import { CTA } from "@/components/sections/CTA";
import { siteContent } from "@/lib/site-content";
import { workTiles } from "@/lib/work";

const page = siteContent.servicePages.socialMedia;

export const metadata: Metadata = {
    title: `${page.header.title} | Activid Services`,
    description: [page.header.description].flat().join(' '),
};

const INCLUDED = [
    'Identitas brand & palet warna',
    'Strategi konten & copywriting',
    'Estetika feed & video reels',
    'Pertumbuhan organik & jangkauan',
];

export default function SocialMediaPage() {
    const { header, showcasesTitle, showcasesSubtitle, projectsTitle, projectsSubtitle, projects } = page;

    return (
        <main>
            <ServiceHero id="social-media" description={[header.description].flat()[0]} media={header.image} />

            <section aria-labelledby="included-heading" className="wrap pt-(--gap-section)">
                <div className="grid gap-x-12 gap-y-5 rounded-(--radius) bg-(--tone) px-6 py-10 lg:grid-cols-12 lg:p-14">
                    <h2 id="included-heading" data-rise className="t-head lg:col-span-4">What is included</h2>
                    <ul className="t-lead grid gap-x-12 gap-y-3 sm:grid-cols-2 lg:col-span-8">
                        {INCLUDED.map((item, i) => (
                            <li key={item} data-rise style={{ '--i': i % 2 } as React.CSSProperties}>
                                {item}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <Statement title={showcasesTitle} className="pt-(--gap-section) pb-10">
                <p>{showcasesSubtitle}.</p>
            </Statement>
            <div className="wrap">
                <Wall
                    tiles={workTiles.filter(tile => tile.href === '/services/social-media')}
                    linked={false}
                    cols="columns-2 lg:columns-4"
                />
            </div>

            <Statement title={projectsTitle} className="pt-(--gap-section) pb-10">
                <p>{projectsSubtitle}.</p>
            </Statement>
            <ul className="wrap space-y-3 lg:space-y-5">
                {projects.map(project => (
                    <li key={project.client} className="grid gap-x-12 gap-y-5 rounded-(--radius) bg-(--tone) p-6 lg:grid-cols-12 lg:p-10">
                        <div className="lg:col-span-4">
                            <h3 data-rise className="t-lead font-medium">{project.client}</h3>
                            <p className="mt-1 text-(--soft)">{project.service}</p>
                            {project.link && (
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="link t-small mt-4 inline-block font-medium">
                                    {project.handle} on Instagram <span aria-hidden>↗</span>
                                </a>
                            )}
                        </div>
                        <div className="space-y-4 lg:col-span-8">
                            <p data-rise className="max-w-[56ch]">{project.description}</p>
                            <p data-rise style={{ '--i': 1 } as React.CSSProperties} className="max-w-[56ch] font-medium">
                                {project.result}
                            </p>
                        </div>
                    </li>
                ))}
            </ul>

            <CTA />
        </main>
    );
}
