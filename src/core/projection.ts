/**
 * Projection and tier helpers
 */

import type { Glyph } from "./types";

export function buildTiers(
  glyphs: Glyph[],
  arity: number = 5
): Glyph[][] {
  if (arity !== 5) {
    throw new Error("Tier arity violation: must be 5");
  }

  const tiers: Glyph[][] = [];
  for (let i = 0; i < glyphs.length; i += arity) {
    tiers.push(glyphs.slice(i, i + arity));
  }
  return tiers;
}
