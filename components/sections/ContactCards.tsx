'use client';

import { trackContact } from '@/lib/analytics';
import { siteContent } from '@/lib/site-content';

/** The two offices side by side; each one is a link to its map. */
export default function ContactCards() {
    const { officesTitle, offices } = siteContent.contactPage;

    return (
        <section aria-labelledby="offices-heading" className="wrap pt-(--gap-section)">
            <h2 id="offices-heading" data-rise className="t-head">
                {officesTitle}
            </h2>
            <ul className="mt-8 grid gap-3 lg:grid-cols-2 lg:gap-5">
                {offices.map((office, i) => (
                    <li key={office.city} data-rise style={{ '--i': i } as React.CSSProperties}>
                        <a
                            href={office.mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackContact.officeLocationClick(office.city)}
                            className="group flex h-full flex-col gap-4 rounded-(--radius) bg-(--tone) p-6 lg:p-10"
                        >
                            <span className="t-head">{office.city}</span>
                            <span className="block whitespace-pre-line">
                                {(Array.isArray(office.address) ? office.address : [office.address]).join('\n')}
                            </span>
                            <span className="link mt-2 font-medium">
                                Open in Maps <span aria-hidden>↗</span>
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    );
}
