from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENGINE = (ROOT / "src" / "core" / "engine.js").read_text(encoding="utf-8")

def test_session_summary_is_exposed():
    assert "sessionSummary" in ENGINE
    assert 'version:"12.1.0"' in ENGINE
