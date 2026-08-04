from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENGINE = (ROOT / "src" / "core" / "engine.js").read_text(encoding="utf-8")

def test_session_trend_and_comparison_are_exposed():
    assert "sessionTrend" in ENGINE
    assert "compareSessions" in ENGINE
    assert 'version:"12.4.0"' in ENGINE
