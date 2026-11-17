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

            <section className="bg-(--pop) px-(--gutter) py-16 lg:py-24">
                <h2 data-rise className="t-lead font-bold">What is included</h2>
                <ul className="mt-8 space-y-3">
                    {INCLUDED.map((item, i) => (
                        <li key={item} data-rise style={{ '--i': i % 3 } as React.CSSProperties} className="t-head">
                            {item}
                        </li>
                    ))}
                </ul>
            </section>

            <Statement title={showcasesTitle} className="pt-(--gap-section) pb-10">
                <p>{showcasesSubtitle}. Setiap feed berangkat dari palet warna brand itu sendiri.</p>
            </Statement>
            <div className="px-(--gutter)">
                <Wall
                    tiles={workTiles.filter(tile => tile.href === '/services/social-media')}
                    linked={false}
                    row="[--row:14rem] sm:[--row:20rem] lg:[--row:30rem]"
                />
            </div>

            <Statement title={projectsTitle} className="pt-(--gap-section) pb-10">
                <p>{projectsSubtitle}.</p>
            </Statement>
            <ul>
                {projects.map((project, i) => (
                    <li key={project.client} className="grid lg:grid-cols-[5fr_7fr]">
                        <div className="on-ink bg-(--ink) px-(--gutter) py-10 text-(--paper) lg:p-12">
                            <h3 data-rise className="t-head">{project.client}</h3>
                            <p className="mt-3 font-bold">{project.service}</p>
                            {project.link && (
                                <a href={project.link} target="_blank" rel="noopener noreferrer" className="link mt-6 inline-block">
                                    {project.handle} on Instagram ↗
                                </a>
                            )}
                        </div>
                        <div className={`space-y-5 px-(--gutter) py-10 lg:p-12 ${i % 2 ? 'bg-(--paper)' : 'bg-(--tone)'}`}>
                            <p data-rise className="max-w-[52ch]">{project.description}</p>
                            <p data-rise style={{ '--i': 1 } as React.CSSProperties} className="t-lead max-w-[36ch] font-bold">
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
