import { siteContent } from '@/lib/site-content';

/** The body of /about: the two offices and the facts, side by side. */
export function AboutBody() {
  const { aboutUs, footer } = siteContent;

  return (
    <div className="grid gap-3 lg:grid-cols-2 lg:gap-5">
      {/* Each office name opens its map. */}
      <ul data-rise className="grid gap-6 rounded-(--radius) bg-(--tone) p-6 sm:grid-cols-2 lg:p-10">
        {footer.locations.map(office => (
          <li key={office.name}>
            <a href={office.mapLink} target="_blank" rel="noopener noreferrer" className="group block">
              <span className="t-lead block font-medium">
                {office.name}{' '}
                <span aria-hidden className="inline-block transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </span>
              <span className="t-small mt-1 block whitespace-pre-line">{office.address}</span>
            </a>
          </li>
        ))}
      </ul>

      <dl data-rise style={{ '--i': 1 } as React.CSSProperties} className="grid grid-cols-2 gap-x-6 gap-y-5 rounded-(--radius) bg-(--tone) p-6 lg:p-10">
        {aboutUs.facts.map(fact => (
          <div key={fact.label} className="last:col-span-2">
            <dt className="t-small text-(--soft)">{fact.label}</dt>
            <dd className="mt-0.5 font-medium">{fact.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
