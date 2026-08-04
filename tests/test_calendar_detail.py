from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENGINE = (ROOT / "src" / "core" / "engine.js").read_text(encoding="utf-8")

def test_calendar_and_completed_stage_helpers_are_exposed():
    assert "calendarMonth" in ENGINE
    assert "completedStagesCount" in ENGINE
    assert 'version:"12.8.0"' in ENGINE
