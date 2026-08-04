#!/usr/bin/env python3
from pathlib import Path
import json
import sys

ROOT = Path(__file__).resolve().parents[1]
db_path = ROOT / "data" / "ocre-retro-db.json"

errors = []
if not db_path.exists():
    errors.append("data/ocre-retro-db.json est absent.")
else:
    db = json.loads(db_path.read_text(encoding="utf-8"))
    if db.get("game") != "Dofus Rétro":
        errors.append("La base n'est pas identifiée comme Dofus Rétro.")
    quest = db.get("quest", {})
    if len(quest.get("stages", [])) != 35:
        errors.append("La quête doit contenir 35 étapes.")
    if len(db.get("archimonsters", [])) != 286:
        errors.append("La base doit contenir 286 archimonstres.")
    if len(db.get("bosses", [])) != 51:
        errors.append("La base doit contenir 51 boss.")
    if len(db.get("monsters", [])) != 299:
        errors.append("La base doit contenir 299 monstres normaux.")

required = ["index.html", "manifest.webmanifest", "service-worker.js"]
for filename in required:
    if not (ROOT / filename).exists():
        errors.append(f"{filename} est absent.")

if errors:
    print("ÉCHEC")
    for error in errors:
        print("-", error)
    sys.exit(1)

print("Validation réussie.")
