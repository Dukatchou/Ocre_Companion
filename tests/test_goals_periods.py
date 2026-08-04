from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENGINE = (ROOT / "src" / "core" / "engine.js").read_text(encoding="utf-8")

def test_goals_and_period_helpers_are_exposed():
    assert "periodSummary" in ENGINE
    assert "goalProgress" in ENGINE
    assert 'version:"12.5.0"' in ENGINE
