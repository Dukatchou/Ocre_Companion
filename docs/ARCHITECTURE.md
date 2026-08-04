# Architecture d’Ocre Companion

## Production GitHub Pages

Les fichiers directement servis sont conservés à la racine :

- `index.html`
- `manifest.webmanifest`
- `service-worker.js`
- `data/`
- `icons/`
- `404.html`

Le site reste donc publiable immédiatement sans outil de compilation.

## Sources

- `src/app/` : instantané lisible de la logique JavaScript.
- `src/styles/` : feuille de style extraite.
- `src/features/` : responsabilités fonctionnelles.
- `data/` : base unique Dofus Rétro.
- `assets/` : ressources visuelles sources.
- `scripts/` : outils de validation et de préparation d’une release.
- `tests/` : contrôles automatiques.
- `docs/` : documentation du projet.

## Principe de données

Tous les écrans doivent lire une source unique : `data/ocre-retro-db.json`.

Aucune donnée Dofus Unity ne doit être ajoutée à cette base.

## Compatibilité

La production reste volontairement sans dépendance et sans compilation afin de fonctionner :
- sur GitHub Pages ;
- comme PWA ;
- hors ligne après installation.
