'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { siteContent } from '@/lib/site-content';
import { trackCTA } from '@/lib/analytics';

const NAVY = '#1a1a3e';
const CREAM = '#F8EFDE';

/** Scroll each word holds for before the next lands, in svh. */
const STEP = 40;
/** Extra scroll after the inversion, so the button is not the last thing to
 *  arrive and immediately the last thing to leave. */
const HOLD = 50;

/** The same curve the AboutUs and Testimonials sequences use. */
const EASE = [0.16, 1, 0.3, 1] as const;
const SLAM = { duration: 0.45, ease: EASE };
const WIPE = { duration: 0.6, ease: EASE };

const lineClass =
  'block font-sans font-black leading-[0.82] tracking-[-0.04em] text-[length:var(--cta-h)]';

/**
 * CTA — the closing pitch as a pinned sequence.
 *
 * The question types itself onto a navy stage a word at a time, each landing
 * from the right on its own beat and stepping further in than the last, so the
 * finished block reads as a staircase rather than a paragraph. Once the last
 * word is down the stage inverts: a cream panel wipes up from the floor,
 * carrying the same words in navy and the button with it.
 *
 * The inversion is a wipe over a duplicate rather than a colour animation on
 * one copy. Animating navy-to-cream type against a navy-to-cream ground puts
 * both ramps in the same place at the same time, and the words vanish into the
 * background for the middle of the transition. The shutter cuts the navy copy
 * in exactly where the cream one is covered, so every frame has full contrast.
 *
 * Everything here is triggered by scroll and then timed, except the block's
 * slow rise, which is scrubbed — see blockY.
 */
export function CTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const pinned = !reduceMotion;

  const { title, buttonText, buttonLink } = siteContent.ctaSection;
  const words = title.split(' ');

  const wipeAt = words.length; // every word has landed
  const states = wipeAt + 1;
  const run = states * STEP + HOLD;

  const [beat, setBeat] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // A deadzone around each boundary. Momentum scrolling on a phone jitters a
  // pixel or two after the finger leaves, and a bare floor() sitting on a
  // boundary flips the beat back and forth — every word restarting its 0.45s
  // slam each time. Advance on a full step, retreat only past the deadzone.
  useMotionValueEvent(scrollYProgress, 'change', p => {
    const raw = (p * run) / STEP;
    setBeat(current => {
      if (raw < current + 1 && raw > current - 0.12) return current;
      return Math.max(0, Math.min(states - 1, Math.floor(raw)));
    });
  });

  // The one scrubbed thing on the stage. Small on purpose: it gives the block
  // somewhere to be going while the words land, without competing with them.
  const blockY = useTransform(scrollYProgress, [0, 1], [48, -48]);

  const inverted = beat >= wipeAt;

  // Both copies render this, so the two are always registered and the shutter
  // is free to decide which one shows.
  const stack = (tone: string) =>
    words.map((word, index) => (
      <motion.span
        key={`${word}-${index}`}
        initial={false}
        animate={pinned ? { opacity: beat >= index ? 1 : 0, x: beat >= index ? 0 : 90 } : undefined}
        transition={SLAM}
        style={{ paddingLeft: `calc(${index} * var(--cta-indent))` }}
        className={`${lineClass} ${tone}`}
      >
        {word}
      </motion.span>
    ));

  const button = (
    <Link
      href={buttonLink}
      onClick={() => trackCTA.ctaSectionClick()}
      className="group inline-flex items-center gap-5 rounded-full bg-[#1a1a3e] px-10 py-6 font-sans text-lg font-bold text-[#F8EFDE] transition-colors hover:bg-[#2a2d5e] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1a1a3e] sm:px-14 sm:py-7 sm:text-xl"
    >
      {buttonText}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="h-6 w-6 transition-transform duration-300 group-hover:translate-x-1"
      >
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </Link>
  );

  if (!pinned) {
    return (
      <section
        id="cta"
        style={{ backgroundColor: CREAM }}
        className="px-6 py-28 lg:px-16"
        aria-labelledby="cta-heading"
      >
        <h2 id="cta-heading" className="text-[#1a1a3e]">
          {stack('text-[#1a1a3e]')}
        </h2>
        <div className="mt-14">{button}</div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="cta"
      style={{ height: `${run + 100}svh` }}
      className="relative"
      aria-labelledby="cta-heading"
    >
      <div className="sticky top-0 h-svh overflow-hidden" style={{ backgroundColor: NAVY }}>
        {/* The words as they read on navy. */}
        <motion.div style={{ y: blockY }} className="absolute inset-0 z-10 flex flex-col justify-center px-6 lg:px-16">
          <h2 id="cta-heading" className="text-[#F8EFDE]">
            {stack('text-[#F8EFDE]')}
          </h2>
          {/* Holds the space the button takes on the other copy, so both blocks
              centre on the same line and the wipe never shifts the words. */}
          <div aria-hidden className="invisible mt-[6svh]">
            {button}
          </div>
        </motion.div>

        {/* The inversion. Wipes up from the floor, which puts the button — the
            thing at the bottom of the panel — on screen first.

            Two counter-running translates inside an overflow clip, not an
            animated clip-path: a moving inset() repaints the whole stage every
            frame, which phones cannot hold at 60fps with type this large.
            Transforms stay on the compositor. The shutter slides up, the panel
            slides down by the same amount, so the words never move. */}
        <motion.div
          initial={false}
          animate={{ y: inverted ? '0%' : '100%' }}
          transition={WIPE}
          className="absolute inset-0 z-20 overflow-hidden"
        >
          <motion.div
            initial={false}
            animate={{ y: inverted ? '0%' : '-100%' }}
            transition={WIPE}
            style={{ backgroundColor: CREAM }}
            className="absolute inset-0"
          >
            <motion.div
              style={{ y: blockY }}
              className="absolute inset-0 flex flex-col justify-center px-6 lg:px-16"
            >
              <div aria-hidden>{stack('text-[#1a1a3e]')}</div>

              {/* Rides with the block rather than pinned to the floor, so the
                  distance between the question and its answer never changes. */}
              <motion.div
                initial={false}
                animate={{ opacity: inverted ? 1 : 0, y: inverted ? 0 : 24 }}
                transition={{ ...SLAM, delay: inverted ? 0.25 : 0 }}
                className="mt-[6svh]"
              >
                {button}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
