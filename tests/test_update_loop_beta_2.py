from pathlib import Path
import json

ROOT = Path(__file__).resolve().parents[1]
HTML = (ROOT / "index.html").read_text(encoding="utf-8")
VERSION = json.loads((ROOT / "VERSION.json").read_text(encoding="utf-8"))

def test_exact_version_match():
    assert VERSION["version"] == "1.1.0-beta.2"
    assert 'const APP_VERSION="1.1.0-beta.2";' in HTML

def test_semver_parser_exists():
    assert "function parseAppVersion(value)" in HTML
    assert "function versionChannelRank(channel)" in HTML

def test_beta_ordering_is_supported():
    assert 'channel==="beta"' in HTML
    assert "x.number>y.number" in HTML

def test_overlay_can_close_when_current():
    assert "comparison<=0" in HTML
    assert "dismissAppUpdate()" in HTML
