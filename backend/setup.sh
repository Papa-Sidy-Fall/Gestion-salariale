#!/bin/bash

# ===============================
# Script d'installation projet Node + TS + Prisma + MySQL
# ===============================

# Vérification de Node et npm
echo "=== Vérification de Node.js et npm ==="
node -v || { echo "Node.js non installé. Installe-le avant de continuer."; exit 1; }
npm -v || { echo "npm non installé. Installe-le avant de continuer."; exit 1; }

# Création du projet
echo "=== Création du projet ==="
mkdir my-app && cd my-app

# Initialisation npm
npm init -y

# Installation des dépendances principales
echo "=== Installation des dépendances ==="
npm install express prisma @prisma/client mysql2 zod bcrypt jsonwebtoken

# Installation des dépendances de dev
echo "=== Installation des dépendances de développement ==="
npm install -D typescript ts-node nodemon @types/node @types/express @types/bcrypt @types/jsonwebtoken

# Initialisation de TypeScript
echo "=== Initialisation de TypeScript ==="
npx tsc --init --rootDir src --outDir dist --esModuleInterop --resolveJsonModule --module commonjs --allowJs true --checkJs true

# Création des dossiers
echo "=== Création de l'arborescence du projet ==="
mkdir src
touch src/index.ts

# Configuration Nodemon
echo "=== Configuration Nodemon ==="
cat <<EOL > nodemon.json
{
  "watch": ["src"],
  "ext": "ts",
  "exec": "ts-node src/index.ts"
}
EOL

# Initialisation de Prisma
echo "=== Initialisation de Prisma ==="
npx prisma init

# Mise en place de base index.ts
cat <<EOL > src/index.ts
import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

app.get("/", (req: Request, res: Response) => {
  res.send("🚀 Serveur Express + TypeScript prêt !");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(\`Serveur lancé sur http://localhost:\${PORT}\`));
EOL

echo "=== Installation terminée ✅ ==="
echo "👉 Étapes suivantes :"
echo "1. Configure ton .env avec DATABASE_URL pour MySQL"
echo "2. Lance le serveur avec : npm run dev"
