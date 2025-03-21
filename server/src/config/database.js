import dotenv from "dotenv";
dotenv.config();

import { Sequelize } from "sequelize";
import logger from "./logger.js";

// Vérification des variables d'environnement obligatoires
const requiredEnvVars = ["DB_NAME", "DB_USER", "DB_HOST"];
requiredEnvVars.forEach((envVar) => {
  if (!process.env[envVar]) {
    logger.error(`Variable d'environnement manquante: ${envVar}`);
    process.exit(1);
  }
});

// DB_PASSWORD autorisé à être une chaîne vide
const dbPassword =
  process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : "";

const isProduction = process.env.NODE_ENV === "production";

const sequelizeConfig = {
  host: process.env.DB_HOST,
  dialect: process.env.DB_DIALECT || "postgres",
  logging: isProduction ? (msg) => logger.debug(msg) : console.log,
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

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  dbPassword,
  sequelizeConfig
);

export default sequelize;
