from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")

def test_removed_broken_home_cards():
    assert "<strong>Priorité recommandée</strong>" not in HTML
    assert "<strong>À faire maintenant</strong>" not in HTML

def test_dashboard_counts_checked_archi_stages():
    assert 'QUEST.filter(q=>q.kind==="Archimonstres")' in HTML
    assert 'done+=(current().done[q.step]||[])' in HTML
    assert 'dashboardArchiStats()' in HTML

def test_archi_relation_uses_quest_stage():
    assert "a.questStage||a.step" in HTML
