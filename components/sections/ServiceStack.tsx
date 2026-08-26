'use client';

import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { trackService } from '@/lib/analytics';
import { depthRidge, depthScale, depthScrim, stackDepth } from '@/lib/stack-depth';
import type { ServiceItem } from '@/types/site-content.types';

export interface ServiceStackProps {
  services: ServiceItem[];
  title: string;
  className?: string;
}

const iconProps = {
  width: 24,
  height: 24,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

const serviceIcons: Record<string, React.ReactNode> = {
  'social-media': (
    <svg {...iconProps}>
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
  'event-documentation': (
    <svg {...iconProps}>
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  ),
  'video-podcast': (
    <svg {...iconProps}>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  'website-app': (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="10" />
      <line x1="2" y1="12" x2="22" y2="12" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  'product-photography': (
    <svg {...iconProps}>
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <circle cx="8.5" cy="8.5" r="1.5" />
      <polyline points="21 15 16 10 5 21" />
    </svg>
  ),
};

interface ServiceStackCardProps {
  service: ServiceItem;
  index: number;
  count: number;
  progress: ReturnType<typeof useScroll>['scrollYProgress'];
  pinned: boolean;
}

function ServiceStackCard({ service, index, count, progress, pinned }: ServiceStackCardProps) {
  const depth = useTransform(progress, p => stackDepth(p, index, count));
  const scale = useTransform(depth, depthScale);
  const scrim = useTransform(depth, depthScrim);
  const y = useTransform(depth, depthRidge);

  const isLast = index === count - 1;
  const accent = service.color;

  return (
    <motion.div
      className={pinned ? 'sticky top-[var(--pin-top)]' : ''}
      style={
        pinned
          ? {
              marginBottom: isLast ? undefined : 'var(--card-gap)',
              scale,
              y,
              transformOrigin: 'top',
              willChange: 'transform',
            }
          : undefined
      }
    >
      <Link
        href={service.buttonLink || '#'}
        onClick={() => trackService.viewService(service.title, service.id)}
        className="group block rounded-3xl focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#F8EFDE]"
      >
        <article
          className="relative grid h-[var(--card-h)] grid-rows-[46%_1fr] overflow-hidden rounded-3xl border border-white/10 bg-[#22264a] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)] lg:grid-cols-[1.05fr_1fr] lg:grid-rows-none"
        >
          {/* Image — top on mobile, right on desktop */}
          <div className="relative overflow-hidden lg:order-2">
            <Image
              src={service.image}
              alt={service.imageAlt}
              fill
              sizes="(max-width: 1024px) 100vw, 45vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-linear-to-t from-[#1a1d3a]/80 via-transparent to-transparent lg:bg-linear-to-r" />
          </div>

          {/* Dimming scrim — see depthScrim: element opacity would let the
              card underneath bleed through this one. */}
          {pinned && (
            <motion.div
              aria-hidden
              data-stack-scrim
              style={{ opacity: scrim, willChange: 'opacity' }}
              className="pointer-events-none absolute inset-0 z-10 rounded-3xl bg-[#0B0F19]"
            />
          )}

          {/* Copy */}
          <div className="relative flex flex-col justify-end gap-7 p-6 sm:p-9 lg:order-1 lg:p-8">
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl border"
              style={{ color: accent, borderColor: `${accent}4d`, backgroundColor: `${accent}1a` }}
            >
              {serviceIcons[service.id]}
            </span>

            <div className="flex flex-col gap-4">
              <h3 className="font-sans text-3xl font-black leading-[1.05] text-[#F8EFDE] sm:text-4xl xl:text-5xl">
                {service.title}
              </h3>

              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#F8EFDE]/80">
                {service.buttonText}
                <svg
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </span>
            </div>
          </div>
        </article>
      </Link>
    </motion.div>
  );
}

/**
 * ServiceStack — the landing page's services pitch.
 *
 * An oversized display title beside a deck of cards that pin to the top of
 * the viewport and stack over one another as you scroll, each covered card
 * shrinking and fading to give the deck depth. From lg the title sticks at the
 * same offset the cards pin to and bleeds under them, so it stays put and
 * overlapped for the whole sequence; below lg it sits above a full-width deck
 * that tucks under its last line. Only `prefers-reduced-motion` degrades it to
 * a plain vertical column.
 *
 * `/services` keeps the grid-based `ScrollExpandableCards` — that page is a
 * directory, and a multi-viewport pin sequence fights its job.
 */
export function ServiceStack({ services, title, className = '' }: ServiceStackProps) {
  const stackRef = useRef<HTMLDivElement>(null);
  const outroRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const pinned = !reduceMotion;

  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ['start start', 'end end'],
  });

  // Second range, over the outro only. The title cannot descend while the cards
  // are pinned — it is behind them (z-0 to their z-10), so it would just slide
  // under the deck and vanish, taking the reveal with it. So the descent starts
  // where the deck's own range ends and finishes as the section does.
  const { scrollYProgress: outroProgress } = useScroll({
    target: outroRef,
    offset: ['start end', 'end end'],
  });

  // Walks the title down the viewport by moving its sticky offset, not by
  // transforming it. A transform is invisible to `position: sticky`: the
  // element would still release at the bottom of its containing block and only
  // then get the offset added on top, carrying it past the end of the section
  // and over the Testimonials heading below. Driving `top` keeps sticky in
  // charge, so it clamps the descent at the containing block for free.
  // --title-drift is 0 below lg, where the title is not sticky and `top` is
  // inert anyway.
  const titleTop = useTransform(
    outroProgress,
    p => `calc(var(--title-anchor) + var(--title-drift) * ${p})`
  );

  // The section inverts across the pin sequence, landing on the cream the
  // Testimonials section below already uses so the two meet without a seam.
  // #141527 is what the bg-[#1a1d3a]/60 class composites to over the layout's
  // #0a0a0a, so frame one looks identical to the static version.
  const backgroundColor = useTransform(scrollYProgress, [0, 1], ['#141527', '#F8EFDE']);
  // Runs the whole length of the scroll, like the background. The two ramps
  // cross around p=0.25 — both are mid-grey there, so the title washes out for
  // that stretch. Deliberate: a gradual title was the ask. Narrowing the
  // crossing means adding keyframes here to steepen the curve through it.
  const titleColor = useTransform(scrollYProgress, [0, 1], ['#F8EFDE', '#1a1a3e']);

  return (
    <motion.section
      id="services"
      style={pinned ? { backgroundColor } : undefined}
      className={`relative bg-[#1a1d3a]/60 py-24 ${className}`}
    >
      <div className="container relative mx-auto px-4 sm:px-6 lg:grid lg:grid-cols-1 lg:px-8">
        {/* Display title. One word per line so it can run far larger than a
            single-line heading before it wraps. From lg it sticks beside the
            deck for the whole pin sequence, with the cards laid over it, and
            walks down the viewport as the section scrolls. */}
        <motion.h2
          style={pinned ? { color: titleColor, top: titleTop } : undefined}
          className={`relative z-0 mt-[var(--lead)] font-sans font-black leading-[0.82] tracking-[-0.03em] text-[#F8EFDE] text-[length:var(--h-size)] lg:col-start-1 lg:row-start-1 lg:mt-0 lg:self-start ${
            pinned ? 'lg:sticky' : ''
          }`}
        >
          {title.split(' ').map(word => (
            <span key={word} className="block">
              {word}
            </span>
          ))}
        </motion.h2>

        {/* Card deck. --intro holds it below the fold for the opening frame so
            the title arrives alone; the cards climb in as you scroll. Below lg
            it then tucks under the heading's last line. From lg it shares the
            heading's grid cell and is inset from its top-left corner, so the
            cards cover everything but the L-shaped reveal. The
            inset is padding, not a margin, which keeps the deck's scroll box
            the same size --stack-tail was tuned against. --outro is the
            opposite trick: a margin, so it extends the grid row the heading
            sticks within without extending the deck's scroll range. */}
        <div
          ref={stackRef}
          style={{ paddingBottom: pinned ? 'var(--stack-tail)' : undefined }}
          className={`service-stack relative z-10 mt-[calc(var(--intro)-var(--tuck))] mb-[var(--outro)] lg:col-start-1 lg:row-start-1 lg:mt-[var(--intro)] lg:pl-[var(--reveal-left)] lg:pt-[var(--reveal-top)] ${pinned ? '' : 'flex flex-col gap-8'}`}
        >
          {services.map((service, index) => (
            <ServiceStackCard
              key={service.id}
              service={service}
              index={index}
              count={services.length}
              progress={scrollYProgress}
              pinned={pinned}
            />
          ))}
        </div>

        {/* Scroll sensor for the title's descent. --outro is a margin on the
            deck, so there is no element covering that stretch to measure; this
            is one, parked at the bottom of the same grid cell where self-end
            makes it span exactly the outro. Zero height below lg, and it never
            paints or takes a hit, so it costs nothing. */}
        <div
          ref={outroRef}
          aria-hidden
          className="pointer-events-none invisible h-[var(--outro)] lg:col-start-1 lg:row-start-1 lg:self-end"
        />
      </div>
    </motion.section>
  );
}
