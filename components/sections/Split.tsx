import { Media } from '@/components/ui/Media';

interface SplitProps {
  media: { src: string; alt: string };
  /** Picture on the right instead of the left (from lg). */
  flip?: boolean;
  children: React.ReactNode;
}

/** A picture and what it shows, side by side; stacked on a phone. */
export function Split({ media, flip, children }: SplitProps) {
  return (
    <article className="wrap grid items-center gap-x-12 gap-y-6 lg:grid-cols-2">
      <div className={`relative aspect-4/3 overflow-hidden rounded-(--radius) bg-(--tone) ${flip ? 'lg:order-2' : ''}`}>
        <div data-settle className="absolute inset-0">
          <Media src={media.src} alt={media.alt} sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
      </div>
      <div className="flex flex-col items-start gap-4">{children}</div>
    </article>
  );
}
