import { Media } from '@/components/ui/Media';
import { siteContent } from '@/lib/site-content';

// A cut of the short-form videos the team produces.
const FILM = 'https://ik.imagekit.io/geb6bfhmhx/activid%20web/video/reels-production.mp4#t=5';

/** Wide picture, colour tile, facts. Also the body of /about. */
export function AboutBody() {
  const { aboutUs, footer } = siteContent;

  return (
    <div className="grid gap-4 lg:grid-cols-12">
      <div className="relative -mx-(--gutter) aspect-4/3 overflow-hidden bg-(--ink) lg:col-span-8 lg:mx-0 lg:aspect-16/10">
        <Media src={FILM} alt="A reel of short videos produced by Activid" sizes="(min-width: 1024px) 66vw, 100vw" />
      </div>

      <div className="flex flex-col gap-8 lg:col-span-4">
        {/* The two offices, on the accent: each name opens its map. */}
        <ul data-rise className="flex flex-col justify-end gap-6 bg-(--pop) p-5 lg:min-h-[60%]">
          {footer.locations.map(office => (
            <li key={office.name}>
              <a href={office.mapLink} target="_blank" rel="noopener noreferrer" className="group block">
                <span className="t-head block transition-transform duration-300 group-hover:translate-x-2">
                  {office.name} <span aria-hidden>↗</span>
                </span>
                <span className="t-small mt-1 block whitespace-pre-line font-medium">{office.address}</span>
              </a>
            </li>
          ))}
        </ul>

        <dl className="t-small grid grid-cols-2 gap-x-6 gap-y-5">
          {aboutUs.facts.map((fact, i) => (
            <div key={fact.label} data-rise style={{ '--i': i } as React.CSSProperties} className="last:col-span-2">
              <dt className="text-(--soft)">{fact.label}</dt>
              <dd className="mt-0.5 font-bold">{fact.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}

export function AboutUs() {
  const { title, lead } = siteContent.aboutUs;

  return (
    <section id="about" className="px-(--gutter) pt-(--gap-section)">
      <h2 data-rise className="t-head">
        {title}
      </h2>
      <p data-rise style={{ '--i': 1 } as React.CSSProperties} className="t-lead mt-6 mb-12 max-w-[52ch] lg:mb-16">
        {lead}
      </p>
      <AboutBody />
    </section>
  );
}
