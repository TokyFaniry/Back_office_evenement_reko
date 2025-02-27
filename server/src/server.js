import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import session from "express-session";
import logger from "./config/logger.js";
import sequelize from "./config/database.js";
import routers from "./routes/index.js";

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
  express.static(path.join(__dirname, "..", "public", "uploads"))
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

const PORT = process.env.PORT || 5000;

// Tester la connexion à la base de données et démarrer le serveur
sequelize
  .authenticate()
  .then(() => {
    console.log("Connexion à la base de données réussie !");
    app.listen(PORT, "0.0.0.0", () => {
      logger.info(`Server running on port ${PORT}`);
      logger.info(`http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Impossible de se connecter à la base de données :", error);
  });
