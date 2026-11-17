'use client';

import { trackContact } from '@/lib/analytics';
import { siteContent } from '@/lib/site-content';

/** The three ways in, one per row: the channel on the left, its address on the right. */
export function ContactMethods() {
    const { whatsapp, email, instagram } = siteContent.contactPage.methods;
    const methods = [
        { ...whatsapp, track: trackContact.whatsappClick },
        { ...email, track: trackContact.emailClick },
        { ...instagram, track: trackContact.instagramClick },
    ];

    return (
        <section aria-labelledby="methods-heading" className="wrap pt-(--gap-section)">
            <h2 id="methods-heading" data-rise className="t-head">
                Reach us directly
            </h2>
            <ul className="mt-8 space-y-2">
                {methods.map((method, i) => (
                    <li key={method.label} data-rise style={{ '--i': i } as React.CSSProperties}>
                        <a
                            href={method.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => method.track()}
                            className="row group"
                        >
                            <span className="t-lead font-medium">{method.label}</span>
                            <span className="text-right">
                                {method.value}{' '}
                                <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
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
