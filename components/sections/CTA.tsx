'use client';

import { useState } from 'react';
import { siteContent } from '@/lib/site-content';
import { trackCTA } from '@/lib/analytics';

const { title, lead, verb } = siteContent.ctaSection;
const services = siteContent.services.items;
const whatsapp = siteContent.contactPage.methods.whatsapp.href;

/** The brief, as it will arrive in the agency's WhatsApp. */
function briefFor(picked: string[]) {
  if (picked.length === 0) return 'Halo Activid, saya ingin memulai proyek.';
  return `Halo Activid, saya ingin memulai proyek. Yang saya butuhkan: ${picked.join(', ')}.`;
}

/**
 * The closing pitch, and the page's one live thing: tick the services you
 * need and the page writes the WhatsApp message for you. The whole accent band
 * is the link; its one word is the button. Without script the band still opens
 * WhatsApp with the plain greeting.
 */
export function CTA() {
  const [picked, setPicked] = useState<string[]>([]);
  const brief = briefFor(services.filter(s => picked.includes(s.id)).map(s => s.title));

  const toggle = (id: string) =>
    setPicked(current => (current.includes(id) ? current.filter(x => x !== id) : [...current, id]));

  return (
    <section id="cta" aria-labelledby="cta-heading" className="pt-(--gap-section)">
      <div className="grid gap-x-8 gap-y-6 px-(--gutter) pb-10 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <h2 id="cta-heading" data-rise className="t-head">
            {title}
          </h2>
          <p data-rise style={{ '--i': 1 } as React.CSSProperties} className="mt-4 max-w-[34ch]">
            {lead}
          </p>
        </div>
        <ul className="flex flex-wrap content-start gap-2 lg:col-start-5 lg:col-end-13">
          {services.map((service, i) => {
            const on = picked.includes(service.id);
            return (
              <li key={service.id} data-rise style={{ '--i': i % 3 } as React.CSSProperties}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(service.id)}
                  className={`min-h-12 px-5 py-2.5 font-bold transition-[background-color,color,scale] duration-200 active:scale-95 ${
                    on ? 'bg-(--ink) text-(--paper)' : 'bg-(--tone) hover:bg-(--pop)'
                  }`}
                >
                  {/* The marker lights up when the service is in the brief. */}
                  <span aria-hidden className={`mr-3 inline-block size-2.5 ${on ? 'bg-(--pop)' : 'bg-(--ink)/25'}`} />
                  {service.title}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <a
        href={`${whatsapp}?text=${encodeURIComponent(brief)}`}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackCTA.ctaSectionClick()}
        className="group flex min-h-[46svh] flex-col justify-between overflow-hidden bg-(--pop) px-(--gutter) pt-6 transition-colors duration-200 hover:bg-(--ink) hover:text-(--pop) focus-visible:bg-(--ink) focus-visible:text-(--pop) lg:min-h-[60svh]"
      >
        <span className="flex items-start justify-between gap-6">
          <span aria-live="polite" className="t-lead max-w-[30ch] font-medium">
            “{brief}”
          </span>
          <svg
            aria-hidden
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="5"
            className="size-8 shrink-0 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 lg:size-12"
          >
            <path d="M10 38 38 10M14 10h24v24" />
          </svg>
        </span>
        <span className="poster -mb-[0.06em] block text-[39vw]! leading-[0.8]! lg:text-[32vw]! [font-variation-settings:'wdth'_100]!">
          {verb}
          <span className="sr-only"> on WhatsApp (opens in a new tab)</span>
        </span>
      </a>
    </section>
  );
}
