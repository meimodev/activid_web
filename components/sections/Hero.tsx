import { Fragment } from 'react';
import Link from 'next/link';
import { Media } from '@/components/ui/Media';
import { siteContent } from '@/lib/site-content';

interface PageHeroProps {
  /** A few words: it must fit two lines on a phone. */
  title: string;
  children: React.ReactNode;
  cta?: { text: string; href: string };
  /** A second, quieter way on. */
  more?: { text: string; href: string };
  /** `className` is for the crop, e.g. `object-top`. */
  media?: { src: string; alt: string; className?: string };
  /** Short facts, set as one small line under the actions. */
  facts?: string[];
  /** A round seal that keeps turning on the corner of the picture; it is a link. */
  badge?: { text: string; href: string };
}

/**
 * The first screen of every page on this site: the title on the left, what it
 * means and what to do on the right, then the picture across the full column.
 * The picture is the large thing here, not the type. On a phone it all reads
 * straight down. The title arrives a word at a time, and a title that ends in
 * a full stop gets a live one: it keeps pulsing.
 */
export function PageHero({ title, children, cta, more, media, facts, badge }: PageHeroProps) {
  const words = title.split(' ');
  return (
    <section className="wrap pt-8 lg:pt-14">
      <div className="grid gap-x-12 gap-y-5 lg:grid-cols-2">
        <h1 className="t-display max-w-[14ch]">
          {words.map((word, i) => {
            const live = i === words.length - 1 && word.endsWith('.');
            return (
              <Fragment key={i}>
                <span className="on-load inline-block" style={{ '--i': i } as React.CSSProperties}>
                  {live ? word.slice(0, -1) : word}
                  {live && (
                    <>
                      <span aria-hidden className="live-dot" />
                      <span className="sr-only">.</span>
                    </>
                  )}
                </span>{' '}
              </Fragment>
            );
          })}
        </h1>

        <div className="flex flex-col items-start gap-6">
          <div className="t-lead on-load max-w-[44ch] space-y-3" style={{ '--i': 1 } as React.CSSProperties}>
            {children}
          </div>
          {(cta || more) && (
            <div className="on-load flex flex-wrap items-center gap-x-7 gap-y-3" style={{ '--i': 2 } as React.CSSProperties}>
              {cta && (
                <Link href={cta.href} className="btn">
                  {cta.text}
                </Link>
              )}
              {more && (
                <Link href={more.href} className="link font-medium">
                  {more.text}
                </Link>
              )}
            </div>
          )}
          {facts && (
            <p className="t-small on-load text-(--soft)" style={{ '--i': 3 } as React.CSSProperties}>
              {facts.join(' · ')}
            </p>
          )}
        </div>
      </div>

      {media && (
        <div className="on-load relative mt-10 lg:mt-12" style={{ '--i': 3 } as React.CSSProperties}>
          <div className="relative aspect-4/3 overflow-hidden rounded-(--radius) bg-(--tone) md:aspect-video lg:aspect-2/1">
            <Media src={media.src} alt={media.alt} className={media.className} sizes="(min-width: 1280px) 1152px, 100vw" priority />
          </div>
          {badge && (
            <Link
              href={badge.href}
              aria-label={badge.text}
              className="absolute right-4 -bottom-9 grid size-24 place-items-center transition-transform duration-300 hover:scale-105 active:scale-95 lg:right-10 lg:-bottom-12 lg:size-32"
            >
              {/* The turn is on this element, not the SVG, so the text is drawn once and only moved. */}
              <span aria-hidden className="spin absolute inset-0">
                <svg viewBox="0 0 100 100" className="size-full">
                  <circle cx="50" cy="50" r="50" fill="var(--ink)" />
                  <path id="hero-badge-ring" fill="none" d="M50,50 m-37,0 a37,37 0 1,1 74,0 a37,37 0 1,1 -74,0" />
                  <text fill="var(--paper)" fontSize="9.5" fontWeight="500">
                    <textPath href="#hero-badge-ring" textLength="230" lengthAdjust="spacing">
                      {`${badge.text} · ${badge.text} · `.toUpperCase()}
                    </textPath>
                  </text>
                </svg>
              </span>
              <span aria-hidden className="relative text-xl text-(--paper) lg:text-2xl">
                →
              </span>
            </Link>
          )}
        </div>
      )}
    </section>
  );
}

/** The home page's first screen. */
export function Hero() {
  const { hero, clients, footer } = siteContent;
  return (
    <PageHero
      title={hero.title}
      cta={hero.cta}
      more={{ text: 'See our work', href: '/work' }}
      media={{ src: hero.video, alt: 'Footage from an Activid podcast production' }}
      badge={hero.cta}
      facts={[`${hero.fact.label} ${hero.fact.value}`, `${clients.items.length} klien`, `${footer.locations.length} kantor`]}
    >
      <p>{hero.description}</p>
    </PageHero>
  );
}

/** First screen of a service page: its name, then what it is. */
export function ServiceHero({
  id,
  description,
  media,
  mediaClassName,
}: {
  id: string;
  description: string;
  media?: string;
  mediaClassName?: string;
}) {
  const service = siteContent.services.items.find(item => item.id === id)!;
  return (
    <PageHero
      title={service.title}
      cta={siteContent.hero.cta}
      media={media ? { src: media, alt: service.imageAlt, className: mediaClassName } : undefined}
    >
      <p>{description}</p>
    </PageHero>
  );
}
