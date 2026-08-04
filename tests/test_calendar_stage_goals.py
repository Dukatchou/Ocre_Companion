from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
ENGINE = (ROOT / "src" / "core" / "engine.js").read_text(encoding="utf-8")

def test_stage_goal_helper_is_exposed():
    assert "stageGoalProgress" in ENGINE
    assert 'version:"12.7.0"' in ENGINE
