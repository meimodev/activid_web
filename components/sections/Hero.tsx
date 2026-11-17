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
}

/**
 * The first screen of every page on this site: the title on the left, what it
 * means and what to do on the right, then the picture across the full column.
 * The picture is the large thing here, not the type. On a phone it all reads
 * straight down.
 */
export function PageHero({ title, children, cta, more, media, facts }: PageHeroProps) {
  return (
    <section className="wrap pt-8 lg:pt-14">
      <div className="grid gap-x-12 gap-y-5 lg:grid-cols-2">
        <h1 className="t-display on-load max-w-[14ch]">{title}</h1>

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
        <div
          className="on-load relative mt-10 aspect-4/3 overflow-hidden rounded-(--radius) bg-(--tone) md:aspect-video lg:mt-12 lg:aspect-2/1"
          style={{ '--i': 3 } as React.CSSProperties}
        >
          <Media src={media.src} alt={media.alt} className={media.className} sizes="(min-width: 1280px) 1152px, 100vw" priority />
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
