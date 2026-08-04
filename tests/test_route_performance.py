from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENGINE = (ROOT / "src" / "core" / "engine.js").read_text(encoding="utf-8")

def test_route_performance_is_exposed():
    assert "routePerformance" in ENGINE
    assert 'version:"12.2.0"' in ENGINE
