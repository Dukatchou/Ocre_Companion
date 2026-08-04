from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
SW = (ROOT / "service-worker.js").read_text(encoding="utf-8")
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
VERSION = json.loads((ROOT / "VERSION.json").read_text(encoding="utf-8"))

def test_skip_waiting_really_runs():
    assert 'event.data.type==="SKIP_WAITING"' in SW
    assert "self.skipWaiting();" in SW

def test_single_fetch_handler():
    assert SW.count('self.addEventListener("fetch"') == 1

def test_version_manifest_is_network_first():
    assert 'url.pathname.endsWith("/VERSION.json")' in SW
    assert 'cache:"no-store"' in SW

def test_version():
    assert VERSION["version"] == "1.0.6"
    assert 'const APP_VERSION="1.0.6";' in HTML
