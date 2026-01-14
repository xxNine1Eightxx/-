/**
 * Φ-111 Dual Glyph Definition
 * Visible + Invisible are inseparable
 */

export type GlyphVisible = string;
export type GlyphInvisible = string;

export interface GlyphPair {
  readonly visible: GlyphVisible;
  readonly invisible: GlyphInvisible;
}
