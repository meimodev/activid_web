import { Metadata } from "next";
import { ServiceHero } from "@/components/sections/Hero";
import { Split } from "@/components/sections/Split";
import { Statement } from "@/components/sections/Statement";
import { Wall } from "@/components/sections/WorkWall";
import { CTA } from "@/components/sections/CTA";
import { siteContent } from "@/lib/site-content";
import { workTiles } from "@/lib/work";

const page = siteContent.servicePages.videoPodcast;

export const metadata: Metadata = {
    title: `${page.header.title} | Activid Services`,
    description: [page.header.description].flat().join(' '),
};

export default function VideoPodcastPage() {
    const { header, mainProject } = page;

    return (
        <main>
            <ServiceHero id="video-podcast" description={[header.description].flat()[0]} media={header.image} />

            <section aria-labelledby="project-heading" className="pt-(--gap-section)">
                <h2 id="project-heading" data-rise className="poster px-(--gutter) pb-8">Project</h2>
                <Split media={{ src: mainProject.image, alt: `${mainProject.title}, podcast production` }} field="ink">
                    <h3 data-rise className="t-head">{mainProject.title}</h3>
                    <p data-rise style={{ '--i': 1 } as React.CSSProperties} className="max-w-[46ch]">{mainProject.description}</p>
                    <p data-rise style={{ '--i': 2 } as React.CSSProperties} className="t-lead max-w-[36ch] font-bold text-(--pop)">
                        {mainProject.result}
                    </p>
                </Split>
            </section>

            <Statement title="More films" className="pt-(--gap-section) pb-10">
                <p>Company profile, dokumentasi kampus, dan film pernikahan yang kami produksi dari konsep sampai final rendering.</p>
            </Statement>
            <div className="px-(--gutter)">
                <Wall
                    tiles={workTiles.filter(tile => tile.href === '/services/event-documentation')}
                    row="[--row:11rem] sm:[--row:13rem] lg:[--row:15rem]"
                />
            </div>

            <CTA />
        </main>
    );
}
