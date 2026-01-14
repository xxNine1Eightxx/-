#!/usr/bin/env node
/**
 * Φ-111 GSig → Inference Bridge
 * Canonical, repo-root anchored, ESM-safe
 */

import { spawn } from "child_process";
import path from "path";
import process from "process";
import { fileURLToPath } from "url";

/* -------------------------------------------------- */
/* Resolve repo root                                  */
/* -------------------------------------------------- */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = __dirname;

/* -------------------------------------------------- */
/* Load GSig reader                                   */
/* -------------------------------------------------- */
const { readGSig } = await import(
  path.join(REPO_ROOT, "dist/core/gsig_reader.js")
);

/* -------------------------------------------------- */
/* Args                                               */
/* -------------------------------------------------- */
const gsigArg = process.argv[2];
if (!gsigArg) {
  console.error("Usage: node run_gsig.mjs <file.gsig>");
  process.exit(1);
}

const gsigPath = path.resolve(gsigArg);

/* -------------------------------------------------- */
/* Load + validate sigil                               */
/* -------------------------------------------------- */
const gsig = readGSig(gsigPath);

/* -------------------------------------------------- */
/* Resolve llama.cpp                                  */
/* -------------------------------------------------- */
const LLAMA_BIN =
  process.env.LLAMA_BIN ??
  path.resolve(process.env.HOME, "llama.cpp/build/bin/llama-cli");

const MODEL =
  process.env.LLAMA_MODEL ??
  path.resolve(process.env.HOME, "LFM2.5-1.2B-Instruct-Q4_K_M.gguf");

/* -------------------------------------------------- */
/* Sigil-bound prompt                                 */
/* -------------------------------------------------- */
const prompt = `[SIGIL:${gsig.root.collapsed}]
You are executing under a Φ-111 sigil container.
Explain your state and constraints.`;

/* -------------------------------------------------- */
/* Execute llama.cpp                                  */
/* -------------------------------------------------- */
spawn(
  LLAMA_BIN,
  [
    "-m", MODEL,
    "-p", prompt,
    "--seed", "42",
    "--temp", "0.7"
  ],
  { stdio: "inherit" }
);
