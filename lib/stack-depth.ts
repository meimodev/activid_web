/**
 * Depth maths for the pinned "card deck" in `ServiceStack`.
 *
 * The stack container is scrolled through once; its scroll progress (0 → 1) is
 * mapped onto a continuous "active card" position. A card's *depth* is how many
 * cards are currently stacked on top of it — a float, so the transition between
 * layers is smooth rather than stepped.
 *
 * Both the scale and the opacity are clamped: with five cards, an uncapped
 * cumulative shrink would drive the first card to ~0.81 and near-invisible by
 * the time the last one pins. The floors keep the deck reading as a physical
 * stack instead of a vanishing point.
 *
 * Cards all pin at the same offset, so a shrunken card sits entirely *behind*
 * the one covering it — scale and opacity alone would be invisible. `depthRidge`
 * lifts each buried layer a few px (paired with `transform-origin: top`, which
 * stops the shrink from cancelling the lift) so the deck shows its edges.
 */

export const DEPTH_SCALE_STEP = 0.05;
export const DEPTH_SCALE_FLOOR = 0.9;
export const DEPTH_OPACITY_STEP = 0.25;
export const DEPTH_OPACITY_FLOOR = 0.45;
/** Px each buried layer rides up, so its top edge peeks out as a visible ridge. */
export const DEPTH_RIDGE_STEP = 8;

/**
 * How many cards cover the card at `index`, given the stack's scroll progress.
 *
 * Pins are evenly spaced and the scroll range ends exactly on the last pin (see
 * the `--pin-*` custom properties in `ServiceStack`), so progress maps linearly
 * onto the active card position.
 */
export function stackDepth(progress: number, index: number, count: number): number {
  if (count <= 1) return 0;
  const active = progress * (count - 1);
  const depth = active - index;
  if (depth < 0) return 0;
  const maxDepth = count - 1 - index;
  return depth > maxDepth ? maxDepth : depth;
}

/** Scale for a card buried `depth` layers deep. */
export function depthScale(depth: number): number {
  return Math.max(DEPTH_SCALE_FLOOR, 1 - DEPTH_SCALE_STEP * depth);
}

/** Opacity for a card buried `depth` layers deep. */
export function depthOpacity(depth: number): number {
  return Math.max(DEPTH_OPACITY_FLOOR, 1 - DEPTH_OPACITY_STEP * depth);
}

/**
 * Opacity of the dimming scrim laid *inside* a buried card.
 *
 * The fade cannot be element opacity: a translucent card lets the card beneath
 * it show through, so headlines from two layers down bleed into the top card.
 * Dimming with an opaque overlay keeps every card solid.
 */
export function depthScrim(depth: number): number {
  return 1 - depthOpacity(depth);
}

/** Upward offset, in px, for a card buried `depth` layers deep. */
export function depthRidge(depth: number): number {
  return -DEPTH_RIDGE_STEP * depth;
}
