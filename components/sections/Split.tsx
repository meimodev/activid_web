import { Media } from '@/components/ui/Media';

const FIELDS = {
  ink: 'on-ink bg-(--ink) text-(--paper)',
  pop: 'bg-(--pop)',
  paper: 'bg-(--paper)',
  tone: 'bg-(--tone)',
} as const;

interface SplitProps {
  media: { src: string; alt: string };
  field: keyof typeof FIELDS;
  /** Picture on the right instead of the left (from lg). */
  flip?: boolean;
  children: React.ReactNode;
}

/** A picture and a flat field of colour, butted together edge to edge. */
export function Split({ media, field, flip, children }: SplitProps) {
  return (
    <article className="grid lg:grid-cols-2">
      <div className={`relative aspect-4/3 overflow-hidden bg-(--ink) lg:aspect-auto lg:min-h-[72svh] ${flip ? 'lg:order-2' : ''}`}>
        <div data-settle className="absolute inset-0">
          <Media src={media.src} alt={media.alt} sizes="(min-width: 1024px) 50vw, 100vw" />
        </div>
      </div>
      <div className={`flex flex-col items-start justify-center gap-5 px-(--gutter) py-12 lg:p-16 ${FIELDS[field]}`}>
        {children}
      </div>
    </article>
  );
}
