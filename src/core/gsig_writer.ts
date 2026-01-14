/**
 * Φ-111 GSig Writer
 * Serializes dual-placement result to disk
 */

import fs from "fs";
import crypto from "crypto";
import type { GlyphPair } from "./glyph";
import type { GSigContainer } from "./gsig";

export function writeGSig(
  path: string,
  visibleTiers: readonly GlyphPair[][],
  invisibleTiers: readonly string[][],
  visibleRoot: GlyphPair,
  invisibleRoot: string
): GSigContainer {
  const collapsed = `${visibleRoot.visible}|${invisibleRoot}`;

  const hash = crypto
    .createHash("sha256")
    .update(collapsed)
    .digest("hex");

  const container: GSigContainer = {
    version: "Φ-111",
    root: {
      visible: visibleRoot.visible,
      invisible: invisibleRoot,
      collapsed
    },
    tiers: {
      visible: visibleTiers,
      invisible: invisibleTiers
    },
    hash,
    invariants: {
      arity: 5,
      glyph_count: 111,
      dual_channel: true
    }
  };

  fs.writeFileSync(path, JSON.stringify(container, null, 2), "utf8");

  return container;
}
