import { Sequelize } from "sequelize";
import logger from "./logger.js";

// Validation des variables d'environnement
const requiredEnvVars = ["DB_NAME", "DB_USER", "DB_PASSWORD", "DB_HOST"];
requiredEnvVars.forEach((env) => {
  if (!process.env[env]) {
    logger.error(`Variable d'environnement manquante: ${env}`);
    process.exit(1);
  }
});

// Configuration adaptive selon l'environnement
const isProduction = process.env.NODE_ENV === "production";

const sequelizeConfig = {
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: (msg) => logger.debug(msg), // Niveau debug pour les requêtes SQL
  define: {
    timestamps: true,
    underscored: true,
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: isProduction
    ? {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      }
    : {},
};

if (!isProduction) {
  sequelizeConfig.logging = console.log; // Logging plus verbeux en dev
}

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  sequelizeConfig
);

// Test de connexion à la base de données
(async () => {
  try {
    await sequelize.authenticate();
    logger.info("Connexion à la base de données établie avec succès.");
  } catch (error) {
    logger.error(
      `Impossible de se connecter à la base de données: ${error.message}`
    );
    process.exit(1);
  }
})();

export default sequelize;
