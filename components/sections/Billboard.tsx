import Image from 'next/image';
import { LOGO_WHITE } from '@/lib/site-content';

/**
 * The loud part of the quiet pages (legal, 404): the page's own words, set
 * huge on an ink band. Each line is a list of phrases that slides one way
 * while the next slides the other, with the mark spinning between phrases.
 * Decoration only: it repeats what the heading already says, so it is hidden
 * from screen readers. All of its motion is in agency.css (.billboard).
 */
export function Billboard({ lines }: { lines: string[][] }) {
  return (
    <div aria-hidden className="wrap pt-10 lg:pt-12">
      <div className="billboard on-ink overflow-hidden rounded-(--radius) py-5 lg:py-8">
        {lines.map((phrases, n) => {
          // Repeat the phrases until one half of the track covers the band, which is
          // never wider than about 9em of this type (a letter is roughly half an em).
          const width = phrases.reduce((em, phrase) => em + phrase.length * 0.5 + 1.3, 0);
          const half = Array.from({ length: Math.ceil(12 / width) }, () => phrases).flat();
          return (
            <div key={n} className={n % 2 ? 'text-(--soft)' : ''}>
              {/* The track holds the line twice and slides by half its width, so the loop has no seam. */}
              <div className="marquee flex w-max">
                {[0, 1].map(copy => (
                  <div key={copy} className="flex shrink-0 items-center">
                    {half.map((phrase, i) => (
                      <span key={i} className="flex items-center">
                        {phrase}
                        <Image src={LOGO_WHITE} alt="" width={96} height={96} className="spin mx-[0.3em] size-[0.62em]" />
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
