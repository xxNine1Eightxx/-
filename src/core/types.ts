/**
 * Core types for EMC⁴ SigilAGI
 */

export type Glyph = string;

export interface ExecutionResult {
  rootSigil: Glyph;
  tierCount: number;
  hash: string;
}
