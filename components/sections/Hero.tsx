import Link from 'next/link';
import { Media } from '@/components/ui/Media';
import { siteContent } from '@/lib/site-content';

interface PageHeroProps {
  /** One entry per line; two lines at most, a few words each. */
  title: string[];
  children: React.ReactNode;
  cta?: { text: string; href: string };
  media?: { src: string; alt: string };
  fact?: { value: string; label: string };
}

/**
 * Narrow talk, wide headline — the first screen of every page on this site.
 * From lg the sentence and the action stand in a narrow left column while the
 * headline and the picture take the wide right one; on a phone it reads
 * straight down: headline, sentence, action, picture.
 */
export function PageHero({ title, children, cta, media, fact }: PageHeroProps) {
  return (
    <section
      className={`grid px-(--gutter) lg:grid-cols-12 lg:grid-rows-[auto_1fr] lg:gap-x-8 ${media ? 'lg:min-h-[calc(100svh-4rem)]' : 'pb-4'}`}
    >
      <h1 className="poster pt-6 lg:col-start-5 lg:col-end-13 lg:pt-8">
        {title.map((line, i) => (
          <span key={line} className="line-mask">
            <span style={{ '--i': i } as React.CSSProperties}>{line}</span>
          </span>
        ))}
      </h1>

      <div className="mt-6 flex flex-col items-start gap-7 lg:col-start-1 lg:col-end-5 lg:row-start-1 lg:row-end-3 lg:mt-0 lg:pt-[20svh]">
        <div className="t-lead on-load max-w-[26ch] space-y-4">{children}</div>
        {cta && (
          <Link href={cta.href} className="btn on-load w-full sm:w-auto" style={{ '--i': 1 } as React.CSSProperties}>
            {cta.text}
          </Link>
        )}
      </div>

      {/* The picture runs off the bottom of the first screen. From lg the fact
          block bites its top-left corner, and the top margin keeps that block
          clear of the headline; on a phone it sits in the bottom corner. */}
      {media && (
        <div
          className={`relative -mx-(--gutter) lg:col-start-5 lg:col-end-13 lg:row-start-2 lg:mx-0 mt-10 ${fact ? 'lg:mt-24' : 'lg:mt-12'}`}
        >
          <div className="relative aspect-4/3 overflow-hidden bg-(--ink) lg:aspect-auto lg:h-full lg:min-h-[38svh]">
            <Media src={media.src} alt={media.alt} sizes="(min-width: 1024px) 66vw, 100vw" priority />
          </div>
          {fact && (
            <div
              className="on-load absolute bottom-0 left-0 w-[62%] bg-(--pop) p-4 sm:w-64 sm:p-5 lg:top-0 lg:bottom-auto lg:-translate-y-1/2"
              style={{ '--i': 3 } as React.CSSProperties}
            >
              <p className="t-head">{fact.value}</p>
              <p className="t-small mt-1 font-medium">{fact.label}</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

/** The home page's first screen. */
export function Hero() {
  const { title, description, cta, video, fact } = siteContent.hero;
  return (
    <PageHero
      title={title}
      cta={cta}
      fact={fact}
      media={{ src: video, alt: 'Footage from an Activid podcast production' }}
    >
      <p>{description}</p>
    </PageHero>
  );
}

/** First screen of a service page: its poster name, then what it is in full. */
export function ServiceHero({ id, description, media }: { id: string; description: string; media?: string }) {
  const service = siteContent.services.items.find(item => item.id === id)!;
  return (
    <PageHero
      title={[service.short]}
      cta={siteContent.hero.cta}
      media={media ? { src: media, alt: service.imageAlt } : undefined}
    >
      <p className="font-bold">{service.title}</p>
      <p>{description}</p>
    </PageHero>
  );
}
