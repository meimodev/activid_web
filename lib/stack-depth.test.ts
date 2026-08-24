import { describe, expect, it } from 'vitest';
import {
  DEPTH_OPACITY_FLOOR,
  DEPTH_RIDGE_STEP,
  DEPTH_SCALE_FLOOR,
  depthOpacity,
  depthRidge,
  depthScrim,
  depthScale,
  stackDepth,
} from './stack-depth';

const COUNT = 5;

describe('stackDepth', () => {
  it('leaves the top card untouched at every scroll position', () => {
    for (const p of [0, 0.25, 0.5, 0.75, 1]) {
      const last = COUNT - 1;
      expect(stackDepth(p, last, COUNT)).toBe(0);
    }
  });

  it('buries the first card one layer deeper per pin', () => {
    expect(stackDepth(0, 0, COUNT)).toBe(0);
    expect(stackDepth(0.25, 0, COUNT)).toBe(1);
    expect(stackDepth(1, 0, COUNT)).toBe(COUNT - 1);
  });

  it('never reports negative depth for cards that have not been reached', () => {
    expect(stackDepth(0.25, 3, COUNT)).toBe(0);
  });

  it('orders cards so lower ones are always at least as deep', () => {
    for (const p of [0.1, 0.3, 0.6, 0.9]) {
      for (let i = 1; i < COUNT; i++) {
        expect(stackDepth(p, i - 1, COUNT)).toBeGreaterThanOrEqual(stackDepth(p, i, COUNT));
      }
    }
  });

  it('handles a single card', () => {
    expect(stackDepth(0.5, 0, 1)).toBe(0);
  });
});

describe('depth styling', () => {
  it('holds the floors so the bottom card never vanishes', () => {
    const deepest = stackDepth(1, 0, COUNT);
    expect(depthScale(deepest)).toBe(DEPTH_SCALE_FLOOR);
    expect(depthOpacity(deepest)).toBe(DEPTH_OPACITY_FLOOR);
  });

  it('leaves an uncovered card at full size and opacity', () => {
    expect(depthScale(0)).toBe(1);
    expect(depthOpacity(0)).toBe(1);
  });

  it('lifts buried cards so their edges stay visible above the covering card', () => {
    expect(depthRidge(0)).toBeCloseTo(0);
    expect(depthRidge(1)).toBe(-DEPTH_RIDGE_STEP);
    expect(depthRidge(2)).toBeLessThan(depthRidge(1));
  });

  it('keeps the deepest ridge clear of the 73px sticky nav', () => {
    const PIN_TOP = 112; // --pin-top: 7rem
    const NAV_HEIGHT = 73;
    const deepest = stackDepth(1, 0, COUNT);
    expect(PIN_TOP + depthRidge(deepest)).toBeGreaterThan(NAV_HEIGHT);
  });

  it('dims buried cards with a scrim that never goes fully opaque', () => {
    expect(depthScrim(0)).toBe(0);
    expect(depthScrim(1)).toBeGreaterThan(0);
    expect(depthScrim(stackDepth(1, 0, COUNT))).toBeCloseTo(1 - DEPTH_OPACITY_FLOOR);
    expect(depthScrim(99)).toBeLessThan(1);
  });

  it('shrinks and fades monotonically before hitting the floors', () => {
    expect(depthScale(1)).toBeLessThan(depthScale(0));
    expect(depthScale(2)).toBeLessThan(depthScale(1));
    expect(depthOpacity(1)).toBeLessThan(depthOpacity(0));
    expect(depthOpacity(2)).toBeLessThan(depthOpacity(1));
  });
});
