# Gestion Salariale

Ce projet est une application de gestion salariale complète, divisée en deux parties principales : un backend (API) et un frontend (interface utilisateur).

## Technologies Utilisées

### Backend
*   **Node.js** avec **TypeScript**
*   **Express.js** pour le framework web
*   **Prisma** comme ORM pour l'interaction avec la base de données
*   **MySQL** (ou une base de données compatible SQL) pour le stockage des données
*   **JWT** (JSON Web Tokens) pour l'authentification
*   **Multer** pour la gestion des téléchargements de fichiers (logos d'entreprise)
*   **PDFKit** pour la génération de PDF (fiches de paie)

### Frontend
*   **React** avec **Vite** pour le développement rapide
*   **React Router DOM** pour la navigation
*   **Context API** pour la gestion de l'état global (authentification)
*   **Axios** pour les requêtes HTTP vers le backend
*   **Tailwind CSS** (ou un framework CSS similaire) pour le stylisme (à confirmer par l'analyse des fichiers CSS)

## Structure du Projet

Le projet est organisé en deux répertoires principaux : `backend` et `frontend`.

### `backend/`
Contient l'API RESTful qui gère la logique métier, l'accès à la base de données et l'authentification.

*   `src/controllers/`: Gère la logique de traitement des requêtes HTTP.
*   `src/middleware/`: Contient les middlewares pour l'authentification (JWT) et le téléchargement de fichiers.
*   `src/prisma/`: Contient le schéma de la base de données (`schema.prisma`), les migrations et les scripts de seed.
*   `src/routes/`: Définit les points d'API (endpoints) et les associe aux contrôleurs.
*   `src/service/`: Contient la logique métier et interagit avec Prisma pour les opérations de base de données.
*   `uploads/`: Stocke les fichiers téléchargés, comme les logos d'entreprise.
*   `.env`: Fichier de configuration des variables d'environnement.

### `frontend/`
Contient l'interface utilisateur construite avec React.

*   `src/pages/`: Composants de page pour les différentes vues de l'application (Login, Dashboard, Employees, etc.).
*   `src/components/`: Composants réutilisables.
*   `src/context/`: Gère l'état global de l'application, notamment l'authentification.
*   `public/`: Fichiers statiques.
*   `index.html`: Point d'entrée de l'application web.

## Comment Utiliser le Projet

Pour utiliser ce projet, vous devez configurer et exécuter à la fois le backend et le frontend.

### Prérequis

*   Node.js (version 18 ou supérieure recommandée)
*   npm ou yarn
*   Une base de données MySQL (ou compatible)
*   Git

### 1. Cloner le Dépôt

```bash
git clone https://github.com/Papa-Sidy-Fall/Gestion-salariale.git
cd Gestion-salariale
```

### 2. Configuration et Lancement du Backend

1.  **Naviguer vers le répertoire backend :**
    ```bash
    cd backend
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Configurer les variables d'environnement :**
    Créez un fichier `.env` à la racine du répertoire `backend/` et ajoutez les variables suivantes (adaptez les valeurs à votre environnement) :
    ```env
    DATABASE_URL="mysql://user:password@localhost:3306/salary_management_db"
    JWT_SECRET="votre_secret_jwt_fort"
    PORT=5000
    # Autres variables d'environnement nécessaires
    ```
    Assurez-vous que `DATABASE_URL` pointe vers votre instance de base de données MySQL.

4.  **Initialiser la base de données et exécuter les migrations :**
    ```bash
    npx prisma migrate dev --name initial_migration
    # Si vous avez déjà des migrations, vous pouvez simplement les appliquer :
    # npx prisma migrate deploy
    ```

5.  **Exécuter le script de seed (facultatif) :**
    Si vous souhaitez peupler votre base de données avec des données initiales :
    ```bash
    npx prisma db seed
    ```

6.  **Lancer le serveur backend :**
    ```bash
    npm run dev
    # ou
    yarn dev
    ```
    Le serveur devrait démarrer sur `http://localhost:5000` (ou le port spécifié dans votre `.env`).

### 3. Configuration et Lancement du Frontend

1.  **Naviguer vers le répertoire frontend :**
    ```bash
    cd ../frontend
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install
    # ou
    yarn install
    ```

3.  **Lancer l'application frontend :**
    ```bash
    npm run dev
    # ou
    yarn dev
    ```
    L'application frontend devrait démarrer sur `http://localhost:5173` (ou un autre port disponible).

### 4. Utilisation de l'Application

1.  Ouvrez votre navigateur et accédez à l'URL du frontend (par exemple, `http://localhost:5173`).
2.  Vous devriez être redirigé vers la page de connexion (`Login.jsx`).
3.  Utilisez les identifiants d'un utilisateur existant (si vous avez exécuté le script de seed) ou inscrivez-vous si l'application le permet.
4.  Explorez les différentes sections de l'application :
    *   **Dashboard** : Vue d'ensemble.
    *   **Companies** : Gestion des entreprises.
    *   **Employees** : Gestion des employés.
    *   **Attendances** : Suivi des présences.
    *   **Payments** : Gestion des paiements.
    *   **PayRuns** : Exécution des cycles de paie et génération des fiches de paie.

## Base de Données

Le fichier `salary_management.sql` semble être un dump ou un schéma SQL pour la base de données. Cependant, le projet utilise Prisma pour la gestion de la base de données, ce qui signifie que le schéma est défini dans `backend/prisma/schema.prisma` et les migrations sont gérées via Prisma Migrate. Il est recommandé de suivre le processus Prisma pour la configuration de la base de données.

## Contribution

Pour contribuer à ce projet, veuillez suivre les étapes suivantes :
1.  Forker le dépôt.
2.  Créer une nouvelle branche (`git checkout -b feature/nouvelle-fonctionnalite`).
3.  Effectuer vos modifications et les commiter (`git commit -am 'Ajout d'une nouvelle fonctionnalité'`).
4.  Pousser la branche (`git push origin feature/nouvelle-fonctionnalite`).
5.  Ouvrir une Pull Request.
