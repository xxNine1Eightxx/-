/**
 * Φ-111 GlyphMatics Placement Law Engine
 * Dual-channel (visible + invisible), deterministic
 */

import type { GlyphPair } from "../core/glyph";

/**
 * Law: Singular Expansion
 * No mutation, order preserved
 */
export function singularExpand(
  glyphs: readonly GlyphPair[]
): GlyphPair[] {
  return [...glyphs];
}

/**
 * Law: Tier Packing
 * Fixed arity = 5
 */
export function packTiers(
  glyphs: readonly GlyphPair[],
  arity: number = 5
): GlyphPair[][] {
  if (arity !== 5) {
    throw new Error("Tier arity violation: must be 5");
  }

  const tiers: GlyphPair[][] = [];
  for (let i = 0; i < glyphs.length; i += arity) {
    tiers.push(glyphs.slice(i, i + arity));
  }
  return tiers;
}

/**
 * Law: Tier-of-Tiers
 * Recursive packing, same law
 */
export function tierOfTiers(
  tiers: readonly GlyphPair[][]
): GlyphPair[][] {
  const flattened = tiers.flat();
  return packTiers(flattened, 5);
}

/**
 * Law: Deterministic Collapse
 * First glyph wins, invariant
 */
export function collapseTiers(
  tiers: readonly GlyphPair[][]
): GlyphPair {
  for (const tier of tiers) {
    for (const g of tier) {
      return g;
    }
  }
  throw new Error("Collapse failure: no glyphs present");
}

/**
 * Full placement law application
 */
export function applyPlacementLaws(
  glyphs: readonly GlyphPair[]
): {
  readonly tiers: GlyphPair[][];
  readonly root: GlyphPair;
} {
  const expanded = singularExpand(glyphs);
  const tiers = packTiers(expanded, 5);
  const root = collapseTiers(tiers);

  return { tiers, root };
}
