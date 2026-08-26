'use client';

import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'framer-motion';
import { siteContent } from '@/lib/site-content';

export interface AboutUsProps {
  className?: string;
}

/** The brand navy the left column fills with — same value as --navy-dark. */
const PRIMARY = '#1a1d3a';

/** Gap above the title while it is parked at the top of the stage. Clears the
 *  fixed navigation, which would otherwise crop its cap height. */
const TITLE_TOP = 112;

const BLOCKS = siteContent.aboutUs.facts.length + 1; // lead + facts

// The sequence as discrete states. Scrolling only decides which one is
// current; the move between them is a timed animation, not a scrub.
const B_SOLO = 0; // title alone on cream
const B_SPLIT = 1; // columns divide, left fills with primary, title drops out
const B_INFO = 2; // ...one state per block of copy, title over on the right
const B_BACK = B_INFO + BLOCKS; // title crosses back to the left and stays
const STATES = B_BACK + 1;

/** Scroll each state holds for before the next is triggered, in svh. */
const STEP = 55;
/** Extra scroll on the last state. This is the descent's runway: the title
 *  crosses back to the left and then walks down the stage over the rest of the
 *  section, which needs more room than one STEP. */
const HOLD = 90;
/** Height of one block's slot. Equal to STEP on purpose: the copy is the one
 *  part of the section that still tracks the scroll rather than being triggered
 *  by it, and matching the two makes that tracking exactly 1:1. */
const INFO_SLOT = STEP;
const INFO_RUN = (BLOCKS - 1) * INFO_SLOT;

/** Total pinned scroll, and where each state starts within it. The hold sits
 *  past the last state's own STEP, so every state but the last is one STEP and
 *  the last one runs to the end of the section. */
const RUN = STATES * STEP + HOLD;
const at = (state: number) => (state * STEP) / RUN;

/** Snappy out, soft landing. Shared by the title and the fill, so the two
 *  triggered moves read as one mechanism rather than separate effects. */
const EASE = [0.16, 1, 0.3, 1] as const;
const MOVE = { duration: 0.55, ease: EASE };
const FILL = { duration: 0.5, ease: EASE };
const FADE = { duration: 0.3, ease: 'linear' as const };

const titleClass =
  'whitespace-pre-line font-sans font-black leading-[0.82] tracking-[-0.03em] text-[length:var(--about-h)]';

/**
 * AboutUs — the agency's introduction as a pinned, state-driven sequence.
 *
 * The title holds the screen alone, the stage splits into two columns with the
 * left one filling with the brand navy, the title drops off the bottom and
 * comes back down from the top on the right, the copy is called up the left
 * column a block at a time, and the title crosses back to the left, where it
 * and the split both hold until the section ends.
 *
 * Scroll is a *trigger* for the title and the fill: it picks the current state
 * and each move then plays at its own pace. The copy is the exception and
 * still tracks the scroll — see infoY. Scrubbing the whole thing off scroll
 * position ties the animation's speed to how fast the wheel is turning, which
 * is what makes a sequence this long feel sluggish at the top of a trackpad
 * flick and jumpy at the end of one.
 *
 * Three things the layout is built around:
 *  - the horizontal offset comes from a probe element sized `w-0 lg:w-1/2`, so
 *    below lg it is 0 and the whole sequence collapses to a single full-width
 *    column with no media query in JS;
 *  - below lg the title parks off-screen rather than at the top, because there
 *    is no second column to stand in and the copy would otherwise be called up
 *    straight through it, cream on cream;
 *  - the title is rendered twice, navy on the page and cream inside the panel,
 *    and the panel is revealed with clip-path rather than a translate. The clip
 *    cuts the cream copy exactly where the navy one is covered, so contrast is
 *    right on every frame of the wipe. Animating one title's colour instead
 *    leaves it washed out wherever the ramp and the wipe edge disagree.
 */
export function AboutUs({ className = '' }: AboutUsProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const probeRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const pinned = !reduceMotion;

  const { title, lead, facts } = siteContent.aboutUs;

  const [beat, setBeat] = useState(B_SOLO);
  // Set once the title has finished dropping off the bottom, which is when it
  // is safe to reposition it above the top for its re-entry. The move has to
  // wait for the animation rather than the state, or the jump happens while it
  // is still on screen.
  const [dropped, setDropped] = useState(false);
  const [box, setBox] = useState({ vh: 0, titleH: 0, shift: 0 });

  useEffect(() => {
    const measure = () =>
      setBox({
        vh: window.innerHeight,
        titleH: titleRef.current?.offsetHeight ?? 0,
        shift: probeRef.current?.offsetWidth ?? 0,
      });
    measure();
    const ro = new ResizeObserver(measure);
    if (titleRef.current) ro.observe(titleRef.current);
    if (probeRef.current) ro.observe(probeRef.current);
    window.addEventListener('resize', measure);
    return () => {
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  useMotionValueEvent(scrollYProgress, 'change', p => {
    const next = Math.max(0, Math.min(STATES - 1, Math.floor((p * RUN) / STEP)));
    setBeat(current => (current === next ? current : next));
    // Scrolling back to the opening frame re-arms the drop. Anywhere later it
    // stays set, so reversing through the sequence parks the title above the
    // top rather than sending it back down through the viewport.
    if (next === B_SOLO) setDropped(false);
  });

  const exit = box.vh + 40;
  // Off the top, where the title waits between dropping out and coming back.
  const above = -(box.titleH + 40);
  // Below lg there is no second column, so the title waits off-screen through
  // the copy instead of standing over it. It waits *above* rather than below,
  // so its return is the same downward move it makes on a wide screen.
  const park = box.shift > 0 ? TITLE_TOP : above;

  let titleTo = { x: 0, y: (box.vh - box.titleH) / 2 };
  let titleTransition: typeof MOVE | { duration: number } = MOVE;
  if (beat === B_SPLIT) {
    // Down and out, then a cut — no tween — across to the far side and above
    // the top. Tweening that leg would sweep the title back up through the
    // whole viewport; the point is that it leaves at the bottom and returns
    // from the top.
    titleTo = dropped ? { x: box.shift, y: above } : { x: 0, y: exit };
    if (dropped) titleTransition = { duration: 0 };
  } else if (beat >= B_INFO && beat < B_BACK) {
    titleTo = { x: box.shift, y: park };
  } else if (beat >= B_BACK) {
    titleTo = { x: 0, y: TITLE_TOP };
  }

  // Once the title is back on the left it stops being parked and rides the
  // scroll down for the rest of the section. Scrubbed, not triggered: this leg
  // is the reader's, and a timed drop would land the title at the bottom long
  // before the section ends. -40 keeps it off the very edge.
  const tail = Math.max(0, box.vh - box.titleH - TITLE_TOP - 40);
  const tailY = useTransform(scrollYProgress, [at(B_BACK), 1], [0, tail]);

  // Opens left-to-right as the columns divide and then stays: the section ends
  // on the split rather than undoing it.
  const clipTo = beat === B_SOLO ? 'inset(0% 100% 0% 0%)' : 'inset(0% 0% 0% 0%)';

  // The copy is the exception: it tracks the scroll rather than being triggered
  // by it, so it reads as a column you are scrolling rather than a slideshow
  // advancing a block at a time. Its range is the states it occupies — it
  // arrives across the split and leaves across the title's return.
  // The extra keyframe holds the last block centred for most of the state
  // before it leaves. Without it the copy clears the top around the middle of
  // that state and the column sits empty for the rest of it plus the whole
  // hold — a long stretch of nothing before the title crosses back.
  const infoY = useTransform(
    scrollYProgress,
    [at(B_SPLIT), at(B_INFO), at(B_BACK - 1), at(B_BACK - 0.2), at(B_BACK)],
    ['100svh', '0svh', `${-INFO_RUN}svh`, `${-INFO_RUN}svh`, `${-(INFO_RUN + 100)}svh`]
  );

  const blocks = [
    <p
      key="lead"
      className="font-sans text-3xl font-black leading-[1.05] tracking-[-0.02em] md:text-5xl"
    >
      {lead}
    </p>,
    // A <dl> each rather than one around the lot: the blocks are interleaved
    // with prose, which cannot live inside a description list.
    ...facts.map(fact => (
      <dl key={fact.label}>
        <dt className="font-sans text-xs font-bold uppercase tracking-[0.25em] opacity-50">
          {fact.label}
        </dt>
        <dd className="mt-4 font-sans text-4xl font-black leading-[0.95] tracking-[-0.02em] md:text-6xl">
          {fact.value}
        </dd>
      </dl>
    )),
  ];

  if (!pinned) {
    return (
      <section
        id="about"
        className={`relative bg-[#F8EFDE] px-6 py-24 text-[#1a1a3e] lg:px-16 ${className}`}
        aria-labelledby="about-heading"
      >
        <h2 id="about-heading" className={titleClass}>
          {title}
        </h2>
        <div className="mt-12 flex max-w-2xl flex-col gap-12">{blocks}</div>
      </section>
    );
  }

  return (
    <section
      ref={sectionRef}
      id="about"
      style={{ height: `${RUN + 100}svh` }}
      className={`relative ${className}`}
      aria-labelledby="about-heading"
    >
      <div className="sticky top-0 h-svh overflow-hidden bg-[#F8EFDE]">
        {/* Page layer: the title as it reads on cream. The outer element is the
            scrubbed descent, the inner one the triggered moves — two transforms
            because the two are on different clocks and cannot share a value. */}
        <motion.div style={{ y: tailY }} className="absolute left-0 top-0 z-10 w-full">
          <motion.div
            initial={false}
            animate={titleTo}
            transition={titleTransition}
            onAnimationComplete={() => {
              if (beat === B_SPLIT) setDropped(true);
            }}
            className="w-full px-6 lg:w-1/2 lg:px-16"
          >
            <h2 ref={titleRef} id="about-heading" className={`${titleClass} text-[#1a1a3e]`}>
              {title}
            </h2>
          </motion.div>
        </motion.div>

        {/* Left column. Full width below lg, where there is no room for two
            columns and the sequence plays out as one. Everything that belongs
            on the primary colour lives inside it, so the clip reveals the copy
            and the cream title together with the fill. */}
        <motion.div
          initial={false}
          animate={{ clipPath: clipTo }}
          transition={FILL}
          style={{ backgroundColor: PRIMARY }}
          className="absolute inset-y-0 left-0 z-20 w-full lg:w-1/2"
        >
          <motion.div
            style={{ y: infoY }}
            className="absolute inset-x-0 top-[15svh] px-6 text-[#F8EFDE] lg:px-16"
          >
            {blocks.map((entry, index) => (
              <div key={index} style={{ height: `${INFO_SLOT}svh` }} className="flex items-center">
                {entry}
              </div>
            ))}
          </motion.div>

          {/* The title again, cream. Same targets as the page layer on both
              clocks, so the two are always registered; the clip decides which
              one shows. */}
          <motion.div aria-hidden style={{ y: tailY }} className="absolute left-0 top-0 w-full">
            <motion.div
              initial={false}
              animate={titleTo}
              transition={titleTransition}
              className="w-full px-6 lg:px-16"
            >
              <div className={`${titleClass} text-[#F8EFDE]`}>{title}</div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* The divide itself, drawn before the fill arrives. */}
        <motion.div
          aria-hidden
          initial={false}
          animate={{ opacity: beat >= B_SPLIT ? 1 : 0 }}
          transition={FADE}
          className="absolute inset-y-0 left-1/2 z-30 hidden w-px bg-[#1a1a3e]/20 lg:block"
        />

        {/* Probe for the horizontal move: one column wide from lg, zero below,
            so the split collapses without a media query in JS. */}
        <div ref={probeRef} aria-hidden className="invisible absolute h-0 w-0 lg:w-1/2" />
      </div>
    </section>
  );
}
