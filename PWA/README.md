# TP E-com et e-mobilite

Auteur: TRAN Bao Thien - uapv1900181 - M2 ILSEN CLA

## STRUCTURE DE PROJET

### Composant principal
- `ProductComponent` : pour construire le UI principal et manipuler les tâches du projet
- `DialogOverviewExampleDialog` : c'est le modal du produit proposé
- `DialogEdit` : c'est le modal pour modifier coordonne du produit

### Service worker
Pour construire service worker dans ce projet. On va utiliser  `work-build` pour combiner mon `custom-sw` avec la configuration au répertoire `/dist`
- `workbox-config.js` la configuration du service worker
- `main.ts` : inscrire le service worker par le fonction `registerServiceWorker`
- `custom-sw.js` : gérer les écouteurs d'événements et catching les données
- Un serveur notification `Server/server.js` avec `web-push` pour pousser la notification

### Données factices
Il y a deux tableaux principaux:
+ `products` : données détaillées du produit
+ `coordonnee` : coordonnee du produit

## PROJET D`EXECUTION

On a deux mode pour exécution: développement et production. Service worker seulement marche dans le mode de production

### Installation les bibliothèques

`npm i`

### Serveur de développement

Exécuter `cd PWA` après `npm start` pour un serveur de développement

### Build

Exécuter `npm run build` pour construire le projet et workbox (service worker). Les artefacts de construction seront stockés dans le répertoire `dist/PWA`.

### Serveur de production

Exécuter `npm run start-server` pour lancer un serveur via `http-server` 
Exécuter `cd Server` après `npm start` pour un serveur de la notification

### Bibliothèque d'utilisation
- `@angular/material` pour css composant
- `workbox-build` produire `workbox-config` et construire service worker pour le system
- `http-server` pour serveur de production