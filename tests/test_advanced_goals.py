from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENGINE = (ROOT / "src" / "core" / "engine.js").read_text(encoding="utf-8")

def test_advanced_goal_helpers_are_exposed():
    assert "scopedCaptures" in ENGINE
    assert "monthlySummary" in ENGINE
    assert 'version:"12.6.0"' in ENGINE
