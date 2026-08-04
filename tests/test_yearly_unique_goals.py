from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENGINE = (ROOT / "src" / "core" / "engine.js").read_text(encoding="utf-8")

def test_yearly_and_unique_helpers_are_exposed():
    assert "calendarYear" in ENGINE
    assert "questUniqueArchisCount" in ENGINE
    assert 'version:"12.9.0"' in ENGINE
