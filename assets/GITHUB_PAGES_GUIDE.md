# Déployer Ocre Companion sur GitHub Pages

## 1. Créer le dépôt
1. Va sur GitHub et crée un nouveau dépôt, par exemple `ocre-companion`.
2. Laisse-le privé ou public selon ton choix. GitHub Pages gratuit fonctionne plus simplement avec un dépôt public selon l’offre utilisée.

## 2. Envoyer les fichiers
Décompresse l’archive, puis envoie **le contenu du dossier**, pas le dossier lui-même :
- `index.html`
- `manifest.webmanifest`
- `service-worker.js`
- `icons/`
- `assets/`
- `.nojekyll`
- les autres fichiers fournis

## 3. Activer GitHub Pages
Dans le dépôt :
1. `Settings`
2. `Pages`
3. Source : `Deploy from a branch`
4. Branche : `main`
5. Dossier : `/ (root)`
6. Enregistrer

GitHub donnera une adresse HTTPS du type :
`https://TON-COMPTE.github.io/ocre-companion/`

## 4. Installer sur iPhone
1. Ouvre cette adresse dans Safari.
2. Touche le bouton Partager.
3. Choisis `Ajouter à l’écran d’accueil`.
4. Active `Ouvrir comme app web` si l’option apparaît.
5. Valide.

## 5. Sécurité
La progression reste locale sur l’iPhone. Fais régulièrement :
`Backup` → export JSON.
