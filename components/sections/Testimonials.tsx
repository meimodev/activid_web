'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
  company: string;
  avatar?: string;
}

export interface TestimonialsProps {
  title: string;
  subtitle?: string;
  testimonials: Testimonial[];
  className?: string;
}

/** Gap above the title once it has risen to the top of the stage. Clears the
 *  fixed navigation, which would otherwise crop its cap height. */
const TITLE_TOP = 112;

// The sequence as discrete states. Scroll picks the current one; the moves
// between them are timed, not scrubbed. The exceptions are the rail and the
// closing descent — see railX and tailY.
const B_SOLO = 0; // title alone, centred on the stage
const B_REVEAL = 1; // title rises to the top, the whole deck arrives
const B_FIRST = 2; // ...one state per card, each lighting as it reaches the left

/** Scroll each state holds for before the next is triggered, in svh. */
const STEP = 50;
/** Extra scroll on the last state: the runway the title's descent needs. */
const HOLD = 80;

/** Snappy out, soft landing — the same curve the AboutUs sequence uses, so the
 *  page's two pinned sections read as one piece of motion design. */
const EASE = [0.16, 1, 0.3, 1] as const;
const MOVE = { duration: 0.55, ease: EASE };
const SWAP = { duration: 0.45, ease: EASE };

const titleClass =
  'inline-block font-sans font-black leading-[0.8] tracking-[-0.04em] text-[#1a1a3e] text-[length:var(--fb-h)]';

/**
 * Testimonials — client feedback as a pinned sequence.
 *
 * The title holds the stage alone, rises to the top as the deck of quotes
 * arrives, and stays put while the deck is pulled leftward past it — each card
 * lighting as it reaches the left-hand slot and dimming as the next one takes
 * it. Once the last card has left, the title walks straight down the stage for
 * the rest of the section, still centred — it never moves sideways.
 *
 * Two clocks, the split AboutUs uses: everything triggered by scroll and then
 * timed — the title's moves, the deck's arrival, which card is lit — except the
 * rail and the closing descent, which are scrubbed so they track the wheel.
 * Scrubbing the highlight too would cross-fade the cards in proportion to how
 * fast the wheel is turning, which reads as a fault rather than as a beat.
 *
 * The rail's keyframes are measured, not declared: each card's offset within
 * the track is what puts it in the left slot, and card widths are
 * viewport-relative with a gap that changes at lg. The section's height stays a
 * constant in svh so that measurement never changes the page's geometry — a
 * measured height would reflow every section below this one on first paint.
 */
export function Testimonials({ title, testimonials, className = '' }: TestimonialsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const pinned = !reduceMotion;

  const count = testimonials.length;
  // One state per card, then one more for the deck to leave on: without it the
  // last card has to clear the edge in half the scroll every other card got,
  // and the rail visibly speeds up on the way out.
  const back = B_FIRST + count + 1; // the deck is gone; the title starts descending
  const states = back + 1;
  const run = states * STEP + HOLD;
  const at = (state: number) => (state * STEP) / run;

  const [beat, setBeat] = useState(B_SOLO);
  const [box, setBox] = useState({ vw: 0, vh: 0, titleW: 0, titleH: 0 });
  // Each card's left edge within the track, plus the track's full width. The
  // rail's whole timeline is these numbers.
  const [rail, setRail] = useState<{ offsets: number[]; width: number }>({
    offsets: [],
    width: 0,
  });

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      setBox({
        vw: window.innerWidth,
        vh: window.innerHeight,
        titleW: titleRef.current?.offsetWidth ?? 0,
        titleH: titleRef.current?.offsetHeight ?? 0,
      });
      if (!track) return;
      setRail({
        offsets: Array.from(track.children)
          .slice(0, count)
          .map(child => (child as HTMLElement).offsetLeft),
        width: track.scrollWidth,
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (titleRef.current) ro.observe(titleRef.current);
    if (trackRef.current) ro.observe(trackRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, [count]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', p => {
    const next = Math.max(0, Math.min(states - 1, Math.floor((p * run) / STEP)));
    setBeat(current => (current === next ? current : next));
  });

  // Card i reaches the left slot at the *middle* of state B_FIRST + i, so the
  // lit card is the leftmost one on screen for the bulk of its beat. Landing it
  // there at the start of the beat instead lights it and then immediately walks
  // it off the edge, leaving the highlight on a card half out of frame.
  const ready = count > 0 && rail.offsets.length === count;
  const base = ready ? rail.offsets[0] : 0;
  const railStops = ready
    ? [at(B_REVEAL), ...rail.offsets.map((_, index) => at(B_FIRST + index + 0.5)), at(back - 0.5)]
    : [0, 1];
  const railValues = ready
    ? [0, ...rail.offsets.map(offset => -(offset - base)), -(rail.width - base)]
    : [0, 0];
  const railX = useTransform(scrollYProgress, railStops, railValues, { clamp: true });

  // Centred horizontally for the whole sequence — the title never moves
  // sideways, it only rises and then descends. The inset keeps it off the right
  // edge of a narrow screen.
  const centerX = Math.max(0, (box.vw - box.titleW) / 2 - box.vw * 0.02);
  const tail = Math.max(0, box.vh - box.titleH - TITLE_TOP - 40);
  const tailY = useTransform(scrollYProgress, [at(back), 1], [0, tail], { clamp: true });

  const titleTo =
    beat >= B_REVEAL
      ? { x: centerX, y: TITLE_TOP }
      : { x: centerX, y: (box.vh - box.titleH) / 2 };

  const shown = beat >= B_REVEAL;
  // No card is lit on the reveal: the deck arrives as a deck, and the first
  // card lighting is the next beat rather than part of the same one.
  const active = beat >= B_FIRST ? Math.min(count - 1, beat - B_FIRST) : -1;

  const cards = testimonials.map((item, index) => {
    const lit = index === active;
    return (
      <motion.figure
        key={`${item.author}-${index}`}
        initial={false}
        // Filled when lit, outlined on the page's own cream when not. Two
        // things ride on that cream being opaque rather than transparent: a
        // waiting card would otherwise wash to grey over the page if dimmed
        // with opacity, and — since the deck lays over the heading — the title
        // would read straight through it behind the quote.
        animate={
          pinned
            ? {
                opacity: shown ? 1 : 0,
                y: shown ? 0 : 60,
                backgroundColor: lit ? '#1a1d3a' : '#F8EFDE',
                color: lit ? '#F8EFDE' : '#1a1a3e',
                scale: lit ? 1 : 0.96,
              }
            : undefined
        }
        // The stagger is on the arrival only: it deals the deck out left to
        // right. Carrying it into the highlight would delay each card's fill by
        // its position, landing the colour after the card has already moved.
        transition={beat === B_REVEAL ? { ...SWAP, delay: index * 0.07 } : SWAP}
        // Alternating offset: a straight row of equal slabs reads as a table,
        // and the stagger is what makes it a rail of loose cards instead.
        style={pinned ? { marginTop: index % 2 ? 'var(--fb-drop)' : 0 } : undefined}
        className="flex w-[78vw] shrink-0 flex-col justify-between gap-10 rounded-3xl border border-[#1a1a3e]/15 bg-[#1a1d3a] p-8 text-[#F8EFDE] sm:w-[56vw] sm:p-10 lg:w-[34vw] lg:max-w-[520px]"
      >
        <span className="font-sans text-sm font-bold tabular-nums tracking-[0.3em] opacity-40">
          {String(index + 1).padStart(2, '0')}
        </span>

        <blockquote className="font-sans text-xl font-medium leading-[1.35] tracking-[-0.01em] sm:text-2xl">
          {item.quote}
        </blockquote>

        <figcaption className="font-sans text-xs font-bold uppercase tracking-[0.25em] opacity-60">
          {item.author}
        </figcaption>
      </motion.figure>
    );
  });

  const heading = title.split(' ').map(word => (
    <span key={word} className="block">
      {word}
    </span>
  ));

  if (!pinned) {
    return (
      <section
        id="feedback"
        className={`bg-[#F8EFDE] px-6 py-24 lg:px-16 ${className}`}
        aria-labelledby="feedback-heading"
      >
        <h2 id="feedback-heading" className={titleClass}>
          {heading}
        </h2>
        <div className="mt-16 grid gap-8 md:grid-cols-2">{cards}</div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="feedback"
      style={{ height: `${run + 100}svh` }}
      className={`relative ${className}`}
      aria-labelledby="feedback-heading"
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-[#F8EFDE]">
        {/* Two nested transforms: the outer one is the scrubbed descent, the
            inner one the triggered moves. They are on different clocks and so
            cannot share a value. */}
        <motion.div style={{ y: tailY }} className="absolute inset-x-0 top-0 z-10">
          <motion.div initial={false} animate={titleTo} transition={MOVE} className="px-6 lg:px-16">
            <h2 ref={titleRef} id="feedback-heading" className={titleClass}>
              {heading}
            </h2>
          </motion.div>
        </motion.div>

        {/* The rail. Anchored to the foot of the stage so the deck's arrival is
            a rise into place rather than a drift across the middle, and laid
            over the heading the way the ServiceStack deck is: at this type size
            the title's second line and a full-height card cannot both fit above
            the fold, and a heading the cards pass in front of is the better half
            of that trade. */}
        <motion.div
          ref={trackRef}
          style={{ x: railX }}
          className="absolute inset-x-0 bottom-[6svh] z-20 flex w-max items-start gap-6 px-6 lg:gap-10 lg:px-16"
        >
          {cards}
          {/* Puts the last card's right-hand margin inside scrollWidth, where
              the rail's closing keyframe reads it. */}
          <div aria-hidden className="w-6 shrink-0 lg:w-16" />
        </motion.div>
      </div>
    </section>
  );
}
