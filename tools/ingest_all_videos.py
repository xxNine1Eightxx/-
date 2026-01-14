#!/usr/bin/env python3
"""
Φ-111 Bulk Video → GSig Ingestor (CANONICAL)

Supports ALL known GTV index schemas:
- dict-based indexes with "frames"
- list-based frame indexes

Deterministic. Idempotent. Schema-agnostic.
"""

from pathlib import Path
import json
import hashlib

HOME = Path.home()
OUT_DIR = Path("sigils/video")
OUT_DIR.mkdir(parents=True, exist_ok=True)

def extract_frame_count(index):
    if isinstance(index, dict):
        if "frames" in index and isinstance(index["frames"], list):
            return len(index["frames"])
        return 0
    if isinstance(index, list):
        return len(index)
    return 0

def make_gsig(index_path: Path) -> dict:
    index = json.loads(index_path.read_text())

    frame_count = extract_frame_count(index)

    latent_keys = [
        f"path:{index_path.parent.name}",
        f"frames:{frame_count}",
    ]

    h = hashlib.sha256(
        json.dumps(latent_keys, sort_keys=True).encode()
    ).hexdigest()

    return {
        "version": "Φ-111",
        "modality": "video",
        "video": {
            "latent_keys": latent_keys,
            "source": str(index_path)
        },
        "root": {
            "visible": h[:8],
            "invisible": h[8:16],
            "collapsed": f"{h[:8]}|{h[8:16]}"
        },
        "invariants": {
            "arity": 5,
            "glyph_count": 111,
            "dual_channel": True
        }
    }

count = 0

for index_path in HOME.glob("gtv_*/**/index.json"):
    name = index_path.parent.name
    out_path = OUT_DIR / f"{name}.gsig"

    if out_path.exists():
        continue  # idempotent

    gsig = make_gsig(index_path)
    out_path.write_text(json.dumps(gsig, indent=2))
    print("Wrote:", out_path)
    count += 1

print(f"[Φ-111] Video GSigs ingested: {count}")
