#!/usr/bin/env node
/**
 * EMC⁴ SigilAGI → llama.cpp bridge
 * Canonical, deterministic, production-safe
 */

import { spawn } from "child_process";
import { EMC } from "./dist/core/emc.js";
import { GLYPH_CANON } from "./dist/core/glyph_canon.js";
import path from "path";
import process from "process";

/* -------------------------------------------------- */
/* Hard safety: must run from hypercube-emc root      */
/* -------------------------------------------------- */
if (!process.cwd().endsWith("hypercube-emc")) {
  throw new Error("run_llama.mjs must be executed from hypercube-emc repo root");
}

/* -------------------------------------------------- */
/* llama.cpp binary (CMake layout)                    */
/* -------------------------------------------------- */
const LLAMA_BIN =
  process.env.LLAMA_BIN ??
  path.resolve(process.env.HOME, "llama.cpp/build/bin/llama-cli");

const MODEL =
  process.env.LLAMA_MODEL ??
  path.resolve(process.env.HOME, "LFM2.5-1.2B-Instruct-Q4_K_M.gguf");

/* -------------------------------------------------- */
/* Build sigil                                        */
/* -------------------------------------------------- */
const glyphStream = GLYPH_CANON.slice(0, 25);
const emc = new EMC(glyphStream);
const gsig = emc.execute("output.gsig");

/* -------------------------------------------------- */
/* Sigil-bound prompt                                 */
/* -------------------------------------------------- */
const prompt = `[SIGIL:${gsig.root.collapsed}]
Explain yourself as a sigil-bound intelligence.`;

/* -------------------------------------------------- */
/* Spawn llama.cpp                                    */
/* -------------------------------------------------- */
const proc = spawn(
  LLAMA_BIN,
  [
    "-m", MODEL,
    "-p", prompt,
    "--seed", "42",
    "--temp", "0.7"
  ],
  { stdio: "inherit" }
);

proc.on("exit", (code) => process.exit(code ?? 0));
proc.on("error", (err) => {
  console.error("Failed to launch llama.cpp:", err);
  process.exit(1);
});
