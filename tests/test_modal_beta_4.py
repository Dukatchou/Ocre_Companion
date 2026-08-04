from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
VERSION = json.loads((ROOT / "VERSION.json").read_text(encoding="utf-8"))

def test_version():
    assert VERSION["version"] == "1.1.0-beta.4"
    assert 'const APP_VERSION="1.1.0-beta.4";' in HTML

def test_modal_helpers_exist_once():
    assert len(re.findall(r"function\s+showModal\s*\(", HTML)) == 1
    assert len(re.findall(r"function\s+closeModal\s*\(", HTML)) == 1

def test_team_editor_uses_modal_helper():
    assert 'showModal("profileTeamModal")' in HTML
    assert 'closeModal("profileTeamModal")' in HTML

def test_modal_elements_exist():
    for element_id in [
        "profileTeamModal",
        "profileNameInput",
        "adventureNameInput",
        "teamEditor",
    ]:
        assert f'id="{element_id}"' in HTML
