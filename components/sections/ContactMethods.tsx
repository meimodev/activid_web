'use client';

import { trackContact } from '@/lib/analytics';
import { siteContent } from '@/lib/site-content';

/** The three ways in, one per poster line: the channel left, its address right. */
export function ContactMethods() {
    const { whatsapp, email, instagram } = siteContent.contactPage.methods;
    const methods = [
        { ...whatsapp, track: trackContact.whatsappClick },
        { ...email, track: trackContact.emailClick },
        { ...instagram, track: trackContact.instagramClick },
    ];

    return (
        <section aria-labelledby="methods-heading" className="on-ink bg-(--ink) px-(--gutter) py-16 text-(--paper) lg:py-24">
            <h2 id="methods-heading" data-rise className="t-lead font-bold">
                Reach us directly
            </h2>
            <ul className="mt-10">
                {methods.map((method, i) => (
                    <li key={method.label} data-rise style={{ '--i': i } as React.CSSProperties}>
                        <a
                            href={method.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => method.track()}
                            className="group flex flex-col pb-5 transition-colors duration-200 hover:text-(--pop) lg:flex-row lg:items-baseline lg:justify-between lg:gap-8 lg:pb-0"
                        >
                            <span className="poster">{method.label}</span>
                            <span className="t-lead mt-1.5 shrink-0 lg:mt-0">
                                {method.value}{' '}
                                <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                                    ↗
                                </span>
                            </span>
                        </a>
                    </li>
                ))}
            </ul>
        </section>
    );
}
