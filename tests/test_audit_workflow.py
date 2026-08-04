from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
DB = json.loads((ROOT / "data" / "ocre-retro-db.json").read_text(encoding="utf-8"))

def test_archimonsters_have_stable_ids():
    ids = [x["id"] for x in DB["archimonsters"]]
    assert len(ids) == 286
    assert len(set(ids)) == 286

def test_retro_scope():
    assert DB["game"] == "Dofus Rétro"
    assert DB["metadata"]["unityData"] is False
