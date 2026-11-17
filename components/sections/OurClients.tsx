import Image from 'next/image';
import { siteContent } from '@/lib/site-content';

/**
 * Who already works with the agency: one ink panel (the logos are drawn in
 * white, so they need it) with a single line of them drifting left. The track
 * holds the logos twice and slides by half its width, so the loop has no seam.
 */
export function OurClients() {
  const { title, lead, items } = siteContent.clients;

  return (
    <section id="clients" className="wrap pt-(--gap-section)">
      <div className="on-ink overflow-hidden rounded-(--radius) py-8 lg:py-10">
        <div className="flex flex-wrap items-baseline justify-between gap-x-8 gap-y-1 px-6 lg:px-10">
          <h2 data-rise className="t-lead font-medium">
            {title}
          </h2>
          <p data-rise style={{ '--i': 1 } as React.CSSProperties} className="text-(--soft)">
            {items.length} {lead}
          </p>
        </div>

        <div className="marquee mt-4 flex w-max">
          {[false, true].map(copy => (
            <ul key={String(copy)} aria-hidden={copy} className="flex shrink-0 items-center">
              {items.map(client => (
                <li key={client.name} className="relative mx-3 h-20 w-32 lg:mx-5 lg:h-28 lg:w-44">
                  <Image src={client.logo} alt={copy ? '' : client.name} fill sizes="176px" className="object-contain" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </section>
  );
}
