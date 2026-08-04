# Changelog

## 11.1.0 — Bestiaire enrichi
- Filtres par type, étape, statut de quête, stock et niveau d’audit.
- Navigation directe monstre ↔ archimonstre.
- Fiches enrichies avec progression, stock et qualité des données.
- Accès direct à l’étape de quête et ajout rapide au stock.
- Indicateurs visuels d’audit des familles et zones.

## 11.0.0 — Smart Companion
- Tableau de bord entièrement refondu.
- Résumé immédiat : étape, archis restants, stock, doublons, équipe et étapes terminables.
- Moteur local de recommandation fondé uniquement sur la progression et l’inventaire.
- Accès rapides vers Quête, Inventaire, Chasse et Bestiaire.
- Meilleure navigation vers les modules cachés du menu principal.
- Conservation de toutes les fonctionnalités V10 et des sauvegardes existantes.

## 11.2.0
- Assistant Ocre 2.0 et recommandations selon durée.
- Analyse intelligente et prudente de l’inventaire.

## 11.3.0
- Ajout du moteur central de calcul.
- Suppression de plusieurs calculs dupliqués.
- Ajout de tests de contrat du moteur.

## 11.4.0
- Centre d’audit local et chasse filtrable par données vérifiées.

## 11.5.0

- Rapport de qualité intégré au Bestiaire.
- Détection des familles, zones, niveaux et sources manquants.
- Détection des plages de niveaux incohérentes.
- Détection des zones recommandées absentes de la liste des zones.
- Contrôle des relations de quête, identifiants et noms dupliqués.
- Filtre du Bestiaire par type de problème.
- Bouton « Corriger la prochaine fiche ».
- Export d’un rapport qualité JSON.
- Validation renforcée lors de l’édition d’une fiche.
- Scores de priorité par famille et zone auditées.
- Moteur central mis à jour en version 11.5.
- Aucune donnée Dofus Unity.

## 11.6.0

- Nouvelle page Atelier d’audit.
- File de fiches « à compléter », « à vérifier » ou « validées ».
- Filtres par champ manquant et recherche.
- Progression globale de l’audit.
- Édition rapide d’une fiche depuis la file.
- Validation impossible tant qu’une fiche comporte encore des erreurs.
- Actions par lot sur les fiches visibles.
- Export/import de l’avancement de l’audit.
- Une fiche modifiée passe automatiquement en statut « à vérifier ».
- Moteur central enrichi avec le résumé du workflow d’audit.
- Aucune donnée Dofus Unity.

## 12.0.0

- Onglet Chasse réintégré dans la navigation principale.
- Tableau de bord de chasse : restants, stock, favoris et circuits.
- Parcours recommandés par zone, famille ou circuit personnel.
- Scores calculés depuis la progression, le stock et les données auditées.
- Durées de session : 30 minutes, 1 heure, 2 heures ou soirée.
- Génération d’un plan de session ordonné.
- Circuits personnels épinglables.
- Ouverture directe d’un circuit dans les filtres de chasse.
- Aucune zone ou famille inventée lorsque la base n’est pas auditée.
- Moteur central mis à jour en version 12.0.

## 12.1.0

- Démarrage d’une session directement depuis un plan de chasse généré.
- Chronomètre en temps réel.
- Liste des cibles provenant des parcours sélectionnés.
- Bouton +1 trouvé pendant la session.
- Mise à jour automatique de l’inventaire et du journal.
- Fin ou annulation contrôlée d’une session.
- Historique des 100 dernières sessions.
- Bilan : durée, captures, archimonstres uniques et nombre de parcours.
- Données de session indépendantes pour chaque aventure.
- Moteur central mis à jour en version 12.1.

## 12.2.0

- Mise en pause et reprise d’une session.
- Récupération automatique d’une session active après fermeture de la PWA.
- Chronomètre excluant le temps passé en pause.
- Notes sur une session en cours.
- Rendement en captures par heure.
- Statistiques : captures, uniques, cibles et parcours.
- Renommage et suppression des anciens bilans.
- Comparaison du rendement des parcours.
- Classement des parcours selon les données personnelles.
- Moteur central mis à jour en version 12.2.

## 12.3.0

- Vue détaillée d’un ancien bilan de session.
- Liste des parcours et des captures d’une session.
- Export JSON d’une session unique.
- Export JSON de tout l’historique.
- Export CSV compatible tableur.
- Meilleur parcours personnel affiché sur l’accueil.
- Record de rendement dans le mode Chasse.
- Consolidation des statistiques personnelles.
- Moteur central mis à jour en version 12.3.

## 12.4.0

- Graphique d’évolution du rendement.
- Périodes de 5, 10 ou 20 sessions.
- Tendance en hausse, baisse ou stable.
- Comparaison directe entre deux sessions.
- Mise en avant de la meilleure session.
- Comparaison de la durée, des captures, des uniques et du rendement.
- Moteur central enrichi avec sessionTrend et compareSessions.
- Toutes les fonctions V12.3 conservées.

## 12.5.0

- Création d’objectifs personnels.
- Objectifs par captures, uniques, sessions ou minutes.
- Périodes de 7 jours, 30 jours ou sans limite.
- Progression et validation automatique des objectifs.
- Bilans d’activité sur 7 et 30 jours.
- Rendement récent et rendement mensuel.
- Alertes de tendance et objectif le plus proche.
- Records personnels par zone et famille auditées.
- Moteur central mis à jour en version 12.5.

## 12.6.0

- Objectifs limités à une zone auditée.
- Objectifs limités à une famille auditée.
- Progression automatique selon le périmètre choisi.
- Sélecteurs alimentés uniquement par les données Rétro auditées.
- Récapitulatif mensuel intégré.
- Export JSON du bilan mensuel.
- Mise en avant de la zone et famille les plus actives.
- Alertes intégrées pour les objectifs atteints et les périmètres incomplets.
- Moteur central mis à jour en version 12.6.

## 12.7.0

- Calendrier mensuel des sessions de chasse.
- Navigation entre les mois.
- Affichage du nombre de sessions et captures par jour.
- Nouveau type d’objectif : terminer une étape de l’Éternelle Moisson.
- Progression automatique d’un objectif d’étape.
- Accès direct à l’étape ciblée.
- Rappels visuels intégrés et désactivables.
- Alertes pour les étapes terminables, objectifs proches et sessions actives.
- Moteur central mis à jour en version 12.7.

## 12.8.0

- Ouverture d’une journée du calendrier.
- Liste détaillée des sessions, captures, uniques et durée de la journée.
- Accès au bilan complet d’une session depuis le calendrier.
- Export JSON d’une journée précise.
- Export JSON du mois affiché.
- Nouveau type d’objectif : nombre d’étapes terminées.
- Progression automatique de l’objectif selon la quête réelle.
- Accès direct à la quête depuis l’objectif.
- Moteur central mis à jour en version 12.8.

## 12.9.0

- Vue annuelle de l’activité de chasse.
- Navigation entre les années.
- Résumé annuel : sessions, captures, uniques et temps.
- Accès direct à un mois depuis la vue annuelle.
- Import d’un export mensuel.
- Fusion sans doublonner les sessions déjà présentes.
- Nouveau type d’objectif : archimonstres uniques validés dans la quête.
- Progression calculée depuis l’état réel de l’Éternelle Moisson.
- Moteur central mis à jour en version 12.9.

## 13.0.0

- Export JSON d’un bilan annuel complet.
- Comparaison directe entre deux années.
- Comparaison des sessions, captures, uniques, durée et rendement.
- Tableau des records personnels.
- Meilleure année, meilleur mois, meilleur rendement mensuel et meilleure session.
- Indicateur d’achèvement des fonctions majeures.
- Indicateur séparé de complétion des données auditées.
- L’application indique clairement que le projet n’est pas encore entièrement terminé.
- Moteur central mis à jour en version 13.0.

## 13.1.0

- Suppression des rendus dupliqués dans la mise à jour globale.
- Nouveau menu « Plus » pour accéder aux modules secondaires.
- Navigation mobile plus compacte.
- Page de diagnostic local.
- Vérification du moteur, de la sauvegarde, de la base et du service worker.
- Réparation et normalisation de la sauvegarde locale.
- Export d’une sauvegarde d’urgence.
- Détection et installation des mises à jour PWA.
- Gestion du service worker en attente.
- Toutes les fonctions V13 sont conservées.

## 1.0.0 — Stable

- Suivi exact des 35 étapes de l’Éternelle Moisson.
- Base de 299 monstres, 51 boss et 286 archimonstres.
- Plusieurs aventures et équipes jusqu’à huit personnages.
- Inventaire quantitatif, doublons et journal.
- Assistant de rendu et détection des étapes terminables.
- Bestiaire relationnel et atelier d’audit.
- Mode Chasse 2.0, circuits et sessions chronométrées.
- Statistiques, tendances, comparaisons et records personnels.
- Objectifs personnels et objectifs de progression de quête.
- Calendriers mensuel et annuel.
- Imports, exports et sauvegardes d’urgence.
- Migration unifiée vers le schéma 14.
- Diagnostic local et réparation des sauvegardes.
- PWA installable, mises à jour contrôlées et mode hors ligne.
- Données exclusivement Dofus Rétro.

## 1.0.1 — Hotfix

- « Tout valider » met immédiatement à jour les coches.
- Chaque objectif validé peut être décoché.
- Décocher une ancienne étape replace correctement l’étape active.
- Le bouton flottant « + » ouvre la fenêtre d’ajout de capture.
- Les fonctions d’ouverture et de fermeture des fenêtres ont été restaurées.
- Les durées de l’Assistant actualisent immédiatement la recommandation.
- Une erreur dans un module secondaire ne bloque plus toute l’interface.
- L’étape actuellement ouverte est rafraîchie après chaque sauvegarde.
- L’Assistant affiche une recommandation de secours en cas d’erreur.

## 1.0.2 — Profils & équipes

- Suppression du prénom « Thomas » comme valeur codée par défaut.
- Nouveau profil local personnalisable pour chaque utilisateur.
- Nom du profil séparé du nom de l’aventure.
- Migration de l’ancien nom par défaut « Thomas — Rétro » vers « Mon aventure ».
- Gestion visuelle de l’équipe : ajout, renommage et suppression de personnages.
- Limite claire de huit personnages.
- L’en-tête affiche profil, aventure et taille de l’équipe.
- L’Assistant confirme visuellement la durée sélectionnée.
- La recommandation affiche la durée utilisée.
- Explication lorsque plusieurs durées produisent la même recommandation.

## 1.0.3 — Tableau de bord

- Suppression de « Priorité recommandée » sur l’accueil.
- Suppression de « À faire maintenant » sur l’accueil.
- La Vue immédiate compte directement les cases cochées dans les 15 étapes Archimonstres.
- Le compteur ne dépend plus de l’inventaire.
- Correction de la liaison d’un archimonstre avec son étape de quête (`questStage`).
- Les 286 archimonstres sont désormais répartis correctement entre validés et restants.
- L’Assistant reste accessible dans Plus comme module expérimental.

## 1.0.4 — Tableau de bord fiable

- Correction de la cause réelle des compteurs figés.
- La progression de quête est affichée avant les calculs secondaires.
- Les archimonstres validés sont comptés directement depuis les cases cochées.
- Le nombre d’étapes terminées est calculé sans dépendre de l’inventaire.
- Une erreur du moteur d’inventaire ne bloque plus « Vue immédiate ».
- Une erreur du calcul des étapes terminables affiche « — » au lieu d’une fausse valeur.
- Le tableau de bord est rafraîchi explicitement après chaque sauvegarde.

## 1.0.5 — Mise à jour intégrée

- Détection automatique des nouvelles versions publiées sur GitHub Pages.
- Écran intégré « Mettre à jour / Plus tard ».
- Affichage de la version actuelle et de la nouvelle version.
- Conservation de toutes les données locales pendant la mise à jour.
- Sauvegarde automatique de sécurité avant installation.
- Nettoyage contrôlé des anciens caches PWA.
- Installation déclenchée uniquement après confirmation de l’utilisateur.
- Vérification automatique à l’ouverture et au retour dans l’application.
- Bouton manuel « Rechercher une mise à jour » dans le diagnostic.
- Cette version doit être installée une dernière fois manuellement ; les suivantes pourront passer par l’écran intégré.
