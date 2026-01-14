/**
 * Φ-111 Executable Sigil Container (.gsig)
 * Canonical, deterministic, dual-channel
 */

import type { GlyphPair } from "./glyph";

export interface GSigRoot {
  readonly visible: string;
  readonly invisible: string;
  readonly collapsed: string;
}

export interface GSigTiers {
  readonly visible: readonly GlyphPair[][];
  readonly invisible: readonly string[][];
}

export interface GSigContainer {
  readonly version: "Φ-111";
  readonly root: GSigRoot;
  readonly tiers: GSigTiers;
  readonly hash: string;
  readonly invariants: {
    readonly arity: 5;
    readonly glyph_count: 111;
    readonly dual_channel: true;
  };
}
