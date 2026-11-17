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
            <ServiceHero id="website-app" description={opening} media={page.mockups[1]} />

            <div className="t-lead grid gap-x-8 gap-y-5 px-(--gutter) pt-10 lg:grid-cols-12 lg:pt-14">
                {story.map((paragraph, i) => (
                    <p key={i} data-rise style={{ '--i': i } as React.CSSProperties} className={i ? 'lg:col-span-6' : 'lg:col-start-1 lg:col-end-7'}>
                        {paragraph}
                    </p>
                ))}
            </div>

            <section aria-labelledby="apps-heading" className="grid gap-x-8 gap-y-6 px-(--gutter) pt-(--gap-section) lg:grid-cols-12">
                <h2 id="apps-heading" data-rise className="t-head lg:col-span-4">In the hand</h2>
                <div className="lg:col-start-5 lg:col-end-13">
                    <Wall
                        tiles={workTiles.filter(tile => tile.href === '/services/website-app')}
                        linked={false}
                        row="[--row:14rem] sm:[--row:24rem] lg:[--row:32rem]"
                    />
                </div>
            </section>

            <div className="on-ink mt-(--gap-section) bg-(--ink) py-16 text-(--paper) lg:py-24">
                <Statement title={aiHighlight.badge}>
                    <p className="font-bold">{aiHighlight.title}</p>
                    <p>{aiHighlight.description}</p>
                </Statement>
            </div>

            <section aria-labelledby="cases-heading" className="px-(--gutter) pt-(--gap-section)">
                <h2 id="cases-heading" data-rise className="t-head max-w-[18ch]">{caseStudies.title}</h2>
                <dl className="mt-10 grid gap-x-8 gap-y-10 md:grid-cols-2 lg:grid-cols-3">
                    {caseStudies.items.map((item, i) => (
                        <div key={item.title} data-rise style={{ '--i': i % 3 } as React.CSSProperties}>
                            <dt className="t-lead font-bold">{item.title}</dt>
                            <dd className="mt-2 max-w-[44ch]">{item.description}</dd>
                        </div>
                    ))}
                </dl>
            </section>

            <section aria-labelledby="stack-heading" className="mt-(--gap-section) bg-(--pop) px-(--gutter) py-16 lg:py-24">
                <div className="grid gap-x-8 gap-y-4 lg:grid-cols-12">
                    <h2 id="stack-heading" data-rise className="t-lead font-bold lg:col-span-4">{techStack.title}</h2>
                    <p data-rise style={{ '--i': 1 } as React.CSSProperties} className="max-w-[46ch] lg:col-start-5 lg:col-end-13">
                        {techStack.description}
                    </p>
                </div>
                <ul className="mt-10 grid grid-cols-2 gap-x-8 gap-y-1 sm:grid-cols-3 lg:grid-cols-5">
                    {STACK.map((name, i) => (
                        <li key={name} data-rise style={{ '--i': i % 5 } as React.CSSProperties} className="t-head">
                            {name}
                        </li>
                    ))}
                </ul>
            </section>

            <CTA />
        </main>
    );
}
