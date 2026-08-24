import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getRedirectLink } from "@/lib/redirect-link";
import { RedirectCountdown } from "./RedirectCountdown";
import { SPARKS, pickDesign } from "./design";

type PageProps = { params: Promise<{ code: string }> };

const DEFAULT_NOTE = "Terima kasih sudah mampir.";
/** Words start after the mark lands, then stagger. Capped so a long business
 *  name still finishes well before the redirect fires. */
const WORD_START_MS = 200;
const WORD_STEP_MS = 70;
const WORD_STEP_CAP = 5;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { code } = await params;
  const link = await getRedirectLink(code);
  return {
    title: link?.businessName || "Tautan",
    robots: { index: false, follow: false },
  };
}

/**
 * Scoped to `.rl`: this screen lives for about two seconds on a stranger's
 * phone and shares nothing with the console it was created in. Colors arrive
 * as custom properties from `design.ts`; nothing here hardcodes a hue.
 */
const css = `
.rl {
  --rl-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --rl-cta-bg: var(--rl-accent);
  --rl-cta-fg: var(--rl-on-accent);
  --rl-cta-sweep: var(--rl-accent-deep);
  --rl-cta-radius: 999px;
  position: relative;
  font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif;
  background: var(--rl-ground);
  color: var(--rl-ink);
  -webkit-font-smoothing: antialiased;
}
.rl :focus-visible { outline: 2px solid var(--rl-accent); outline-offset: 3px; }

.rl-shell {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100dvh;
  padding: 1.75rem 1.5rem max(1.75rem, env(safe-area-inset-bottom));
  gap: 2rem;
}
@media (min-width: 640px) {
  .rl-shell { padding: 2.5rem; gap: 3rem; }
}

.rl-body { position: relative; align-self: end; }
.rl-body > * { position: relative; z-index: 1; }

/* --- ambient decoration ------------------------------------------------- */
/* Viewport-fixed and clipped, so nothing here can add a scrollbar. Every
   motif animates transform/opacity only. */
.rl-deco {
  position: fixed;
  inset: 0;
  z-index: 0;
  overflow: hidden;
  pointer-events: none;
  contain: strict;
}
.rl-deco > * { position: absolute; }

/* rings: open arcs, so the rotation is actually visible */
[data-motif="rings"] .rl-ring {
  border: 1px solid var(--rl-deco);
  border-right-color: transparent;
  border-top-color: transparent;
  border-radius: 50%;
  animation:
    rl-deco-in 900ms var(--rl-expo) both,
    rl-spin linear infinite;
}
[data-motif="rings"] .rl-ring:nth-child(1) {
  width: 96vmin; height: 96vmin; top: -34vmin; right: -30vmin;
  animation-delay: 0ms, 0ms; animation-duration: 900ms, 44s;
}
[data-motif="rings"] .rl-ring:nth-child(2) {
  width: 62vmin; height: 62vmin; bottom: -18vmin; left: -22vmin;
  animation-delay: 140ms, 0ms; animation-duration: 900ms, 31s;
  animation-direction: normal, reverse;
}
[data-motif="rings"] .rl-ring:nth-child(3) {
  width: 34vmin; height: 34vmin; top: 42%; right: 8%;
  animation-delay: 280ms, 0ms; animation-duration: 900ms, 23s;
}

/* grid: a dot field that drifts diagonally */
[data-motif="grid"] .rl-field {
  inset: -30% -30% -30% -30%;
  background-image: radial-gradient(circle at center, var(--rl-deco) 1.5px, transparent 1.5px);
  background-size: 26px 26px;
  animation:
    rl-deco-in 1100ms var(--rl-expo) both,
    rl-drift 26s linear infinite;
}

/* sparks: pops in with the content, then floats */
[data-motif="sparks"] .rl-spark {
  background: var(--rl-deco);
  animation:
    rl-spark-in 620ms var(--rl-expo) both,
    rl-float 9s ease-in-out infinite;
}
[data-motif="sparks"] .rl-spark[data-round="1"] { border-radius: 999px; }
[data-motif="sparks"] .rl-spark[data-round="0"] { border-radius: 2px; rotate: 45deg; }

@keyframes rl-deco-in { from { opacity: 0; } to { opacity: 1; } }
@keyframes rl-spin { to { rotate: 360deg; } }
@keyframes rl-drift { to { transform: translate3d(26px, 26px, 0); } }
@keyframes rl-spark-in {
  from { opacity: 0; transform: scale(0.2); filter: blur(6px); }
  to { opacity: 1; transform: none; filter: blur(0); }
}
@keyframes rl-float {
  0%, 100% { translate: 0 0; }
  50% { translate: 0 -14px; }
}

/* --- content ------------------------------------------------------------ */
/* Activid lockup: the agency's signature on every printed sticker. */
.rl-mark {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  animation: rl-pop 440ms var(--rl-expo) 60ms both;
}
.rl-mark-pre {
  font-size: 0.6875rem;
  font-weight: 600;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--rl-ink-3);
}
.rl-mark-name {
  font-size: 1.3125rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--rl-accent);
}
.rl-mark-dot {
  width: 0.3125rem;
  height: 0.3125rem;
  border-radius: 999px;
  background: var(--rl-accent);
  align-self: center;
}

.rl-name {
  font-size: clamp(2.75rem, 13vw, 4.75rem);
  font-weight: 800;
  line-height: 0.94;
  letter-spacing: -0.042em;
  text-wrap: balance;
  max-width: 14ch;
}
.rl-word {
  display: inline-block;
  margin-right: 0.22em;
  animation: rl-pop 520ms var(--rl-expo) both;
}
.rl-word:last-child { margin-right: 0; }

.rl-note {
  margin-top: 1.5rem;
  font-size: clamp(1rem, 4.2vw, 1.1875rem);
  line-height: 1.45;
  color: var(--rl-ink-2);
  text-wrap: pretty;
  max-width: 30ch;
  animation: rl-pop 520ms var(--rl-expo) 640ms both;
}

.rl-cta {
  position: relative;
  isolation: isolate;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  width: 100%;
  padding: 1.125rem 1.5rem;
  border-radius: var(--rl-cta-radius);
  background: var(--rl-cta-bg);
  color: var(--rl-cta-fg);
  font-size: 1.0625rem;
  font-weight: 700;
  letter-spacing: -0.012em;
  transition: background-color 180ms ease-out, transform 120ms ease-out;
  animation: rl-pop 480ms var(--rl-expo) var(--rl-cta-delay, 780ms) both;
}
.rl-cta:hover { background: var(--rl-cta-sweep); }
.rl-cta:active { transform: scale(0.985); }
.rl-cta-label, .rl-cta-arrow { position: relative; z-index: 1; }
.rl-cta-arrow { font-size: 1.25rem; }

/* Fills as the timer runs, so the wait is legible without a second label. */
.rl-sweep {
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--rl-cta-sweep);
  transform-origin: left center;
  transform: scaleX(0);
  animation: rl-fill linear forwards;
  animation-play-state: paused;
}
.rl-cta[data-armed] .rl-sweep { animation-play-state: running; }
@keyframes rl-fill { to { transform: scaleX(1); } }

/* Pop without overshoot: scale and blur burn in, no bounce. */
@keyframes rl-pop {
  from { opacity: 0; transform: translateY(0.42em) scale(0.94); filter: blur(10px); }
  to { opacity: 1; transform: none; filter: blur(0); }
}

.rl-off {
  border-top: 1px solid var(--rl-hair);
  padding-top: 1.25rem;
  font-size: 0.9375rem;
  color: var(--rl-ink-2);
  animation: rl-pop 480ms var(--rl-expo) 640ms both;
}

/* --- layout topologies --------------------------------------------------
   One markup tree, four silhouettes. "stack" is the locked original and needs
   no rules of its own. */

/* split: the name rides a full-bleed accent block, so the CTA inverts to ink
   to stay distinct from the field above it. */
[data-layout="split"] {
  --rl-cta-bg: var(--rl-ink);
  --rl-cta-fg: var(--rl-ground);
  --rl-cta-sweep: var(--rl-ink-2);
  --rl-cta-radius: 1.125rem;
}
[data-layout="split"] .rl-shell { padding: 0; gap: 0; }
[data-layout="split"] .rl-mark { padding: 1.75rem 1.5rem; }
[data-layout="split"] .rl-body {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-self: stretch;
  color: var(--rl-on-accent);
  padding: 2.5rem 1.5rem 2.75rem;
}
[data-layout="split"] .rl-body::before {
  content: "";
  position: absolute;
  inset: 0;
  z-index: 0;
  background: var(--rl-accent);
  transform: scaleY(0);
  transform-origin: bottom center;
  animation: rl-reveal 680ms var(--rl-expo) 120ms both;
}
[data-layout="split"] .rl-note { color: var(--rl-on-accent); opacity: 0.76; }
[data-layout="split"] .rl-cta { margin: 1.5rem; width: calc(100% - 3rem); }
[data-layout="split"] .rl-off { margin: 0 1.5rem 1.5rem; }
@media (min-width: 640px) {
  [data-layout="split"] .rl-mark { padding: 2.5rem; }
  [data-layout="split"] .rl-body { padding: 3rem 2.5rem 3.25rem; }
  [data-layout="split"] .rl-cta { margin: 2.5rem; width: calc(100% - 5rem); }
  [data-layout="split"] .rl-off { margin: 0 2.5rem 2.5rem; }
}

/* rail: the Activid lockup stands the full height of the left edge and the
   content shifts right of it. */
[data-layout="rail"] .rl-shell {
  grid-template-columns: auto 1fr;
  grid-template-rows: 1fr auto;
  column-gap: 1.375rem;
  row-gap: 1.75rem;
}
[data-layout="rail"] .rl-mark {
  grid-column: 1;
  grid-row: 1 / -1;
  writing-mode: vertical-rl;
  rotate: 180deg;
  align-items: center;
  justify-content: flex-start;
  gap: 0.75rem;
  border-inline-start: 1px solid var(--rl-hair);
  padding-inline-start: 0.875rem;
}
[data-layout="rail"] .rl-mark-pre { letter-spacing: 0.2em; }
[data-layout="rail"] .rl-body { grid-column: 2; grid-row: 1; }
[data-layout="rail"] .rl-cta,
[data-layout="rail"] .rl-off { grid-column: 2; grid-row: 2; }
[data-layout="rail"] .rl-cta { width: auto; justify-self: start; padding-inline: 1.75rem; gap: 2rem; }
[data-layout="rail"] .rl-name { font-size: clamp(2.5rem, 11.5vw, 4.25rem); }

/* crest: hierarchy inverted. The name sits at the top and the empty middle is
   the composition. */
[data-layout="crest"] .rl-body { align-self: start; }
[data-layout="crest"] .rl-shell { gap: 1.25rem; }
[data-layout="crest"] .rl-name {
  font-size: clamp(3rem, 15vw, 5.5rem);
  letter-spacing: -0.05em;
  max-width: 11ch;
}
[data-layout="crest"] .rl-note { margin-top: 1.75rem; }
@media (min-width: 640px) {
  [data-layout="crest"] .rl-shell { gap: 2rem; }
}

@keyframes rl-reveal { to { transform: scaleY(1); } }

@media (prefers-reduced-motion: reduce) {
  .rl-mark, .rl-word, .rl-note, .rl-cta, .rl-off,
  .rl-ring, .rl-field, .rl-spark { animation: none; }
  [data-layout="split"] .rl-body::before { animation: none; transform: none; }
  .rl-cta:active { transform: none; }
  .rl-sweep { animation-delay: 0ms !important; animation-duration: 2500ms !important; }
}
`;

function Decoration({ motif }: { motif: string }) {
  if (motif === "rings") {
    return (
      <div className="rl-deco" aria-hidden>
        <span className="rl-ring" />
        <span className="rl-ring" />
        <span className="rl-ring" />
      </div>
    );
  }

  if (motif === "grid") {
    return (
      <div className="rl-deco" aria-hidden>
        <span className="rl-field" />
      </div>
    );
  }

  return (
    <div className="rl-deco" aria-hidden>
      {SPARKS.map((s) => (
        <span
          key={`${s.x}-${s.y}`}
          className="rl-spark"
          data-round={s.round ? "1" : "0"}
          style={{
            left: s.x,
            top: s.y,
            width: s.size,
            height: s.size,
            animationDelay: `${s.delay}ms, ${s.delay + 620}ms`,
          }}
        />
      ))}
    </div>
  );
}

export default async function RedirectLinkPage({ params }: PageProps) {
  const { code } = await params;
  const link = await getRedirectLink(code);
  if (!link) notFound();

  const { palette, layout, motif } = pickDesign();
  const words = link.businessName.split(/\s+/).filter(Boolean);

  return (
    <main
      className="rl"
      data-palette={palette.id}
      data-layout={layout}
      data-motif={motif}
      style={palette.vars as CSSProperties}
    >
      <style>{css}</style>
      <Decoration motif={motif} />

      <div className="rl-shell">
        <p className="rl-mark">
          <span className="rl-mark-pre">powered by</span>
          <span aria-hidden className="rl-mark-dot" />
          <span className="rl-mark-name">Activid</span>
        </p>

        <div className="rl-body">
          <h1 className="rl-name">
            {words.map((word, i) => (
              <span
                key={`${word}-${i}`}
                className="rl-word"
                style={{
                  animationDelay: `${
                    WORD_START_MS + Math.min(i, WORD_STEP_CAP) * WORD_STEP_MS
                  }ms`,
                }}
              >
                {word}
              </span>
            ))}
          </h1>
          <p className="rl-note">{link.thankYouNote || DEFAULT_NOTE}</p>
        </div>

        {/* Server-rendered anchor is also the no-JS path: the redirect is client-side. */}
        {link.active ? (
          <RedirectCountdown url={link.destinationUrl} />
        ) : (
          <p className="rl-off">Tautan ini sedang tidak aktif.</p>
        )}
      </div>
    </main>
  );
}
