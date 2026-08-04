from pathlib import Path
import json
import re

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
VERSION = json.loads((ROOT / "VERSION.json").read_text(encoding="utf-8"))

def test_version():
    assert VERSION["version"] == "1.1.0-beta.3"
    assert 'const APP_VERSION="1.1.0-beta.3";' in HTML

def test_critical_team_functions_are_unique():
    for name in [
        "openProfileTeamModal",
        "renderTeamEditor",
        "addTeamMember",
        "removeTeamMember",
        "saveProfileAndTeam",
        "editTeam",
    ]:
        assert len(re.findall(rf"function\s+{name}\s*\(", HTML)) == 1

def test_new_editor_features_remain():
    assert "profileTeamDraft" in HTML
    assert "setDraftActiveCharacter" in HTML
    assert "moveDraftTeamMember" in HTML
    assert 'id="profileTeamModal"' in HTML

def test_legacy_editor_is_removed():
    assert "function setTeamMemberName(index,value)" not in HTML
