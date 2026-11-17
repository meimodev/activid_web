import Image from 'next/image';
import { siteContent } from '@/lib/site-content';

/**
 * Names running off the edges: one line of client logos on an ink band,
 * cropped by both sides of the screen and drifting left. The track holds the
 * logos twice and slides by half its width, so the loop has no seam.
 */
export function OurClients() {
  const { title, lead, items } = siteContent.clients;

  return (
    <section id="clients">
      <div className="overflow-hidden bg-(--ink) py-[clamp(2.5rem,6vw,5rem)]">
        <div className="marquee flex w-max">
          {[false, true].map(copy => (
            <ul key={String(copy)} aria-hidden={copy} className="flex shrink-0 items-center">
              {items.map(client => (
                <li
                  key={client.name}
                  className="relative mx-[clamp(1.25rem,3vw,3rem)] h-[clamp(4.5rem,9vw,8rem)] w-[clamp(7.5rem,15vw,13rem)]"
                >
                  <Image src={client.logo} alt={copy ? '' : client.name} fill sizes="208px" className="object-contain" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      <div className="grid gap-4 px-(--gutter) pt-8 lg:grid-cols-12 lg:gap-x-8">
        <h2 data-rise className="t-head lg:col-span-4">
          {title}
        </h2>
        <p data-rise style={{ '--i': 1 } as React.CSSProperties} className="t-lead max-w-[38ch] lg:col-start-5 lg:col-end-13">
          {items.length} {lead}
        </p>
      </div>
    </section>
  );
}
