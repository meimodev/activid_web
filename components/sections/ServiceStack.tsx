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
  subtitle: string;
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
          className="relative grid h-[var(--card-h)] grid-rows-[40%_1fr] overflow-hidden rounded-3xl border border-white/10 bg-[#22264a] shadow-[0_24px_60px_-20px_rgba(0,0,0,0.75)] lg:grid-cols-[1.05fr_1fr] lg:grid-rows-none"
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
          <div className="relative flex flex-col justify-center gap-3 p-6 sm:gap-4 sm:p-9 lg:order-1 lg:p-11">
            <span
              aria-hidden
              className="absolute inset-x-7 top-0 h-0.5 rounded-full sm:inset-x-9 lg:inset-x-auto lg:inset-y-9 lg:left-0 lg:h-auto lg:w-0.5"
              style={{ backgroundColor: accent }}
            />

            <div className="flex items-center gap-3" style={{ color: accent }}>
              <span
                className="flex h-10 w-10 items-center justify-center rounded-xl border"
                style={{ borderColor: `${accent}4d`, backgroundColor: `${accent}1a` }}
              >
                {serviceIcons[service.id]}
              </span>
              <span className="font-mono text-sm tracking-[0.2em]">
                {String(index + 1).padStart(2, '0')}
              </span>
            </div>

            <h3 className="font-sans text-2xl font-bold text-[#F8EFDE] sm:text-3xl">
              {service.title}
            </h3>

            <p className="line-clamp-3 text-sm lg:line-clamp-5 leading-relaxed text-[#F8EFDE]/75 sm:text-base">
              {service.description}
            </p>

            <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#F8EFDE]">
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
        </article>
      </Link>
    </motion.div>
  );
}

/**
 * ServiceStack — the landing page's services pitch.
 *
 * A sticky title rail beside a deck of cards that pin to the top of the
 * viewport and stack over one another as you scroll, each covered card
 * shrinking and fading to give the deck depth. The deck pins at every width —
 * on mobile the rail sits above it and the card turns image-over-copy. Only
 * `prefers-reduced-motion` degrades it to a plain vertical column.
 *
 * `/services` keeps the grid-based `ScrollExpandableCards` — that page is a
 * directory, and a multi-viewport pin sequence fights its job.
 */
export function ServiceStack({ services, title, subtitle, className = '' }: ServiceStackProps) {
  const stackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const pinned = !reduceMotion;

  const { scrollYProgress } = useScroll({
    target: stackRef,
    offset: ['start start', 'end end'],
  });

  return (
    <section id="services" className={`relative bg-[#1a1d3a]/60 py-24 ${className}`}>
      <div className="container relative z-10 mx-auto grid gap-12 px-4 sm:px-6 lg:grid-cols-[minmax(0,20rem)_1fr] lg:gap-16 lg:px-8">
        {/* Sticky title rail */}
        <div className={`lg:self-start ${pinned ? 'lg:sticky lg:top-[7rem]' : ''}`}>
          <h2 className="font-sans text-4xl font-black text-[#F8EFDE] md:text-5xl">{title}</h2>
          <p className="mt-5 text-base leading-relaxed text-[#F8EFDE]/70">{subtitle}</p>
          <Link
            href="/services"
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-[#F8EFDE] underline-offset-4 hover:underline"
          >
            Lihat semua layanan
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {/* Card deck */}
        <div
          ref={stackRef}
          style={{ paddingBottom: pinned ? 'var(--stack-tail)' : undefined }}
          className={`service-stack ${pinned ? '' : 'flex flex-col gap-8'}`}
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
      </div>
    </section>
  );
}
