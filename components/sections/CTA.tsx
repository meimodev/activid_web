'use client';

import { useState } from 'react';
import { siteContent } from '@/lib/site-content';
import { trackCTA } from '@/lib/analytics';

const { title, lead, action } = siteContent.ctaSection;
const services = siteContent.services.items;
const whatsapp = siteContent.contactPage.methods.whatsapp.href;

/** The brief, as it will arrive in the agency's WhatsApp. */
function briefFor(picked: string[]) {
  if (picked.length === 0) return 'Halo Activid, saya ingin memulai proyek.';
  return `Halo Activid, saya ingin memulai proyek. Yang saya butuhkan: ${picked.join(', ')}.`;
}

/**
 * The closing pitch, and the page's one live thing: tick the services you
 * need and the page writes the WhatsApp message for you. Without script the
 * button still opens WhatsApp with the plain greeting.
 */
export function CTA() {
  const [picked, setPicked] = useState<string[]>([]);
  const brief = briefFor(services.filter(s => picked.includes(s.id)).map(s => s.title));

  const toggle = (id: string) =>
    setPicked(current => (current.includes(id) ? current.filter(x => x !== id) : [...current, id]));

  return (
    <section id="cta" aria-labelledby="cta-heading" className="wrap pt-(--gap-section)">
      <div className="on-ink relative isolate grid gap-x-12 gap-y-8 overflow-hidden rounded-(--radius) px-6 py-10 lg:grid-cols-2 lg:p-14">
        {/* Two discs, a shade off the panel, drift behind the words. */}
        <span aria-hidden className="float absolute -bottom-24 -left-16 -z-10 size-64 rounded-full bg-(--paper)/5" />
        <span
          aria-hidden
          className="float absolute -top-14 right-[12%] -z-10 size-36 rounded-full bg-(--paper)/5"
          style={{ '--dx': '-1.25rem', '--dy': '1.5rem', animationDelay: '-4s' } as React.CSSProperties}
        />
        <div>
          <h2 id="cta-heading" data-rise className="t-head">
            {title}
          </h2>
          <p data-rise style={{ '--i': 1 } as React.CSSProperties} className="t-lead mt-3 max-w-[32ch] text-(--soft)">
            {lead}
          </p>
        </div>

        <div className="flex flex-col items-start gap-6">
          <ul className="flex flex-wrap gap-2">
            {services.map(service => {
              const on = picked.includes(service.id);
              return (
                <li key={service.id}>
                  <button
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(service.id)}
                    className={`flex min-h-11 items-center gap-2.5 rounded-full px-4 py-2 transition-[background-color,color,scale] duration-200 active:scale-95 ${
                      on ? 'bg-(--paper) text-(--ink)' : 'bg-(--tone) hover:bg-(--paper)/25'
                    }`}
                  >
                    {/* The marker fills in when the service is in the brief. */}
                    <span aria-hidden className={`size-2 rounded-full ${on ? 'bg-(--ink)' : 'bg-(--paper)/40'}`} />
                    {service.short}
                  </button>
                </li>
              );
            })}
          </ul>

          <p aria-live="polite" className="t-small max-w-[46ch] text-(--soft)">
            “{brief}”
          </p>

          <a
            href={`${whatsapp}?text=${encodeURIComponent(brief)}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackCTA.ctaSectionClick()}
            className="btn group"
          >
            {action}
            <span aria-hidden className="nudge transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
