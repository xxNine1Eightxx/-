/**
 * EMC⁴ SigilAGI Execution Core
 * Dual-channel enforced
 * Emits canonical .gsig container
 */

import crypto from "crypto";
import type { GlyphPair } from "./glyph";
import { applyDualPlacement } from "../laws/dual_placement.js";
import { writeGSig } from "./gsig_writer.js";
import type { GSigContainer } from "./gsig";
export class EMC {
  private readonly glyphs: readonly GlyphPair[];

  constructor(glyphs: readonly GlyphPair[]) {
    this.glyphs = glyphs;
  }

  /**
   * Execute dual placement + collapse
   * and emit an executable .gsig container
   */
  execute(outPath: string = "output.gsig"): GSigContainer {
    const dual = applyDualPlacement(this.glyphs);

    // Collapsed dual sigil (visible|invisible)
    const collapsed =
      dual.visibleRoot.visible + "|" + dual.invisibleRoot;

    // Hash binds BOTH channels
    const hash = crypto
      .createHash("sha256")
      .update(collapsed)
      .digest("hex");

    // Write canonical container
    const gsig = writeGSig(
      outPath,
      dual.tiers,
      dual.entropyTiers,
      dual.visibleRoot,
      dual.invisibleRoot
    );

    console.log("=== EMC⁴ SIGIL EXECUTION ===");
    console.log("Visible Root    :", dual.visibleRoot.visible);
    console.log("Invisible Root  :", dual.invisibleRoot);
    console.log("Collapsed Sigil :", collapsed);
    console.log("Execution Hash  :", hash);
    console.log("GSig Path       :", outPath);
    console.log("============================");

    return gsig;
  }
}
