from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENGINE = (ROOT / "src" / "core" / "engine.js").read_text(encoding="utf-8")

def test_personal_records_is_exposed():
    assert "personalRecords" in ENGINE
    assert 'version:"12.3.0"' in ENGINE
