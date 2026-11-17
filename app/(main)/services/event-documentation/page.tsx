import { Metadata } from "next";
import { ServiceHero } from "@/components/sections/Hero";
import { Split } from "@/components/sections/Split";
import { Statement } from "@/components/sections/Statement";
import { CTA } from "@/components/sections/CTA";
import { siteContent } from "@/lib/site-content";

const page = siteContent.servicePages.eventDocumentation;

export const metadata: Metadata = {
    title: `${page.header.title} | Activid Services`,
    description: [page.header.description].flat().join(' '),
};

export default function EventDocumentationPage() {
    const { header, projects, overview } = page;

    return (
        <main>
            <ServiceHero id="event-documentation" description={[header.description].flat()[0]} media={header.image} />

            <Statement title={overview.title} className="pt-(--gap-section)">
                <p>{overview.content}</p>
            </Statement>

            <section aria-labelledby="projects-heading" className="pt-(--gap-section)">
                <h2 id="projects-heading" data-rise className="t-head wrap pb-8 lg:pb-12">Projects</h2>
                <div className="space-y-16 lg:space-y-24">
                    {projects.map((project, i) => (
                        <Split
                            key={project.title}
                            media={{ src: project.image ?? '', alt: `${project.title}, event documentation` }}
                            flip={i % 2 === 1}
                        >
                            <h3 data-rise className="t-lead font-medium">{project.title}</h3>
                            <p data-rise style={{ '--i': 1 } as React.CSSProperties} className="max-w-[48ch]">{project.description}</p>
                        </Split>
                    ))}
                </div>
            </section>

            <CTA />
        </main>
    );
}
