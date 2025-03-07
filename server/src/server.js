import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import logger from "./config/logger.js";
import sequelize from "./config/database.js";
import routers from "./routes/index.js";
import mysql from "mysql2/promise";
import { Umzug, SequelizeStorage } from "umzug";

dotenv.config();

const app = express();

// Configuration de CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
    exposedHeaders: ["Authorization"],
  })
);

// Middleware pour parser le corps des requêtes en JSON
app.use(express.json());

// Configuration pour servir les fichiers statiques depuis "public/uploads"
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use(
  "/uploads",
  express.static(path.join(process.cwd(), "..", "public", "uploads"))
);

// Nouveau middleware pour servir les images des événements depuis "public/events"
app.use(
  "/events",
  express.static(path.join(__dirname, "..", "public", "events"))
);

// Configuration de la session pour Passport
app.use(
  session({
    secret: "Reko2025",
    resave: false,
    saveUninitialized: false,
  })
);

// Routes pour la gestion des événements
app.use("/api", routers);

const PORT = process.env.PORT || 3000;

// Gestion des erreurs de démarrage
process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", error);
});

process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled Rejection at:", promise, "reason:", reason);
});

/**
 * Vérifie si la base de données existe, sinon la crée.
 */
async function createDatabaseIfNotExists() {
  try {
    // Se connecter à MySQL sans préciser la base de données
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD || "",
    });
    // Créer la base de données si elle n'existe pas
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`
    );
    await connection.end();
    logger.info(`Base de données "${process.env.DB_NAME}" vérifiée/créée.`);
  } catch (error) {
    logger.error("Erreur lors de la création de la base de données :", error);
    process.exit(1);
  }
}

/**
 * Exécute toutes les migrations avec Umzug.
 */
async function runMigrations() {
  try {
    const umzug = new Umzug({
      migrations: { glob: "migrations/*.js" },
      context: sequelize.getQueryInterface(),
      storage: new SequelizeStorage({ sequelize }),
      logger,
    });
    await umzug.up();
    logger.info("Toutes les migrations ont été exécutées avec succès.");
  } catch (error) {
    logger.error("Erreur lors de l'exécution des migrations :", error);
    process.exit(1);
  }
}

// Démarrage du serveur : vérifier/créer la DB, exécuter les migrations, puis lancer le serveur
(async () => {
  await createDatabaseIfNotExists();
  try {
    await sequelize.authenticate();
    logger.info("Connexion à la base de données établie avec succès.");
    await runMigrations();
    app.listen(PORT, "0.0.0.0", () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error("Impossible de se connecter à la base de données :", error);
    process.exit(1);
  }
})();
