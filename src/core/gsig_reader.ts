/**
 * Φ-111 GSig Reader
 * Validates invariants before execution
 */

import fs from "fs";
import crypto from "crypto";
import type { GSigContainer } from "./gsig";

export function readGSig(path: string): GSigContainer {
  const raw = fs.readFileSync(path, "utf8");
  const gsig = JSON.parse(raw) as GSigContainer;

  if (gsig.version !== "Φ-111") {
    throw new Error("Invalid GSig version");
  }

  if (!gsig.invariants.dual_channel) {
    throw new Error("GSig dual-channel invariant violated");
  }

  const recomputed = crypto
    .createHash("sha256")
    .update(gsig.root.collapsed)
    .digest("hex");

  if (recomputed !== gsig.hash) {
    throw new Error("GSig hash verification failed");
  }

  return gsig;
}
