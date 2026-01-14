/**
 * Φ-111 Glyph Canon Loader
 * ESM-safe, deterministic, runtime-correct
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import type { GlyphPair } from "./glyph";

/* ------------------------------------------------------------------ */
/* ESM-safe __dirname replacement                                     */
/* ------------------------------------------------------------------ */

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ------------------------------------------------------------------ */
/* Canon path (locked)                                                 */
/* ------------------------------------------------------------------ */

const CANON_PATH = path.resolve(
  __dirname,
  "../../canon/glyph_canon_111_inline.tsv"
);

/* ------------------------------------------------------------------ */
/* Load canonical dual glyph pairs                                     */
/* ------------------------------------------------------------------ */

function loadCanon(): GlyphPair[] {
  const raw = fs.readFileSync(CANON_PATH, "utf8");

  const lines = raw
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean);

  const pairs: GlyphPair[] = [];

  for (const line of lines) {
    const [visible, invisible] = line.split("\t");
    if (!visible || !invisible) {
      throw new Error("Invalid glyph canon line: " + line);
    }
    pairs.push({ visible, invisible });
  }

  if (pairs.length !== 111) {
    throw new Error(
      `Glyph canon invariant violated: expected 111, got ${pairs.length}`
    );
  }

  return pairs;
}

/* ------------------------------------------------------------------ */
/* Exported canon (immutable)                                          */
/* ------------------------------------------------------------------ */

export const GLYPH_CANON: readonly GlyphPair[] = Object.freeze(loadCanon());
