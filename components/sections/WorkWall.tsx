import Link from 'next/link';
import { Media } from '@/components/ui/Media';
import { workTiles, type WorkTile } from '@/lib/work';

/**
 * Finished work in columns. Every picture keeps its own shape, so nothing is
 * cropped, and the columns end where they end. CSS columns do the layout:
 * no script, and it reflows to any count of pictures or width of screen.
 */
export function Wall({
  tiles,
  linked = true,
  cols = 'columns-2 lg:columns-3',
}: {
  tiles: WorkTile[];
  linked?: boolean;
  /** How many columns, as classes. A set of a few like-shaped pictures wants its own count. */
  cols?: string;
}) {
  return (
    <ul className={`gap-3 lg:gap-5 ${cols}`}>
      {tiles.map((tile, i) => {
        const body = (
          <>
            <span
              className="relative isolate block overflow-hidden rounded-(--radius) bg-(--tone)"
              style={{ aspectRatio: tile.ratio }}
            >
              <Media
                src={tile.src}
                alt={`${tile.name}, ${tile.kind}`}
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="transition-transform duration-500 ease-out group-hover:scale-[1.03]"
              />
            </span>
            <span className="t-small mt-2.5 block">
              <span className="block font-medium">{tile.name}</span>
              <span className="block text-(--soft)">{tile.kind}</span>
            </span>
          </>
        );
        return (
          <li key={tile.src} data-rise style={{ '--i': i % 3 } as React.CSSProperties} className="mb-6 break-inside-avoid lg:mb-8">
            {linked ? (
              <Link href={tile.href} className="group block">
                {body}
              </Link>
            ) : (
              <div className="group">{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

// One piece from each kind of work, ordered so the columns come out even at
// both counts: property, app, podcast, food, feed, event film.
export const FEATURED = [6, 19, 18, 3, 11, 15].map(i => workTiles[i]);

/** The home page's cut of the work. */
export function WorkWall() {
  return (
    <section id="work" className="wrap pt-(--gap-section)">
      <div className="mb-8 flex flex-wrap items-baseline justify-between gap-x-8 gap-y-2 lg:mb-12">
        <h2 data-rise className="t-head">
          Selected work
        </h2>
        <Link href="/work" className="link font-medium">
          See all work
        </Link>
      </div>
      <Wall tiles={FEATURED} />
    </section>
  );
}
