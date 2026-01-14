/**
 * Φ-111 Dual Placement Executor
 * Enforces visible + invisible lockstep execution
 */

import type { GlyphPair } from "../core/glyph";
import { applyPlacementLaws } from "./placement.js";
import { applyEntropyPlacement } from "./entropy_placement.js";

export interface DualPlacementResult {
  readonly visibleRoot: GlyphPair;
  readonly invisibleRoot: string;
  readonly tiers: GlyphPair[][];
  readonly entropyTiers: string[][];
}

/**
 * Execute both sides under strict invariants
 */
export function applyDualPlacement(
  glyphs: readonly GlyphPair[]
): DualPlacementResult {
  const visible = applyPlacementLaws(glyphs);
  const entropy = applyEntropyPlacement(glyphs);

  // HARD invariant: tier counts must match
  if (visible.tiers.length !== entropy.entropyTiers.length) {
    throw new Error("Dual placement divergence: tier count mismatch");
  }

  return {
    visibleRoot: visible.root,
    invisibleRoot: entropy.entropyRoot,
    tiers: visible.tiers,
    entropyTiers: entropy.entropyTiers
  };
}
