#!/usr/bin/env python3
from pathlib import Path
import shutil
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
DIST = ROOT / "dist"

subprocess.run([sys.executable, str(ROOT / "scripts" / "validate.py")], check=True)

if DIST.exists():
    shutil.rmtree(DIST)
DIST.mkdir()

for name in ["index.html", "404.html", "manifest.webmanifest", "service-worker.js", "VERSION.json"]:
    src = ROOT / name
    if src.exists():
        shutil.copy2(src, DIST / name)

for folder in ["data", "icons"]:
    src = ROOT / folder
    if src.exists():
        shutil.copytree(src, DIST / folder)

print(f"Build créé dans {DIST}")
