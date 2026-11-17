'use client';

import { trackContact } from '@/lib/analytics';
import { siteContent } from '@/lib/site-content';

const FIELDS = ['bg-(--pop)', 'bg-(--tone)'];

/** The two offices as flat blocks; each one is a link to its map. */
export default function ContactCards() {
    const { officesTitle, offices } = siteContent.contactPage;

    return (
        <section aria-labelledby="offices-heading" className="pt-(--gap-section)">
            <h2 id="offices-heading" data-rise className="t-head px-(--gutter) pb-8">
                {officesTitle}
            </h2>
            <ul className="grid lg:grid-cols-2">
                {offices.map((office, i) => (
                    <li key={office.city}>
                        <a
                            href={office.mapLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => trackContact.officeLocationClick(office.city)}
                            className={`group flex h-full min-h-[22rem] flex-col justify-between gap-10 px-(--gutter) py-10 lg:p-12 ${FIELDS[i % FIELDS.length]}`}
                        >
                            <span>
                                <span className="poster block transition-transform duration-300 group-hover:translate-x-2">{office.city}</span>
                                <span className="link mt-3 inline-block font-bold">Open in Maps ↗</span>
                            </span>
                            <span className="block whitespace-pre-line">
                                {(Array.isArray(office.address) ? office.address : [office.address]).join('\n')}
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    );
}
