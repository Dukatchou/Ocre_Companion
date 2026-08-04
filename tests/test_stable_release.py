from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
VERSION = json.loads((ROOT / "VERSION.json").read_text(encoding="utf-8"))
HTML = (ROOT / "index.html").read_text(encoding="utf-8")

def test_stable_version():
    assert VERSION["version"] == "1.0.0"
    assert VERSION["status"] == "stable"
    assert VERSION["schemaVersion"] == 14

def test_no_release_candidate_label():
    assert "V14 RC" not in HTML
    assert "Stable 1.0" in HTML
