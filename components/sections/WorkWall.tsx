import Link from 'next/link';
import { Media } from '@/components/ui/Media';
import { workTiles, type WorkTile } from '@/lib/work';

/**
 * An uneven wall: every row is one height, every tile as wide as its picture,
 * so edges never line up from one row to the next. Each tile's flex-basis is
 * its natural width at the row height and it grows by its own ratio, which
 * fills the row without the tiles trading proportions.
 */
export function Wall({
  tiles,
  linked = true,
  row = '[--row:9.5rem] sm:[--row:15rem] lg:[--row:19rem]',
}: {
  tiles: WorkTile[];
  linked?: boolean;
  /** Row height, as classes that set --row. A set of a few upright pictures wants a taller row. */
  row?: string;
}) {
  return (
    <ul className={`group/wall flex flex-wrap gap-2 ${row}`}>
      {tiles.map((tile, i) => {
        const caption = (
          <>
            <span className="relative block h-(--row) overflow-hidden bg-(--ink)">
              <Media
                src={tile.src}
                alt={`${tile.name}, ${tile.kind}`}
                sizes="(min-width: 1024px) 40vw, 80vw"
                className="transition-transform duration-500 ease-out group-hover/tile:scale-[1.04]"
              />
            </span>
            <span className="t-small mt-2 block leading-snug">
              <span className="block font-bold">{tile.name}</span>
              <span className="block text-(--soft)">{tile.kind}</span>
            </span>
          </>
        );
        return (
          <li
            key={tile.src}
            data-rise
            style={{ '--i': i % 3, flex: `${tile.ratio} 1 calc(${tile.ratio} * var(--row))` } as React.CSSProperties}
            className="min-w-0 transition-opacity duration-300 group-hover/wall:opacity-60 hover:opacity-100!"
          >
            {linked ? (
              <Link href={tile.href} className="group/tile block">
                {caption}
              </Link>
            ) : (
              <div className="group/tile">{caption}</div>
            )}
          </li>
        );
      })}
      {/* Soaks up the spare width of the last row so its tiles keep their shape. */}
      <li aria-hidden className="grow-[100]" />
    </ul>
  );
}

// A cut across every kind of work: property, feed, podcast, food, app, film.
export const FEATURED = [6, 11, 18, 3, 19, 0, 16, 13, 8, 21, 4].map(i => workTiles[i]);

/** Giant title, uneven wall. */
export function WorkWall() {
  return (
    <section id="work" className="px-(--gutter) pt-(--gap-section)">
      <div className="mb-8 flex items-baseline justify-between gap-6">
        <h2 data-rise className="poster">
          Work
        </h2>
        <Link href="/work" className="link shrink-0 font-bold">
          See all work
        </Link>
      </div>
      <Wall tiles={FEATURED} />
    </section>
  );
}
