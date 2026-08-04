from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENGINE = (ROOT / "src" / "core" / "engine.js").read_text(encoding="utf-8")

def test_route_plan_is_exposed():
    assert "routePlan" in ENGINE
    assert 'version:"12.0.0"' in ENGINE
