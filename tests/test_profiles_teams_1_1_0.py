from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
VERSION = json.loads((ROOT / "VERSION.json").read_text(encoding="utf-8"))

def test_version():
    assert VERSION["version"] == "1.1.0-beta.1"
    assert VERSION["status"] == "beta"

def test_profile_team_modal_exists():
    assert 'id="profileTeamModal"' in HTML
    assert "openProfileTeamModal" in HTML
    assert "saveProfileAndTeam" in HTML
    assert "cancelProfileTeamEdit" in HTML

def test_team_management_features_exist():
    for name in [
        "addTeamMember",
        "removeTeamMember",
        "setDraftActiveCharacter",
        "moveDraftTeamMember",
        "renameDraftTeamMember",
    ]:
        assert name in HTML

def test_active_character_is_persisted():
    assert "activeCharacterIndex" in HTML
    assert "Personnage actif" in HTML

def test_draft_prevents_cancel_side_effects():
    assert "profileTeamDraft" in HTML
