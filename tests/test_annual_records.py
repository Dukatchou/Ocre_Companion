from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENGINE = (ROOT / "src" / "core" / "engine.js").read_text(encoding="utf-8")

def test_annual_helpers_are_exposed():
    assert "compareYears" in ENGINE
    assert "annualRecords" in ENGINE
    assert 'version:"13.0.0"' in ENGINE
