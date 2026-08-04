from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")

def test_essential_dashboard_values_are_set_before_secondary_engine_calls():
    start = HTML.index("function renderDashboard(){")
    end = HTML.index("function safeRender", start)
    block = HTML[start:end]
    assert block.index('if(remaining)remaining.textContent=arch.remaining') < block.index("dashboardStockStats()")
    assert block.index('if(stages)stages.textContent=completed+" / 35 étapes"') < block.index("dashboardReadyStages()")

def test_secondary_dashboard_calculations_are_isolated():
    assert 'const stock=dashboardStockStats();' in HTML
    assert 'const ready=dashboardReadyStages();' in HTML
    assert 'readyNode.textContent="—"' in HTML

def test_save_forces_dashboard_refresh():
    assert 'safeRender("Tableau de bord prioritaire",renderDashboard)' in HTML
