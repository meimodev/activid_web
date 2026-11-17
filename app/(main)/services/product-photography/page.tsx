import { Metadata } from "next";
import { ServiceHero } from "@/components/sections/Hero";
import { Statement } from "@/components/sections/Statement";
import { Wall } from "@/components/sections/WorkWall";
import { CTA } from "@/components/sections/CTA";
import { siteContent } from "@/lib/site-content";
import { workTiles } from "@/lib/work";

const page = siteContent.servicePages.productPhotography;

export const metadata: Metadata = {
    title: `${page.header.title} | Activid Services`,
    description: [page.header.description].flat().join(' '),
};

export default function ProductPhotographyPage() {
    const { header, projects, overview } = page;

    return (
        <main>
            <ServiceHero id="product-photography" description={[header.description].flat()[0]} media={header.image} />

            {projects.map(project => (
                <div key={project.title}>
                    <Statement title={project.client ?? ''} className="pt-(--gap-section) pb-10">
                        <p className="font-bold">{project.title}</p>
                        <p>{project.description}</p>
                    </Statement>
                    <div className="px-(--gutter)">
                        <Wall tiles={workTiles.filter(tile => tile.name === project.client)} linked={false} />
                    </div>
                </div>
            ))}

            <Statement title={overview.title} className="pt-(--gap-section)">
                <p>{overview.content}</p>
            </Statement>

            <CTA />
        </main>
    );
}
