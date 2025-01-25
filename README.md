# TP3 Full Stack - Application de Gestion de Boutiques

## Auteurs

- Elias LARBI
- Zine-eddine TOUBAL

## Aperçu des Mises à Jour

Ce document détaille les changements et améliorations apportés à l'application de gestion de boutiques dans le cadre du TP3.

### Mises à Jour Majeures

1. **Mises à Jour des Frameworks**

   - Mise à jour de Spring Boot vers la dernière version LTS
   - Mise à jour de toutes les dépendances vers leurs versions compatibles les plus récentes
   - Correction des configurations obsolètes

2. **Intégration d'Elasticsearch**

   - Ajout du support Elasticsearch pour la recherche en texte intégral
   - Implémentation de l'indexation des boutiques dans Elasticsearch
   - Ajout de fonctionnalités de recherche avec plusieurs filtres :
     - Recherche en texte intégral sur les noms des boutiques
     - Filtrage par statut de vacances
     - Filtrage par plage de dates

3. **Améliorations Frontend**

   - Application rendue entièrement responsive pour les appareils mobiles
   - Mise à jour du style des composants pour une meilleure expérience mobile
   - Amélioration de l'adaptabilité de la mise en page pour différentes tailles d'écran
   - Amélioration des composants de l'interface utilisateur :
     - Cartes des boutiques
     - Cartes des produits
     - Cartes des catégories
     - Menu de navigation

4. **Architecture de l'Application**
   - Amélioration de la configuration Docker
   - Ajout de vérifications de santé pour les services
   - Amélioration de la gestion des dépendances des services
   - Mise à jour des fichiers de configuration pour une meilleure stabilité

### Détails Techniques

#### Modifications Backend

- Ajout de la configuration Elasticsearch dans Spring Boot
- Implémentation de l'intégration Hibernate Search
- Amélioration de l'indexation de la base de données
- Mise à jour des points d'API pour supporter la fonctionnalité de recherche

#### Modifications Frontend

- Implémentation du design responsive avec les points de rupture de Material-UI
- Amélioration des performances de rendu des composants
- Ajout de définitions de types appropriées pour TypeScript

### Configuration Docker

- Mise à jour de la configuration des services dans docker-compose.yml
- Ajout de vérifications de santé appropriées pour les conteneurs
- Amélioration de la gestion des dépendances des services
- Amélioration de la gestion des volumes pour la persistance des données

### Comment Exécuter

1. Assurez-vous que Docker et Docker Compose sont installés
2. Clonez le dépôt
3. Lancez l'application :

```bash
docker-compose up
```

4. Attendez (assez longtemps, ça tarde)

### Points d'Accès

- Frontend : http://localhost:4200
- API Backend : http://localhost:8080
- Elasticsearch : http://localhost:9200

### Prérequis Techniques

- Docker
- Docker Compose
- Node.js (pour le développement local)
- Java 21 (pour le développement local)
- PostgreSQL (géré par Docker)
- Elasticsearch (géré par Docker)
