import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import logger from "./config/logger.js";
import sequelize from "./config/database.js";
import routers from "./routes/index.js";
import pkg from "pg";
const { Client } = pkg; // Import du module pg en mode CommonJS
import { Umzug, SequelizeStorage } from "umzug";
import http from "http";
import { initSocket } from "./config/socket.js"; // Initialisation de Socket.IO
import { Sequelize } from "sequelize"; // Pour le contexte des migrations
import { createRequire } from "module"; // Pour utiliser require en ESM
const require = createRequire(import.meta.url);

dotenv.config();

console.log("🔑 Mot de passe utilisé :", process.env.DB_PASSWORD);

const app = express();

// Configuration de CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
);

// Middleware pour parser les requêtes en JSON
app.use(express.json());

// Configuration des fichiers statiques
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(__filename);
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "public", "uploads"))
);
app.use("/events", express.static(path.join(_dirname, "public", "events")));

// Configuration de la session
app.use(
  session({
    secret: "Reko2025",
    resave: false,
    saveUninitialized: false,
  })
);

// Routes de l'API
app.use("/api", routers);

// Port d'écoute
const PORT = process.env.PORT || 3001;

/**
 * Vérifie si la base de données existe, sinon la crée.
 * Pour PostgreSQL, on se connecte à la base "postgres" (par défaut)
 * et on vérifie si la base cible existe.
 */
async function createDatabaseIfNotExists() {
  const { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } = process.env;
  const client = new Client({
    host: DB_HOST,
    port: DB_PORT,
    user: DB_USER,
    password: DB_PASSWORD,
    database: "postgres", // Connexion à la base par défaut
  });

  try {
    await client.connect();
    const res = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [DB_NAME]
    );
    if (res.rowCount === 0) {
      await client.query(`CREATE DATABASE "${DB_NAME}"`);
      logger.info(`🆕 Base de données "${DB_NAME}" créée.`);
    } else {
      logger.info(`📚 Base de données "${DB_NAME}" existe déjà.`);
    }
  } catch (error) {
    logger.error(
      "❌ Erreur lors de la création de la base de données :",
      error
    );
    process.exit(1);
  } finally {
    await client.end();
  }
}

/**
 * Exécute les migrations avec Umzug.
 * Nous utilisons l'option "resolve" pour injecter le contexte nécessaire dans chaque migration.
 */
async function runMigrations() {
  try {
    const umzug = new Umzug({
      migrations: {
        glob: "migrations/*.cjs",
        resolve: ({ name, path, context }) => {
          // Utilise require pour charger le module de migration
          const migration = require(path);
          return {
            name,
            up: async () =>
              migration.up({
                queryInterface: sequelize.getQueryInterface(),
                Sequelize,
              }),
            down: async () =>
              migration.down({
                queryInterface: sequelize.getQueryInterface(),
                Sequelize,
              }),
          };
        },
      },
      storage: new SequelizeStorage({ sequelize }),
      logger,
    });
    await umzug.up();
    logger.info("✅ Toutes les migrations ont été exécutées avec succès.");
  } catch (error) {
    logger.error("❌ Erreur lors de l'exécution des migrations :", error);
    process.exit(1);
  }
}

// Démarrage du serveur
(async () => {
  await createDatabaseIfNotExists();
  try {
    await sequelize.authenticate();
    logger.info("🔌 Connexion à la base de données établie avec succès.");
    await runMigrations();

    // Création du serveur HTTP
    const server = http.createServer(app);
    initSocket(server);

    server.listen(PORT, "0.0.0.0", () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`🌐 http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("❌ Impossible de se connecter à la base de données :", error);
    process.exit(1);
  }
})();
