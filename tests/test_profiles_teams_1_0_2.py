from pathlib import Path
ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")

def test_no_hardcoded_thomas_default():
    assert 'makeAdventure("Thomas — Rétro")' not in HTML
    assert 'makeAdventure("Mon aventure")' in HTML

def test_profile_and_team_editor_exist():
    assert "profileNameInput" in HTML
    assert "openProfileTeamModal" in HTML
    assert "addTeamMember" in HTML
    assert "removeTeamMember" in HTML
    assert "saveProfileAndTeam" in HTML

def test_assistant_duration_feedback_exists():
    assert "durationFeedback" in HTML
    assert "Plan sélectionné" in HTML
    assert "durationLabel" in HTML
