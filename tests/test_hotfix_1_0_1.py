from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")

def test_modal_helpers_exist():
    assert "function showModal(id)" in HTML
    assert "function closeModal(id)" in HTML

def test_stage_is_reversible_and_refreshed():
    assert "a.done[step][i]=!a.done[step][i]" in HTML
    assert "renderStage();" in HTML
    assert "if(!a.done[step][i]&&a.currentStep>step)a.currentStep=step" in HTML

def test_assistant_duration_is_immediate():
    assert 'safeRender("Assistant",renderAssistant)' in HTML

def test_render_errors_are_isolated():
    assert "function safeRender(name,fn)" in HTML
    assert 'safeRender("Étape ouverte",renderStage)' in HTML
