import { Metadata } from "next";
import { ServiceHero } from "@/components/sections/Hero";
import { Statement } from "@/components/sections/Statement";
import { Wall } from "@/components/sections/WorkWall";
import { CTA } from "@/components/sections/CTA";
import { siteContent } from "@/lib/site-content";
import { workTiles } from "@/lib/work";

const page = siteContent.servicePages.websiteApp;
const [opening, ...story] = [page.header.description].flat();

export const metadata: Metadata = {
    title: `${page.header.title} | Activid Services`,
    description: opening,
};

const STACK = ['Flutter', 'React', 'Next.js', 'TypeScript', 'Node.js', 'NestJS', 'Laravel', 'Python', 'Rust', 'Docker'];

export default function WebsiteAppPage() {
    const { techStack, caseStudies, aiHighlight } = page;

    return (
        <main>
            <ServiceHero id="website-app" description={opening} media={page.mockups[0]} mediaClassName="object-top" />

            <Statement title="How we build" className="pt-(--gap-section)">
                {story.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                ))}
            </Statement>

            <Statement title="In the hand" className="pt-(--gap-section) pb-10">
                <p>Aplikasi mobile yang kami rancang dan bangun.</p>
            </Statement>
            <div className="wrap">
                <Wall tiles={workTiles.filter(tile => tile.href === '/services/website-app')} linked={false} cols="columns-3" />
            </div>

            <section aria-labelledby="ai-heading" className="wrap pt-(--gap-section)">
                <div className="on-ink grid gap-x-12 gap-y-4 rounded-(--radius) px-6 py-10 lg:grid-cols-12 lg:p-14">
                    <h2 id="ai-heading" data-rise className="t-head lg:col-span-4">{aiHighlight.badge}</h2>
                    <div data-rise style={{ '--i': 1 } as React.CSSProperties} className="max-w-[56ch] space-y-4 lg:col-span-8">
                        <p className="t-lead font-medium">{aiHighlight.title}</p>
                        <p className="text-(--soft)">{aiHighlight.description}</p>
                    </div>
                </div>
            </section>

            <section aria-labelledby="cases-heading" className="wrap pt-(--gap-section)">
                <h2 id="cases-heading" data-rise className="t-head">{caseStudies.title}</h2>
                <dl className="mt-8 grid gap-x-12 gap-y-8 md:grid-cols-2 lg:mt-12 lg:grid-cols-3">
                    {caseStudies.items.map((item, i) => (
                        <div key={item.title} data-rise style={{ '--i': i % 3 } as React.CSSProperties}>
                            <dt className="t-lead font-medium">{item.title}</dt>
                            <dd className="mt-2 text-(--soft)">{item.description}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section aria-labelledby="stack-heading" className="wrap pt-(--gap-section)">
                <div className="grid gap-x-12 gap-y-6 rounded-(--radius) bg-(--tone) px-6 py-10 lg:grid-cols-12 lg:p-14">
                    <div className="lg:col-span-4">
                        <h2 id="stack-heading" data-rise className="t-head">{techStack.title}</h2>
                        <p data-rise style={{ '--i': 1 } as React.CSSProperties} className="mt-3 text-(--soft)">
                            {techStack.description}
                        </p>
                    </div>
                    <ul className="flex flex-wrap content-start gap-2 lg:col-span-8">
                        {STACK.map((name, i) => (
                            <li key={name} data-rise style={{ '--i': i % 5 } as React.CSSProperties} className="rounded-full bg-(--paper) px-4 py-2 font-medium">
                                {name}
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <CTA />
        </main>
    );
}
