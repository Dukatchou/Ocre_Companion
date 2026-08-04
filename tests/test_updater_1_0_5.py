from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
VERSION = json.loads((ROOT / "VERSION.json").read_text(encoding="utf-8"))

def test_integrated_update_screen_exists():
    assert 'id="updateOverlay"' in HTML
    assert "installAvailableUpdate" in HTML
    assert "dismissAppUpdate" in HTML

def test_remote_version_check_exists():
    assert "fetchRemoteVersion" in HTML
    assert "VERSION_MANIFEST_URL" in HTML
    assert "compareVersions" in HTML

def test_local_data_backup_before_update():
    assert "ocre_pre_update_backup" in HTML

def test_version():
    assert VERSION["version"] == "1.0.5"
