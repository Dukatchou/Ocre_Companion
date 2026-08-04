from pathlib import Path

ROOT=Path(__file__).resolve().parents[1]
ENGINE=(ROOT/'src/core/engine.js').read_text(encoding='utf-8')

def test_engine_exports_core_contract():
    for name in ['totals','stageComplete','stockStats','readyStages','recommendation','snapshot']:
        assert name in ENGINE

def test_engine_is_retro_data_agnostic():
    assert 'Unity' not in ENGINE
