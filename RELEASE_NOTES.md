# Ocre Companion 1.0.6 — Correctif mises à jour

- Réécriture complète du service worker.
- `SKIP_WAITING` fonctionne réellement.
- Suppression des anciens caches Ocre Companion lors de l’activation.
- `VERSION.json` est toujours lu depuis le réseau.
- Navigation en stratégie réseau d’abord avec secours hors-ligne.
- Ressources statiques en cache d’abord.
- Un seul gestionnaire `fetch`.
- Rechargement automatique lorsque le nouveau service worker prend le contrôle.
- Sauvegarde locale conservée avant mise à jour.
- À partir de cette version, les futures mises à jour doivent pouvoir s’installer sans supprimer la PWA.
