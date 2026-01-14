/**
 * Φ-111 Entropy-Side Placement Laws (Right Bracket)
 * Mirrors visible placement EXACTLY.
 * No interpretation. No mutation.
 */

import type { GlyphPair } from "../core/glyph";

/**
 * Extract invisible channel only
 */
export function extractInvisible(
  glyphs: readonly GlyphPair[]
): string[] {
  return glyphs.map(g => g.invisible);
}

/**
 * Law: Singular Expansion (Entropy)
 */
export function singularExpandEntropy(
  invisibles: readonly string[]
): string[] {
  return [...invisibles];
}

/**
 * Law: Tier Packing (Entropy)
 * Arity MUST match visible side
 */
export function packEntropyTiers(
  invisibles: readonly string[],
  arity: number = 5
): string[][] {
  if (arity !== 5) {
    throw new Error("Entropy tier arity violation");
  }

  const tiers: string[][] = [];
  for (let i = 0; i < invisibles.length; i += arity) {
    tiers.push(invisibles.slice(i, i + arity));
  }
  return tiers;
}

/**
 * Law: Entropy Collapse
 * Deterministic: first element wins
 */
export function collapseEntropyTiers(
  tiers: readonly string[][]
): string {
  for (const tier of tiers) {
    for (const e of tier) {
      return e;
    }
  }
  throw new Error("Entropy collapse failure");
}

/**
 * Full entropy law application
 */
export function applyEntropyPlacement(
  glyphs: readonly GlyphPair[]
): {
  readonly entropyTiers: string[][];
  readonly entropyRoot: string;
} {
  const invisibles = extractInvisible(glyphs);
  const expanded = singularExpandEntropy(invisibles);
  const tiers = packEntropyTiers(expanded, 5);
  const root = collapseEntropyTiers(tiers);

  return {
    entropyTiers: tiers,
    entropyRoot: root
  };
}
