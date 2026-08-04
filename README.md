# Ocre Companion Stable 1.0

Compagnon personnel complet pour **L’Éternelle Moisson sur Dofus Rétro**.

**Statut : version stable.**


Compagnon personnel pour la quête **L’Éternelle Moisson sur Dofus Rétro**.

## Fonctions

- suivi exact des 35 étapes ;
- reprise d’une quête déjà commencée ;
- plusieurs aventures indépendantes ;
- équipes jusqu’à huit personnages ;
- inventaire quantitatif des archimonstres ;
- journal, doublons et statistiques ;
- mode chasse, favoris, notes et listes personnelles ;
- assistant de rendu ;
- bestiaire unifié Dofus Rétro ;
- PWA installable et utilisable hors ligne.

## Publier sur GitHub Pages

1. Décompresser le dépôt.
2. Remplacer les fichiers du dépôt GitHub par ceux-ci.
3. Envoyer les changements sur la branche `main`.
4. Dans GitHub, ouvrir **Settings → Pages**.
5. Sélectionner **GitHub Actions** comme source.

Le workflow `.github/workflows/deploy-pages.yml` valide puis publie automatiquement l’application.

## Vérification locale

```bash
python scripts/validate.py
python scripts/build.py
```

Le second script crée un dossier `dist/`.

## Règle absolue

La base `data/ocre-retro-db.json` est exclusivement réservée à **Dofus Rétro**.
Toute donnée non vérifiée doit rester marquée comme non auditée.

## Structure

```text
.
├── index.html                 # application publiée
├── data/                      # base unifiée Dofus Rétro
├── icons/                     # icônes PWA publiées
├── src/                       # sources lisibles et documentation des modules
├── assets/                    # ressources sources
├── docs/                      # architecture, données et roadmap
├── scripts/                   # validation et build
├── tests/                     # tests de cohérence
└── .github/workflows/         # publication automatique
```
