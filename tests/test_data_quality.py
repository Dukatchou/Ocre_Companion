from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
DB = json.loads((ROOT / "data" / "ocre-retro-db.json").read_text(encoding="utf-8"))

def test_unique_archimonster_ids_and_names():
    ids = [a["id"] for a in DB["archimonsters"]]
    names = [a["name"] for a in DB["archimonsters"]]
    assert len(ids) == len(set(ids))
    assert len(names) == len(set(names))

def test_archimonster_relationships():
    quest_by_step = {stage["step"]: stage for stage in DB["quest"]["stages"]}
    for archi in DB["archimonsters"]:
        assert archi.get("originalMonster")
        assert archi["name"] in quest_by_step[archi["questStage"]]["objectives"]
