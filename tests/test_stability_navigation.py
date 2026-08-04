from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")

def test_no_duplicate_heavy_render_block():
    needle = "renderSessionCalendar();renderYearCalendar();renderYearComparison();renderAnnualRecords();renderProjectCompletion();renderStageGoals();renderInAppReminders();renderSessionCalendar()"
    assert needle not in HTML

def test_more_and_diagnostics_exist():
    assert 'id="morePage"' in HTML
    assert "runDiagnostics" in HTML
    assert "repairLocalData" in HTML
