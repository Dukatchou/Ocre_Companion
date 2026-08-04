from pathlib import Path
import json
ROOT=Path(__file__).resolve().parents[1]
HTML=(ROOT/'index.html').read_text(encoding='utf-8')
VERSION=json.loads((ROOT/'VERSION.json').read_text(encoding='utf-8'))
def test_rc():
 assert VERSION['status']=='release-candidate'
 assert VERSION['schemaVersion']==14
 assert 'restoreBackupFile' in HTML
 assert 'renderReleaseChecklist' in HTML
