from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
DB = json.loads((ROOT / "data" / "ocre-retro-db.json").read_text(encoding="utf-8"))

def test_retro_only():
    assert DB["game"] == "Dofus Rétro"
    assert DB["metadata"]["unityData"] is False

def test_quest_counts():
    assert len(DB["quest"]["stages"]) == 35
    assert len(DB["monsters"]) == 299
    assert len(DB["bosses"]) == 51
    assert len(DB["archimonsters"]) == 286

def test_archimonster_relations():
    assert all(a.get("originalMonster") for a in DB["archimonsters"])
