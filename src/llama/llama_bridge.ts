/**
 * EMC⁴ → llama.cpp bridge
 * Rehydrates execution from .gsig
 */

import { readGSig } from "../core/gsig_reader.js";
import { spawn } from "child_process";

export interface LlamaRunOptions {
  modelPath: string;
  prompt: string;
}

export function runLlamaFromGSig(
  gsigPath: string,
  opts: LlamaRunOptions
) {
  const gsig = readGSig(gsigPath);

  // Sigil-bound prompt seed
  const sigilSeed = gsig.root.collapsed;

  const fullPrompt =
    `[SIGIL:${sigilSeed}]\n` +
    opts.prompt;

  const proc = spawn(
    "./llama.cpp/main",
    [
      "-m", opts.modelPath,
      "-p", fullPrompt,
      "--seed", "42",
      "--temp", "0.7"
    ],
    { stdio: "inherit" }
  );

  proc.on("exit", code => {
    if (code !== 0) {
      throw new Error(`llama.cpp exited with code ${code}`);
    }
  });
}
